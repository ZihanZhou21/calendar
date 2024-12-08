import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import Task from '@/models/Task'

// GET: Retrieve all tasks
export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const tasks = await Task.find({})
    return NextResponse.json({ success: true, data: tasks }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// POST: Create a new task
export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const body = await req.json()

    // Validation of request body
    const { title, totalDuration, totalDays } = body
    if (!title || typeof title !== 'string') {
      throw new Error('Invalid or missing "title"')
    }
    if (!totalDuration || typeof totalDuration !== 'number') {
      throw new Error('Invalid or missing "totalDuration"')
    }
    if (!totalDays || typeof totalDays !== 'number') {
      throw new Error('Invalid or missing "totalDays"')
    }

    // Create task
    const task = await Task.create({
      title,
      totalDuration,
      totalDays,
      remainingDuration: totalDuration,
      remainingDays: totalDays,
      startDate: new Date(),
    })

    return NextResponse.json({ success: true, data: task }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
