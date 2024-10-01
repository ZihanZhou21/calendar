// // utils/dbConnect.ts
import mongoose from 'mongoose'

const MONGODB_URI: string = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache
}

const cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    console.log('使用现有的 MongoDB 连接')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('创建新的 MongoDB 连接')
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB 连接成功')
        return mongoose
      })
      .catch((error) => {
        console.error('MongoDB 连接失败:', error)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
