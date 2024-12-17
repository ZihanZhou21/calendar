import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'
import dbConnect from '@/utils/dbConnect'

export async function PUT(
  req: NextRequest,
  { params }: { params: { dailyTaskId: string } }
) {
  await dbConnect()
  try {
    const { dailyTaskId } = params
    const body = await req.json()
    const dailyTask = await DailyTask.findByIdAndUpdate(dailyTaskId, body, {
      new: true,
      runValidators: true,
    })
    if (!dailyTask)
      return NextResponse.json(
        { success: false, message: 'Daily task not found' },
        { status: 404 }
      )
    const task = await Task.findById(dailyTask.taskId)
    if (task) {
      if (body.isCompleted) {
        task.remainingDuration -= dailyTask.dailyDuration
        if (task.remainingDuration > 0) {
          const nextDailyDuration = Math.min(
            task.remainingDuration,
            Math.floor(task.totalDuration / task.totalDays)
          )
          await DailyTask.create({
            taskId: task._id,
            title: `${task.title} - New Day`,
            dailyDuration: nextDailyDuration,
            remainingDuration: nextDailyDuration,
            isCompleted: false,
          })
        }
      } else {
        task.remainingDuration -=
          dailyTask.dailyDuration - body.remainingDuration
      }
      await task.save()
    }
    return NextResponse.json(
      { success: true, data: dailyTask },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { dailyTaskId: string } }
) {
  await dbConnect()
  try {
    const { dailyTaskId } = params
    const deletedDailyTask = await DailyTask.findByIdAndDelete(dailyTaskId)
    if (!deletedDailyTask)
      return NextResponse.json(
        { success: false, message: 'Daily task not found' },
        { status: 404 }
      )
    return NextResponse.json({
      success: true,
      message: 'Daily task deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
