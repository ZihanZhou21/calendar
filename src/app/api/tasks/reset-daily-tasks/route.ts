import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    // 1. 获取今天的“00:00:00”
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 2. 查找所有DailyTask (或仅进行中的)
    const dailyTasks = await DailyTask.find({})

    for (const dt of dailyTasks) {
      if (!dt.currentDate) {
        // 若没有设置, 初始化为创建日期的0点
        dt.currentDate = new Date(dt.createdAt || Date.now())
        dt.currentDate.setHours(0, 0, 0, 0)
      }

      // 如果已完成，可以根据业务逻辑跳过
      if (dt.isCompleted) {
        continue
      }

      // 比较 currentDate 与 今日
      const dtDate = new Date(dt.currentDate)
      dtDate.setHours(0, 0, 0, 0)

      if (dtDate.getTime() === today.getTime()) {
        // 已是今日 => 不更新
        continue
      }

      // 3. 如果不是今天 => 跨日，需要更新
      const task = await Task.findById(dt.taskId)
      if (!task) continue

      // 3.1. 计算“昨日实际用量”
      const usedTime = dt.dailyDuration - dt.remainingDuration
      if (usedTime > 0) {
        // 从主任务的 remainingDuration 中扣除
        task.remainingDuration = Math.max(task.remainingDuration - usedTime, 0)
      }

      // 3.2. 动态计算剩余天数：根据 endDate - today
      //    remainingDays = floor( (endDate - today) / (24h) ) + 1
      //    如果今天已经到达/过了 endDate, remainingDays = 0
      const endDate = new Date(task.endDate)
      endDate.setHours(0, 0, 0, 0)

      // today 也已是00:00:00
      let diffMs = endDate.getTime() - today.getTime()
      let newRemainingDays = 0
      if (diffMs >= 0) {
        // +1 代表今天也算在内
        newRemainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
      }

      // 3.3. 用新的 remainingDays 来分配 dailyDuration
      let newDailyDuration = 0
      if (newRemainingDays > 0 && task.remainingDuration > 0) {
        newDailyDuration = Math.floor(task.remainingDuration / newRemainingDays)
      } else {
        // 若0天或0时长 => 分配全部或0
        newDailyDuration = task.remainingDuration
      }

      // 3.4. 更新DailyTask
      dt.dailyDuration = newDailyDuration
      dt.remainingDuration = newDailyDuration
      dt.isCompleted = false
      dt.currentDate = new Date(today)

      // 3.5. 如需更新 Task 的 remainingDays (可选)，以便在前端展示
      // task.remainingDays = newRemainingDays

      await dt.save()
      await task.save()
    }

    return NextResponse.json({
      success: true,
      message: '每日任务根据日期检查并更新完成',
    })
  } catch (error: any) {
    console.error('Error updating daily tasks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
