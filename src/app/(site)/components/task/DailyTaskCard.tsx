// DailyTaskCard.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { DailyTask } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { useLocalTimer } from '../localTimer/localtimer'

interface DailyTaskCardProps {
  task: DailyTask
  onComplete?: (taskId: string, remaining: number) => void
  onPause?: (taskId: string, remaining: number) => void
}

export default function DailyTaskCard({
  task,
  onComplete,
  onPause,
}: DailyTaskCardProps) {
  const {
    _id,
    title,
    dailyDuration,
    remainingDuration: initialRemaining,
  } = task

  // 使用自定义 Hook，传入初始秒数
  const { timeLeft, isActive, startTimer, pauseTimer, resumeTimer } =
    useLocalTimer(_id, initialRemaining)

  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // timeLeft=0 && !isActive => 任务完成
    if (!isCompleted && timeLeft === 0 && !isActive) {
      setIsCompleted(true)
      onComplete?.(_id, 0)
    }
  }, [timeLeft, isActive, isCompleted, onComplete, _id])

  const handleStart = () => {
    if (!isCompleted && initialRemaining > 0) {
      // 若 timeLeft>0 且想再次开始，可根据需求调 startTimer(...)
      startTimer(timeLeft || initialRemaining)
    }
  }

  const handlePause = () => {
    pauseTimer()
    onPause?.(_id, timeLeft)
  }

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">{title}</h3>

      <p className="text-sm">Daily Duration: {formatDuration(dailyDuration)}</p>
      <p className="text-sm">
        Remaining:{' '}
        {isCompleted ? (
          <span className="text-green-600 font-bold">Completed</span>
        ) : (
          <span className="text-red-600 font-bold text-xl">
            {formatDuration(timeLeft)}
          </span>
        )}
      </p>

      {!isCompleted && (
        <div className="flex gap-2 mt-2">
          {/* Start 按钮：timeLeft=0 时可以开始 */}
          {!isActive && timeLeft === 0 && (
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white"
              onClick={handleStart}>
              <FontAwesomeIcon icon={faPlay} /> Start
            </button>
          )}

          {/* Pause 按钮：计时中才能暂停 */}
          {isActive && (
            <button
              className="px-3 py-1 rounded bg-yellow-500 text-white"
              onClick={handlePause}>
              <FontAwesomeIcon icon={faPause} /> Pause
            </button>
          )}

          {/* Resume 按钮：暂停且 timeLeft>0 时才能恢复 */}
          {!isActive && timeLeft > 0 && (
            <button
              className="px-3 py-1 rounded bg-green-500 text-white"
              onClick={() => resumeTimer()}>
              <FontAwesomeIcon icon={faPlay} /> Resume
            </button>
          )}

          {/* Stop 按钮已被删除 */}
        </div>
      )}
    </div>
  )
}
