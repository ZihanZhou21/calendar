import mongoose from 'mongoose'

const EventTyoeSchema = new mongoose.Schema({
  email: String,
  title: String,
  description: String,
  bookingTimes: new mongoose.Schema({
    monday: new mongoose.Schema({
      from: String,
      to: String,
    }),
  }),
})
