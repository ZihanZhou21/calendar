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
    // 假设这里的 dailyDuration 就是“每日剩余”或原始剩余时间
    dailyDuration,
    // 服务器传来的初始剩余时间
    remainingDuration: initialRemaining,
  } = task

  // 自定义 Hook 管理倒计时
  const { timeLeft, isActive, startTimer, pauseTimer, resumeTimer } =
    useLocalTimer(_id, initialRemaining)

  // 是否已完成
  const [isCompleted, setIsCompleted] = useState(false)

  // 当 timeLeft=0 且不在计时时 => 任务视为完成
  useEffect(() => {
    if (!isCompleted && timeLeft === 0 && !isActive) {
      setIsCompleted(true)
      onComplete?.(_id, 0)
    }
  }, [timeLeft, isActive, isCompleted, onComplete, _id])

  // 根据状态决定卡片背景
  let containerColor = 'bg-blue-100'
  if (isCompleted) {
    containerColor = 'bg-yellow-200'
  } else if (isActive) {
    containerColor = 'bg-green-100'
  }

  // 开始
  const handleStart = () => {
    if (!isCompleted && initialRemaining > 0) {
      startTimer(timeLeft || initialRemaining)
    }
  }

  // 暂停
  const handlePause = () => {
    pauseTimer()
    onPause?.(_id, timeLeft)
  }

  /**
   * 渲染按钮逻辑：
   *  - 未开始：显示 Start
   *  - 进行中：显示 Pause
   *  - 暂停中：如果 timeLeft > 0 且 timeLeft !== dailyDuration，则显示 Resume
   *  - 已完成：不显示按钮
   */
  const renderButtons = () => {
    // 已完成
    if (isCompleted) return null

    // 1) 未开始（尚未点击过 Start 或尚未扣减时间）
    if (!isActive && timeLeft === dailyDuration) {
      return (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={handleStart}>
          <FontAwesomeIcon icon={faPlay} /> Start
        </button>
      )
    }

    // 2) 正在倒计时
    if (isActive) {
      return (
        <button
          className="px-3 py-1 rounded bg-yellow-500 text-white"
          onClick={handlePause}>
          <FontAwesomeIcon icon={faPause} /> Pause
        </button>
      )
    }

    // 3) 暂停状态（timeLeft > 0），且已消耗部分时间（timeLeft !== dailyDuration）
    if (!isActive && timeLeft > 0 && timeLeft !== dailyDuration) {
      return (
        <button
          className="px-3 py-1 rounded bg-green-500 text-white"
          onClick={resumeTimer}>
          <FontAwesomeIcon icon={faPlay} /> Resume
        </button>
      )
    }

    return null
  }

  return (
    <div
      className={`
        relative p-6 rounded-xl
        shadow-xl transition-shadow duration-300 hover:shadow-2xl
        ${containerColor}
      `}>
      <h3
        className="
          text-lg font-bold mb-2
          bg-gradient-to-r from-purple-600 to-pink-500
          bg-clip-text text-transparent
        ">
        {title}
      </h3>

      <p className="text-sm">Daily Duration: {formatDuration(dailyDuration)}</p>
      <p className="text-sm">
        {isCompleted ? (
          <div className="text-green-800 font-bold text-xl ml-4 mt-4">
            Completed
          </div>
        ) : (
          <div>
            Remaining:{' '}
            <span className="text-red-600 font-bold text-xl">
              {formatDuration(timeLeft)}
            </span>
          </div>
        )}
      </p>

      <div className="flex gap-2 mt-2">{renderButtons()}</div>
    </div>
  )
}
