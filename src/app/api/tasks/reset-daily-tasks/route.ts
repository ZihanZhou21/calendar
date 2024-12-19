import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'
import dbConnect from '@/utils/dbConnect'

export async function PUT() {
  await dbConnect()

  try {
    // 删除所有未完成的每日任务
    await DailyTask.deleteMany({})

    // 获取所有未完成的主任务
    const tasks = await Task.find({ remainingDuration: { $gt: 0 } })

    const newDailyTasks = []

    for (const task of tasks) {
      const dailyDuration = Math.min(
        task.remainingDuration,
        Math.floor(task.totalDuration / task.totalDays)
      )

      const newDailyTask = await DailyTask.create({
        taskId: task._id,
        title: `${task.title} - 新每日任务`,
        dailyDuration,
        remainingDuration: dailyDuration,
        isCompleted: false,
      })

      newDailyTasks.push(newDailyTask)
    }

    return NextResponse.json(
      { success: true, data: newDailyTasks },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
