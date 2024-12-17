import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'
import dbConnect from '@/utils/dbConnect'

export async function PUT(req: NextRequest) {
  await dbConnect()
  try {
    const incompleteDailyTasks = await DailyTask.find({ isCompleted: false })
    for (const dailyTask of incompleteDailyTasks) {
      const task = await Task.findById(dailyTask.taskId)
      if (task) {
        task.remainingDuration += dailyTask.remainingDuration
        await task.save()
      }
      await DailyTask.deleteOne({ _id: dailyTask._id })
    }
    const tasks = await Task.find({ remainingDuration: { $gt: 0 } })
    for (const task of tasks) {
      const dailyDuration = Math.min(
        task.remainingDuration,
        Math.floor(task.totalDuration / task.totalDays)
      )
      await DailyTask.create({
        taskId: task._id,
        title: `${task.title} - New Day`,
        dailyDuration,
        remainingDuration: dailyDuration,
        isCompleted: false,
      })
      task.remainingDuration -= dailyDuration
      await task.save()
    }
    return NextResponse.json({
      success: true,
      message: 'Daily tasks reset successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
