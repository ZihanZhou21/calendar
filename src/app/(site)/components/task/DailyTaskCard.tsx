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

  // 自定义 Hook：以初始秒数（initialRemaining）启动/恢复本地倒计时
  const { timeLeft, isActive, startTimer, pauseTimer, resumeTimer } =
    useLocalTimer(_id, initialRemaining)

  // 是否已完成标识
  const [isCompleted, setIsCompleted] = useState(false)

  // 监控 timeLeft 与 isActive，当 timeLeft=0 且不在计时时，视为“已完成”
  useEffect(() => {
    if (!isCompleted && timeLeft === 0 && !isActive) {
      setIsCompleted(true)
      onComplete?.(_id, 0)
    }
  }, [timeLeft, isActive, isCompleted, onComplete, _id])

  // 根据任务状态动态切换背景色
  // - 默认/暂停 → 蓝色 (bg-blue-100)
  // - 进行中 → 淡绿色 (bg-green-100)
  // - 已完成 → 金黄色 (bg-yellow-200)
  let containerColor = 'bg-blue-100'
  if (isCompleted) {
    containerColor = 'bg-yellow-200'
  } else if (isActive) {
    containerColor = 'bg-green-100'
  }

  // 点击开始
  const handleStart = () => {
    if (!isCompleted && initialRemaining > 0) {
      // 如果当前 timeLeft>0，可以传 timeLeft；否则传 initialRemaining
      startTimer(timeLeft || initialRemaining)
    }
  }

  // 点击暂停
  const handlePause = () => {
    pauseTimer()
    onPause?.(_id, timeLeft)
  }

  // 根据按钮不同场景渲染
  const renderButtons = () => {
    if (isCompleted) return null // 已完成不显示任何按钮

    // 未开始或走到 0 → Start
    if (!isActive && timeLeft === initialRemaining) {
      return (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={handleStart}>
          <FontAwesomeIcon icon={faPlay} /> Start
        </button>
      )
    }

    // 正在进行中 → Pause
    if (isActive) {
      return (
        <button
          className="px-3 py-1 rounded bg-yellow-500 text-white"
          onClick={handlePause}>
          <FontAwesomeIcon icon={faPause} /> Pause
        </button>
      )
    }

    // 暂停且剩余时间>0 → Resume
    if (!isActive && timeLeft > 0) {
      return (
        <button
          className="px-3 py-1 rounded bg-green-500 text-white"
          onClick={() => resumeTimer()}>
          <FontAwesomeIcon icon={faPlay} /> Resume
        </button>
      )
    }

    return null // 其他情况不显示
  }

  return (
    <div className={`border p-4 rounded-3xl shadow-sm ${containerColor}`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>

      <p className="text-sm">Daily Duration: {formatDuration(dailyDuration)}</p>
      <p className="text-sm">
        Remaining:{' '}
        {isCompleted ? (
          <span className="text-green-800 font-bold">Completed</span>
        ) : (
          <span className="text-red-600 font-bold text-xl">
            {formatDuration(timeLeft)}
          </span>
        )}
      </p>

      <div className="flex gap-2 mt-2">{renderButtons()}</div>
    </div>
  )
}
