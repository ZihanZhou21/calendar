// src/__tests__/dailyTask.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'

describe('DailyTask Update API', () => {
  let mongoServer: MongoMemoryServer
  let POST: Function
  let Task: any
  let DailyTask: any
  let dbConnect: Function

  let realDate: typeof Date

  beforeEach(async () => {
    // 1. 启动内存数据库
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    // 2. 设置环境变量为内存数据库URI
    process.env.MONGODB_URI = mongoUri

    // 3. 动态导入模块，确保环境变量已设置
    const dbModule = await import('../app/utils/dbConnect')
    dbConnect = dbModule.default

    await dbConnect()

    const taskModule = await import('@/models/Task')
    Task = taskModule.default

    const dailyTaskModule = await import('@/models/DailyTask')
    DailyTask = dailyTaskModule.default

    const apiModule = await import('../app/api/tasks/reset-daily-tasks/route')
    POST = apiModule.POST

    // 4. Mock Date to next day
    realDate = Date
    const nextDay = new Date('2024-01-02T00:00:00.000Z')
    global.Date = class extends Date {
      constructor(date?: any) {
        if (date) {
          super(date)
          return this
        }
        super(nextDay)
        return this
      }
      static now() {
        return nextDay.getTime()
      }
      static parse(dateString: string) {
        return realDate.parse(dateString)
      }
      static UTC(
        year: number,
        month: number,
        day: number,
        hour?: number,
        minute?: number,
        second?: number,
        ms?: number
      ) {
        return realDate.UTC(year, month, day, hour, minute, second, ms)
      }
    } as any
  })

  afterEach(async () => {
    // 1. 断开 mongoose 连接
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    // 2. 停止内存数据库
    if (mongoServer) {
      await mongoServer.stop()
    }

    // 3. 恢复原始 Date 对象
    global.Date = realDate

    // 4. 清除环境变量
    delete process.env.MONGODB_URI
  })

  it('should update dailyTask when date changes to next day', async () => {
    // 1. 设置初始数据 - 创建一个任务和每日任务
    const today = new Date('2024-01-01T00:00:00.000Z')
    const endDate = new Date('2024-01-03T00:00:00.000Z')

    const task = await Task.create({
      title: 'Test Task',
      totalDuration: 600,
      remainingDuration: 600,
      startDate: today,
      endDate: endDate,
      remainingDays: 3,
      totalDays: 3,
    })

    const dailyTask = await DailyTask.create({
      title: 'Test Task',
      taskId: task._id,
      currentDate: today,
      dailyDuration: 200,
      remainingDuration: 150,
      isCompleted: false,
    })

    // 2. 调用 API
    const mockRequest = new NextRequest(
      'http://localhost/api/tasks/reset-daily-tasks',
      {
        method: 'POST',
      }
    )
    const response = await POST(mockRequest)
    const result = await response.json()

    // 3. 验证结果
    expect(result.success).toBe(true)

    // 检查更新后的 DailyTask
    const updatedDailyTask = await DailyTask.findById(dailyTask._id)
    expect(updatedDailyTask).toBeTruthy()
    expect(updatedDailyTask?.currentDate?.toISOString()).toBe(
      '2024-01-02T00:00:00.000Z'
    )

    // 验证主任务剩余时间已扣除昨日使用时间
    const updatedTask = await Task.findById(task._id)
    expect(updatedTask?.remainingDuration).toBe(550) // 600 - 50 (used yesterday)

    // 验证新的每日时长分配
    expect(updatedDailyTask?.dailyDuration).toBe(275)
    expect(updatedDailyTask?.remainingDuration).toBe(275)
    expect(updatedDailyTask?.isCompleted).toBe(false)
  })
})
