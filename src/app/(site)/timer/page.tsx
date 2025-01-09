'use client'

import React, { useState } from 'react'
import { useTimer } from '../Context/TimerContext' // 根据你的路径调整
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faStop,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'flowbite-react'
export default function TimerPage() {
  const { timeLeft, isActive, startTimer, stopTimer, pauseTimer, resumeTimer } =
    useTimer()

  // 用于“快捷按钮”或手动输入 -> 统一存到 localMinutes
  const [localMinutes, setLocalMinutes] = useState(0)
  const [tempMinutes, setTempMinutes] = useState(0)

  // 格式化秒数为 mm:ss
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // 判断是否为“暂停”状态
  const isPaused = !isActive && timeLeft > 0

  // 切换“Pause/Resume”
  const handlePauseResume = () => {
    if (isActive) {
      pauseTimer()
    } else if (isPaused) {
      resumeTimer()
    }
  }

  // 当不在倒计时且 localMinutes>0 时，显示选定的静态分钟；否则显示全局 timeLeft 或 "Time's Up"
  function renderTimerDisplay() {
    // 如果全局正在倒计时 或 timeLeft>0
    if (isActive || timeLeft > 0) {
      return formatTime(timeLeft)
    }

    // 如果没在倒计时、timeLeft=0、但 localMinutes>0 -> 只显示预设时间
    if (!isActive && timeLeft === 0 && localMinutes > 0) {
      return formatTime(localMinutes * 60)
    }

    return "Time's Up"
  }

  return (
    <div className="p-4 flex flex-col items-center gap-2">
      <h1 className="text-xl font-bold">Global Timer</h1>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          className="border px-2 py-1 w-24 text-center"
          value={tempMinutes} // 由 tempMinutes 控制
          onChange={(e) => setTempMinutes(Number(e.target.value))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            // 只有此时才把tempMinutes赋给localMinutes
            setLocalMinutes(tempMinutes)
          }}>
          Set
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setLocalMinutes(5)}>
          5分钟
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setLocalMinutes(10)}>
          10分钟
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setLocalMinutes(25)}>
          25分钟
        </button>
      </div>
      <Card className="bg-gradient-to-tr from-[#000000] to-[#434343] flex flex-col h-48 w-96 rounded-4xl items-center justify-center">
        <div className="text-7xl text-white  font-medium">
          {renderTimerDisplay()}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {/* 真正的开始计时：改用 localMinutes */}
          <button
            className="bg-blue-600 h-11 w-11 text-white px-4 py-2 rounded-full transition-all duration-200
    hover:bg-blue-500
    hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
    hover:scale-105
    active:scale-95"
            onClick={() => {
              // 如果计时器正在运行，则暂停
              if (isActive) {
                pauseTimer()
              }
              // 如果计时器已暂停（未active但有剩余时间），则恢复
              else if (!isActive && timeLeft > 0) {
                resumeTimer()
              }
              // 如果计时器未启动且没有倒计时，则开始新计时
              else {
                if (localMinutes <= 0) return
                startTimer(localMinutes)
              }
            }}>
            {isActive ? (
              <FontAwesomeIcon className="w-full h-full" icon={faPause} />
            ) : !isActive && timeLeft > 0 ? (
              <FontAwesomeIcon className="w-full h-full" icon={faPlay} />
            ) : (
              <FontAwesomeIcon className="w-full h-full" icon={faPlay} />
            )}
          </button>

          <button
            className="bg-gray-500 text-white h-11 w-11 px-4 py-2 rounded-full transition-all duration-200
    hover:bg-gray-500
    hover:shadow-[0_0_15px_rgba(107,114,128,0.5)]
    hover:scale-105
    active:scale-95"
            onClick={() => {
              stopTimer()
              // 如需停止后重置 localMinutes，也可以: setLocalMinutes(0);
            }}>
            <FontAwesomeIcon className="w-full h-full" icon={faStop} />
          </button>
        </div>
      </Card>
    </div>
  )
}
