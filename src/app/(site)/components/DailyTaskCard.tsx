import { useState, useEffect } from 'react'
import { formatDuration } from '../../utils/formatDuration'

export default function DailyTaskCard({ task }) {
  const {
    title,
    dailyDuration,
    remainingDuration: initialRemaining,
    isCompleted,
    date,
  } = task

  const [remainingDuration, setRemainingDuration] = useState(initialRemaining)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer
    if (isRunning && remainingDuration > 0) {
      timer = setInterval(() => {
        setRemainingDuration((prev) => prev - 1)
      }, 1000)
    }
    if (remainingDuration === 0) {
      setIsRunning(false) // 自动停止计时
    }
    return () => clearInterval(timer)
  }, [isRunning, remainingDuration])

  const handleStartPause = () => {
    if (remainingDuration > 0) {
      setIsRunning((prev) => !prev)
    }
  }

  const isCompletedDisplay = remainingDuration === 0 || isCompleted

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-sm font-semibold truncate">{title}</h2>
      <p className="text-xs">分配时长: {formatDuration(dailyDuration)}</p>
      <p className="text-xs">
        剩余时长: {formatDuration(remainingDuration)}{' '}
        {isCompletedDisplay && (
          <span className="text-green-500">（已完成）</span>
        )}
      </p>
      <p className="text-xs">日期: {date}</p>
      <button
        onClick={handleStartPause}
        className={`mt-2 text-xs px-4 py-1 rounded ${
          isRunning ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}
        disabled={isCompletedDisplay}>
        {isCompletedDisplay ? '完成' : isRunning ? '暂停' : '开始'}
      </button>
    </div>
  )
}
