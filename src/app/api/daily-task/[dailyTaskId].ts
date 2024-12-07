import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/utils/dbConnect'
import DailyTask from '@/models/DailyTask'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  const { dailyTaskId } = req.query

  if (req.method === 'PUT') {
    try {
      const dailyTask = await DailyTask.findByIdAndUpdate(
        dailyTaskId,
        req.body,
        { new: true }
      )
      if (!dailyTask) {
        return res
          .status(404)
          .json({ success: false, message: 'Daily task not found' })
      }
      res.status(200).json({ success: true, data: dailyTask })
    } catch (error) {
      res.status(400).json({ success: false, error })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }
}
