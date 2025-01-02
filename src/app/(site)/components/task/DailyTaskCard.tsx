import { useState, useEffect } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useTimer } from '../../Context/TimerContext' // 根据你的实际路径来

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
    let timer: NodeJS.Timer

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

  // 根据不同状态改变背景色
  // 已完成：浅灰背景
  // 进行中：浅绿背景
  // 暂停或未开始：浅蓝背景
  const backgroundColor = isCompleted
    ? 'bg-[#FFEEA9]'
    : isRunning
    ? 'bg-green-100'
    : 'bg-blue-100'

  return (
    <div
      className={`border p-6 rounded-lg shadow-md transition-colors duration-300 ${backgroundColor}`}>
      <h2 className="text-xl font-bold mb-4 truncate text-[#FF7D29]">
        {title}
      </h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          Daily Duration:{' '}
          <span className="font-semibold text-gray-900">
            {formatDuration(dailyDuration)}
          </span>
        </p>
        <p className="text-sm text-yellow-700">
          Duration:{' '}
          {isCompleted ? (
            <span className="ml-1 font-bold text-green-600 text-lg">
              Completed
            </span>
          ) : (
            <span className="ml-1 text-3xl font-extrabold text-red-600">
              {formatDuration(remainingDuration)}
            </span>
          )}
        </p>
      </div>
      <div className="flex space-x-4 mt-6">
        {!isCompleted && !isRunning && (
          <button
            onClick={handleStart}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
            disabled={isCompleted}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
        )}

        {!isCompleted && isRunning && (
          <button
            onClick={handlePause}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded"
            disabled={isCompleted}>
            <FontAwesomeIcon icon={faPause} />
          </button>
        )}
      </div>
    </div>
  )
}

export default DailyTaskCard
