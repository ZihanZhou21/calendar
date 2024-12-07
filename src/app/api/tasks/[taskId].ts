import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/utils/dbConnect'
import Task from '@/models/Task'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  const { taskId } = req.query

  switch (req.method) {
    case 'PUT': // 更新任务
      try {
        const task = await Task.findByIdAndUpdate(taskId, req.body, {
          new: true,
        })
        if (!task) {
          return res
            .status(404)
            .json({ success: false, message: 'Task not found' })
        }
        res.status(200).json({ success: true, data: task })
      } catch (error) {
        res.status(400).json({ success: false, error })
      }
      break

    case 'DELETE': // 删除任务
      try {
        const task = await Task.findByIdAndDelete(taskId)
        if (!task) {
          return res
            .status(404)
            .json({ success: false, message: 'Task not found' })
        }
        res
          .status(200)
          .json({ success: true, message: 'Task deleted successfully' })
      } catch (error) {
        res.status(400).json({ success: false, error })
      }
      break

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' })
      break
  }
}
