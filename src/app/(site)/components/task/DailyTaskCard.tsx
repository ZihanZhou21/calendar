import { useState, useEffect } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import Task from '@/models/Task'

interface DailyTaskCardProps {
  task: DailyTask
  onComplete: (taskId: string, remainingDuration: number) => Promise<void> // 接收两个参数
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({ task, onComplete }) => {
  const { title, dailyDuration, remainingDuration: initialRemaining } = task

  const [remainingDuration, setRemainingDuration] =
    useState<number>(initialRemaining)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    const handleComplete = async () => {
      try {
        await onComplete(task._id, remainingDuration) // 通知后端任务已完成，并传递剩余时间
      } catch (error) {
        console.error('标记任务完成失败:', error)
      }
    }
    if (isRunning && remainingDuration > 0) {
      timer = setInterval(() => {
        setRemainingDuration((prev) => prev - 1)
      }, 1000)
    }

    if (remainingDuration === 0 && !isCompleted) {
      setIsRunning(false)
      setIsCompleted(true)
      handleComplete() // 调用完成处理函数
    }

    return () => clearInterval(timer)
  }, [isRunning, remainingDuration, isCompleted, onComplete, task._id])

  const handleStartPause = () => {
    if (remainingDuration > 0) {
      setIsRunning((prev) => !prev)
    }
  }

  const backgroundColor = isCompleted
    ? 'bg-yellow-300'
    : isRunning
    ? 'bg-green-500'
    : 'bg-blue-500'

  return (
    <div
      className={`border p-4 rounded-lg shadow-sm text-white ${backgroundColor}`}>
      <h2 className="text-lg font-semibold truncate">{title}</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-sm">
            每日分配时长: {formatDuration(dailyDuration)}
          </p>
          <p className="text-sm">
            剩余时长:{' '}
            {isCompleted ? '已完成' : formatDuration(remainingDuration)}
          </p>
        </div>
        <button
          onClick={handleStartPause}
          className={`mt-2 text-xs px-4 py-1 rounded ${
            isRunning ? 'bg-red-500' : 'bg-white text-blue-500'
          }`}
          disabled={isCompleted}>
          {isCompleted ? '完成' : isRunning ? '暂停' : '开始'}
        </button>
      </div>
    </div>
  )
}

export default DailyTaskCard
