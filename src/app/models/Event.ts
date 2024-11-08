// import mongoose from 'mongoose'

// const EventTyoeSchema = new mongoose.Schema({
//   email: String,
//   title: String,
//   description: String,
//   bookingTimes: new mongoose.Schema({
//     monday: new mongoose.Schema({
//       from: String,
//       to: String,
//     }),
//   }),
// })
// models/Event.js
// models/Event.ts
import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IEvent extends Document {
  _id: string
  title: string
  description?: string
  start: string // ISO 格式字符串
  end: string // ISO 格式字符串
  createdAt: string
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, '请填写日程标题'],
  },
  description: {
    type: String,
    default: '',
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)

export default Event
