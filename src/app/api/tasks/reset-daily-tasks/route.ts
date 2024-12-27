// src/app/api/tasks/reset-daily-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'
import { isSameDay, differenceInDays } from 'date-fns'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    // 1. 获取今天的日期
    const today = new Date()

    // 2. 查找所有未完成的 DailyTask
    const dailyTasks = await DailyTask.find()

    for (const dt of dailyTasks) {
      // 3. 初始化 currentDate 如果未设置
      if (!dt.currentDate) {
        dt.currentDate = dt.createdAt || new Date()
      }

      // 4. 比较 currentDate 与 今天
      const dtDate = new Date(dt.currentDate)
      if (isSameDay(dtDate, today)) {
        // 已是今日 => 不更新
        continue
      }

      // 5. 如果不是今天 => 跨日，需要更新
      if (!dt.taskId) {
        console.error('Missing taskId for daily task:', dt._id)
        continue
      }

      let task: any
      try {
        task = await Task.findById(dt.taskId).exec()
        if (!task && task.isCompleted === true) {
          console.error(`Task not found with ID: ${dt.taskId}`)
          continue
        }
        console.log('Found task:', {
          taskId: task._id,
          title: task.title,
          remainingDuration: task.remainingDuration,
        })
      } catch (error) {
        console.error(`Error finding task ${dt.taskId}:`, error)
        continue
      }

      // 6. 计算“昨日实际用量”
      // const usedTime = dt.dailyDuration - dt.remainingDuration
      // if (usedTime > 0) {
      //   // 从主任务的 remainingDuration 中扣除
      //   task.remainingDuration = Math.max(task.remainingDuration - usedTime, 0)
      // }

      // 7. 动态计算剩余天数：根据 endDate - today
      const endDate = new Date(task.endDate)
      let newRemainingDays = differenceInDays(endDate, today) + 1 // 包括今天
      newRemainingDays = newRemainingDays >= 0 ? newRemainingDays : 0

      // 8. 用新的 remainingDays 来分配 dailyDuration
      let newDailyDuration = 0
      if (newRemainingDays > 0 && task.remainingDuration > 0) {
        newDailyDuration = Math.floor(task.remainingDuration / newRemainingDays)
      } else {
        // 若0天或0时长 => 分配全部或0
        newDailyDuration = task.remainingDuration
      }

      // 9. 更新 DailyTask
      dt.dailyDuration = newDailyDuration
      dt.remainingDuration = newDailyDuration
      dt.isCompleted = false
      dt.currentDate = today // 直接设置为今天的日期

      // 10. 可选：更新 Task 的 remainingDays（用于前端展示）
      task.remainingDays = newRemainingDays

      // 11. 保存更改
      try {
        await dt.save()
        await task.save()
      } catch (error) {
        console.error(
          `Error saving updates for DailyTask ${dt._id} and Task ${task._id}:`,
          error
        )
        continue
      }
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
