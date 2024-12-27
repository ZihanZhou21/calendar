import { NextRequest, NextResponse } from 'next/server'
import Task from '@/models/Task'
import DailyTask from '@/models/DailyTask'
import dbConnect from '@/utils/dbConnect'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const { title, totalDuration, totalDays } = await req.json()

    // Step 1: 获取当前日期作为任务开始日期
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + totalDays)
    // Step 2: 创建任务
    const newTask = await Task.create({
      title,
      totalDuration,
      totalDays,
      remainingDuration: totalDuration, // 初始化剩余总时长
      startDate, // 设置开始日期
      endDate,
      remainingDays: totalDays, // 剩余天数初始化为总天数
    })

    // Step 3: 计算每日任务的配额
    const dailyDuration = Math.floor(totalDuration / totalDays)

    // Step 4: 创建第一个每日任务
    const firstDailyTask = await DailyTask.create({
      taskId: newTask._id, // 与任务关联
      title: `${title} - Day 1`,
      dailyDuration,
      startDate,
      remainingDuration: dailyDuration,
      isCompleted: false,
      currentDate: startDate, // 设置当前日期为开始日期
    })

    // Step 5: 返回任务和每日任务数据
    return NextResponse.json(
      {
        success: true,
        data: {
          task: newTask,
          dailyTask: firstDailyTask,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    // 获取所有任务
    const tasks = await Task.find({})
    return NextResponse.json({ success: true, data: tasks }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
