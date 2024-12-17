import { NextRequest, NextResponse } from 'next/server'
import Task from '@/models/Task'
import DailyTask from '@/models/DailyTask'
import dbConnect from '@/utils/dbConnect'

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  await dbConnect()

  try {
    const { params } = await context
    const taskId = await params.taskId // 解构 taskId
    const body = await req.json()

    const updatedTask = await Task.findByIdAndUpdate(taskId, body, {
      new: true,
      runValidators: true,
    })
    if (!updatedTask)
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      )

    return NextResponse.json(
      { success: true, data: updatedTask },
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
  context: { params: Promise<{ taskId: string }> }
) {
  await dbConnect()
  try {
    const { params } = context
    const taskId = params.taskId // 解构 taskId

    const deletedTask = await Task.findByIdAndDelete(taskId)
    if (!deletedTask)
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      )

    // 删除关联的 DailyTask
    await DailyTask.deleteMany({ taskId })

    return NextResponse.json({
      success: true,
      message: 'Task and associated daily tasks deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
