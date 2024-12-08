import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import Task from '@/models/Task'

// GET Task by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params // Access `taskId` immediately
  await dbConnect()
  try {
    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: task }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// PUT: Update Task
export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params // Access `taskId` immediately
  await dbConnect()
  try {
    const body = await req.json()
    const task = await Task.findByIdAndUpdate(taskId, body, {
      new: true,
      runValidators: true,
    })
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: task }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE: Remove Task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params // Access `taskId` immediately
  await dbConnect()
  try {
    const deletedTask = await Task.deleteOne({ _id: taskId })
    if (!deletedTask.deletedCount) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: true, message: 'Task deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
