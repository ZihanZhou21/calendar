export interface Task {
  id: number
  title: string
  totalDuration: number // 总时长（秒）
  totalDays: number // 总天数
  remainingDuration: number // 剩余时长
  remainingDays: number // 剩余天数
  startDate: string // 开始日期（ISO 格式字符串）
}

export interface DailyTask {
  id: number
  taskId: number // 关联的任务 ID
  title: string
  dailyDuration: number // 每日分配时长（秒）
  remainingDuration: number // 每日剩余时长（秒）
  isCompleted: boolean
  date: string // 日期（ISO 格式字符串）
}
