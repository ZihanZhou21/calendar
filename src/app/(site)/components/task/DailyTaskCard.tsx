import { useState, useEffect } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import Task from '@/models/Task'

interface DailyTaskCardProps {
  task: DailyTask
  onComplete: (taskId: string) => Promise<void> // 更新任务完成状态
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({ task, onComplete }) => {
  const { title, dailyDuration, remainingDuration: initialRemaining } = task

  const [remainingDuration, setRemainingDuration] =
    useState<number>(initialRemaining)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && remainingDuration > 0) {
      timer = setInterval(() => {
        setRemainingDuration((prev) => prev - 1)
      }, 1000)
    }
    if (remainingDuration === 0 && !isCompleted) {
      setIsCompleted(true) // 标记任务完成
      setIsRunning(false) // 停止倒计时
      onComplete(task._id) // 通知后端任务完成
    }
    return () => clearInterval(timer)
  }, [isRunning, remainingDuration, onComplete, isCompleted, task])

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
            剩余时长: {formatDuration(remainingDuration)}
          </p>
        </div>
        <button
          onClick={handleStartPause}
          className={`mt-2 text-xs px-4 py-1 rounded ${
            isRunning ? 'bg-red-500' : 'bg-white text-blue-500'
          }`}
          disabled={remainingDuration === 0}>
          {remainingDuration === 0 ? '完成' : isRunning ? '暂停' : '开始'}
        </button>
      </div>
    </div>
  )
}

export default DailyTaskCard
