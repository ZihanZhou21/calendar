import { NextRequest, NextResponse } from 'next/server'
import DailyTask from '@/models/DailyTask'
import dbConnect from '@/utils/dbConnect'

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    // 查询所有每日任务
    const dailyTasks = await DailyTask.find({})

    // 假设每日任务在新的一天需要将remainingDuration重置为dailyDuration，并且将isCompleted重置为false
    for (const dailyTask of dailyTasks) {
      // 更新逻辑：新的一天开始，将剩余时长回置
      dailyTask.remainingDuration = dailyTask.dailyDuration
      dailyTask.isCompleted = false
      await dailyTask.save()
    }

    return NextResponse.json({ success: true, message: '每日任务已重置' })
  } catch (error: any) {
    console.error('Error resetting daily tasks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
