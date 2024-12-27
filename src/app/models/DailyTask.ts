import mongoose, { Schema, Document, model } from 'mongoose'
import { start } from 'repl'

export interface IDailyTask extends Document {
  taskId: mongoose.Types.ObjectId // 关联的任务 ID
  title: string // 每日任务标题
  dailyDuration: number // 每日分配的时长（秒）
  remainingDuration: number // 剩余时长（秒）
  isCompleted: boolean // 是否完成
  currentDate: Date // 当前日期
  startDate: Date // 开始日期
  // remainingDays: number // 剩余天数
}

// import mongoose from 'mongoose'

const DailyTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  title: { type: String, required: true },
  dailyDuration: { type: Number, required: true },
  remainingDuration: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  currentDate: { type: Date, required: true },
  startDate: { type: Date, default: Date.now },
})

export default mongoose.models.DailyTask ||
  mongoose.model('DailyTask', DailyTaskSchema)
// export default mongoose.models.DailyTask ||
//   model<IDailyTask>('DailyTask', DailyTaskSchema)
