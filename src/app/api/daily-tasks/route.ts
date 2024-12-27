import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import dbConnect from '@/utils/dbConnect'
// import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/Task'
// import DailyTask from '@/models/DailyTask';
// import dbConnect from '@/utils/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const { taskId } = await req.json()

    // Step 1: 获取关联的任务
    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    // Step 2: 检查任务是否还有剩余时长
    if (task.remainingDuration <= 0) {
      return NextResponse.json(
        { success: false, error: '任务已完成，无需生成每日任务' },
        { status: 400 }
      )
    }

    // Step 3: 计算每日任务的配额
    const dailyDuration = Math.min(
      task.remainingDuration,
      Math.floor(task.totalDuration / task.totalDays)
    )

    // Step 4: 创建新的每日任务
    const newDailyTask = await DailyTask.create({
      taskId: task._id,
      title: `${task.title} - 新每日任务`,
      dailyDuration,
      remainingDuration: dailyDuration,
      isCompleted: false,
      startDate: task.startDate,
    })

    // Step 5: 返回生成的每日任务
    return NextResponse.json(
      {
        success: true,
        data: newDailyTask,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('每日任务生成失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const url = new URL(req.url)
    const queryParams = Object.fromEntries(url.searchParams)
    const filter: any = {}
    if (queryParams.isCompleted)
      filter.isCompleted = queryParams.isCompleted === 'true'
    if (queryParams.taskId) filter.taskId = queryParams.taskId
    const dailyTasks = await DailyTask.find(filter)
    return NextResponse.json(
      { success: true, data: dailyTasks },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
