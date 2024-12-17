import mongoose, { Schema, Document, model } from 'mongoose'

export interface ITask extends Document {
  title: string
  totalDuration: number // 总时长（秒）
  totalDays: number // 总天数
  remainingDuration: number // 剩余时长（秒）
  remainingDays: number // 剩余天数
  startDate: Date // 开始日期
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  totalDuration: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  remainingDuration: { type: Number, required: true },
  remainingDays: { type: Number },
  startDate: { type: Date, required: true },
})

export default mongoose.models.Task || model<ITask>('Task', TaskSchema)
