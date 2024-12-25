import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import Task from '@/models/Task'
import DailyTask from '@/models/DailyTask'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    // 1. 查找所有“正在进行中的”主任务
    //    条件示例：remainingDuration>0 & remainingDays>0
    const tasks = await Task.find({
      remainingDuration: { $gt: 0 },
      remainingDays: { $gt: 0 },
    })

    for (const task of tasks) {
      // 2. 找到与主任务对应的 DailyTask（若一对一关系）
      const dailyTask = await DailyTask.findOne({ taskId: task._id })
      if (!dailyTask) {
        // 如果没找到对应的DailyTask，可根据需求创建或跳过
        continue
      }

      // --------------------------------------------------------------------
      // 3. 计算“当日实际使用的时长”:
      //
      // dailyTask.dailyDuration：今日分配的总时长
      // dailyTask.remainingDuration：当日还剩多少没用
      // => 实际使用 = (dailyTask.dailyDuration - dailyTask.remainingDuration)
      // --------------------------------------------------------------------
      // const usedTime = dailyTask.dailyDuration - dailyTask.remainingDuration

      // // 如果 usedTime>0，说明确实用了部分或全部
      // // => 从主任务剩余时长中扣除这部分。
      // if (usedTime > 0) {
      //   // 确保不出现负数
      //   task.remainingDuration = Math.max(0, task.remainingDuration - usedTime)
      // }
      // 注意：不再把 dailyTask.remainingDuration “加回” 主任务！

      // 4. 主任务剩余天数减1 （如业务需要）
      //    如果天数耗尽，可以设为 0，表示到期
      if (task.remainingDays > 1) {
        task.remainingDays -= 1
      } else {
        task.remainingDays = 0
      }

      // 5. 重新计算新的 dailyDuration
      let newDailyDuration = 0
      if (task.remainingDays > 0 && task.remainingDuration > 0) {
        newDailyDuration = Math.floor(
          task.remainingDuration / task.remainingDays
        )
      } else {
        // 若已无天数或剩余时长，则一次性分配
        newDailyDuration = task.remainingDuration
      }

      // 6. 更新 DailyTask：重置为“新一天的配额”
      dailyTask.dailyDuration = newDailyDuration
      dailyTask.remainingDuration = newDailyDuration
      dailyTask.isCompleted = false

      // 7. 保存 DailyTask & Task
      await dailyTask.save()
      await task.save()
    }

    // 8. 返回成功消息
    return NextResponse.json({
      success: true,
      message: '每日任务重置完成',
    })
  } catch (error: any) {
    console.error('Error resetting daily tasks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
