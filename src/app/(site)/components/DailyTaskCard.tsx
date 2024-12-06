import { useState, useEffect } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'

interface DailyTaskCardProps {
  task: DailyTask
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({ task }) => {
  const {
    title,
    dailyDuration,
    remainingDuration: initialRemaining,
    isCompleted,
  } = task
  const [remainingDuration, setRemainingDuration] =
    useState<number>(initialRemaining)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && remainingDuration > 0) {
      timer = setInterval(() => {
        setRemainingDuration((prev) => prev - 1)
      }, 1000)
    }
    if (remainingDuration === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(timer)
  }, [isRunning, remainingDuration])

  const handleStartPause = () => {
    if (remainingDuration > 0) {
      setIsRunning((prev) => !prev)
    }
  }

  // 设置背景颜色
  const backgroundColor = isCompleted
    ? 'bg-yellow-500'
    : isRunning
    ? 'bg-green-500'
    : 'bg-blue-500'

  return (
    <div
      className={`border p-4 rounded-lg shadow-sm text-white ${backgroundColor}`}>
      <h2 className="text-lg font-semibold truncate">{title}</h2>
      <p className="text-sm">每日分配时长: {formatDuration(dailyDuration)}</p>
      <p className="text-sm">剩余时长: {formatDuration(remainingDuration)}</p>
      <button
        onClick={handleStartPause}
        className={`mt-2 text-xs px-4 py-1 rounded ${
          isRunning ? 'bg-red-500' : 'bg-white text-blue-500'
        }`}
        disabled={remainingDuration === 0}>
        {remainingDuration === 0 ? '完成' : isRunning ? '暂停' : '开始'}
      </button>
    </div>
  )
}

export default DailyTaskCard
