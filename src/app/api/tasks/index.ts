import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/utils/dbConnect'
import Task from '@/models/Task'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  switch (req.method) {
    case 'GET': // 获取所有任务
      try {
        const tasks = await Task.find({})
        res.status(200).json({ success: true, data: tasks })
      } catch (error) {
        res.status(400).json({ success: false, error })
      }
      break

    case 'POST': // 创建任务
      try {
        const task = await Task.create(req.body)
        res.status(201).json({ success: true, data: task })
      } catch (error) {
        res.status(400).json({ success: false, error })
      }
      break

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' })
      break
  }
}
