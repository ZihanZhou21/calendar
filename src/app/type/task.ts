// 定义任务数据结构
export interface Task {
  id: number // 任务唯一标识符
  title: string // 任务标题
  totalDuration: number // 任务总时长（以秒为单位）
  totalDays: number // 任务总天数
  remainingDuration: number // 剩余总时长（以秒为单位）
  remainingDays: number // 剩余天数
  startDate: string // 任务开始日期（ISO 格式字符串）
}

// 定义每日任务数据结构
export interface DailyTask {
  id: number // 每日任务唯一标识符
  taskId: number // 关联任务的 ID
  title: string // 每日任务的标题
  dailyDuration: number // 每日分配时长（以秒为单位）
  remainingDuration: number // 每日剩余时长（以秒为单位）
  isCompleted: boolean // 是否完成
  remainingDays: number // 剩余天数
}
