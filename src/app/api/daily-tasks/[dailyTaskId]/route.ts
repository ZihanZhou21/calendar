import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import Task from '@/models/Task'
import dbConnect from '@/utils/dbConnect'

interface CompleteDailyTaskBody {
  isCompleted: boolean
  remainingDuration: number
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ dailyTaskId: string }> }
) {
  await dbConnect()

  try {
    const { params } = context
    const dailyTaskId = (await params).dailyTaskId
    const body: CompleteDailyTaskBody = await req.json()
    const { isCompleted, remainingDuration } = body

    // 更新每日任务
    const updatedDailyTask = await DailyTask.findByIdAndUpdate(
      dailyTaskId,
      { isCompleted, remainingDuration },
      { new: true }
    )

    if (!updatedDailyTask) {
      return NextResponse.json(
        { success: false, error: '每日任务未找到' },
        { status: 404 }
      )
    }

    // 同步更新关联的主任务
    const task = await Task.findById(updatedDailyTask.taskId)
    if (task) {
      task.remainingDuration -=
        updatedDailyTask.dailyDuration - remainingDuration
      await task.save()
    }

    return NextResponse.json(
      { success: true, data: updatedDailyTask },
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

    if (!deletedDailyTask) {
      return NextResponse.json(
        { success: false, message: 'Daily task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Daily task deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
