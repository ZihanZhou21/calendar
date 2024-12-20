import { useState, useEffect } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'

interface DailyTaskCardProps {
  task: DailyTask
  onComplete: (taskId: string, remainingDuration: number) => Promise<void>
  onPause?: (taskId: string, remainingDuration: number) => Promise<void>
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({
  task,
  onComplete,
  onPause,
}) => {
  const { title, dailyDuration, remainingDuration: initialRemaining } = task

  const [remainingDuration, setRemainingDuration] =
    useState<number>(initialRemaining)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleComplete = async () => {
      try {
        await onComplete(task._id, remainingDuration)
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
      handleComplete()
    }

    return () => clearInterval(timer)
  }, [isRunning, remainingDuration, isCompleted, onComplete, task._id])

  const handleStart = () => {
    if (!isCompleted && remainingDuration > 0) {
      setIsRunning(true)
    }
  }

  const handlePause = async () => {
    setIsRunning(false)
    if (onPause) {
      try {
        await onPause(task._id, remainingDuration)
      } catch (error) {
        console.error('暂停每日任务失败:', error)
      }
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">
            每日分配时长: {formatDuration(dailyDuration)}
          </p>
          <p className="text-sm">
            剩余时长:{' '}
            {isCompleted ? '已完成' : formatDuration(remainingDuration)}
          </p>
        </div>
        <div className="flex space-x-2">
          {/* 如果任务未完成且未开始或已暂停，则显示「开始」按钮 */}
          {!isCompleted && !isRunning && (
            <button
              onClick={handleStart}
              className="mt-2 text-xs px-4 py-1 rounded bg-white text-blue-500"
              disabled={isCompleted}>
              开始
            </button>
          )}

          {/* 如果任务在进行中且未完成，则显示「暂停」按钮 */}
          {!isCompleted && isRunning && (
            <button
              onClick={handlePause}
              className="mt-2 text-xs px-4 py-1 rounded bg-yellow-500 text-white"
              disabled={isCompleted}>
              暂停
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DailyTaskCard
