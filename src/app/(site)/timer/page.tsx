'use client'

import React, { useState } from 'react'
import { useTimer } from '../Context/TimerContext' // 根据你的路径调整
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons'

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

  // 当不在倒计时且 localMinutes>0 时，显示选定的静态分钟；否则显示全局 timeLeft 或 "Time's Up"
  function renderTimerDisplay() {
    if (isActive || timeLeft > 0) {
      return formatTime(timeLeft)
    }
    if (!isActive && timeLeft === 0 && localMinutes > 0) {
      return formatTime(localMinutes * 60)
    }
    return "Time's Up"
  }

  return (
    <div className="p-4 flex flex-col flex-1 items-center gap-4 bg-gray-900 min-h-screen">
      {/* 标题 */}
      <h1 className="text-2xl text-white font-bold">Timer</h1>

      {/* 输入与 Set 按钮区域 */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          className="
            bg-gray-800 
            text-white 
            border border-gray-600 
            px-2 py-1 
            w-24 
            text-center 
            rounded-lg
            outline-none
            focus:border-blue-500
            transition-colors
            duration-200
          "
          value={tempMinutes}
          onChange={(e) => setTempMinutes(Number(e.target.value))}
        />
        <button
          className="
            bg-gray-700
            text-white
            px-4 py-2 
            rounded-lg
            hover:bg-gray-600
            transition-colors
            duration-200
          "
          onClick={() => {
            setLocalMinutes(tempMinutes)
          }}>
          Set
        </button>
      </div>

      {/* 快捷按钮：5/10/25 */}
      <div className="flex gap-2 pb-8">
        <button
          className="
            bg-gray-700
            text-white
            px-4 py-2 
            rounded-lg
            hover:bg-gray-600
            transition-colors
            duration-200
          "
          onClick={() => setLocalMinutes(5)}>
          5 mins
        </button>
        <button
          className="
            bg-gray-700
            text-white
            px-4 py-2 
            rounded-lg
            hover:bg-gray-600
            transition-colors
            duration-200
          "
          onClick={() => setLocalMinutes(10)}>
          10 mins
        </button>
        <button
          className="
            bg-gray-700
            text-white
            px-4 py-2 
            rounded-lg
            hover:bg-gray-600
            transition-colors
            duration-200
          "
          onClick={() => setLocalMinutes(25)}>
          25 mins
        </button>
      </div>

      {/* 显示计时器 + 操作按钮 */}
      <div
        // 如果 isActive=true，则额外加上发光类
        className={`
          bg-gradient-to-tr
          from-gray-800 to-gray-700
          flex 
          flex-col 
          h-48 
          w-96 
          rounded-2xl 
          items-center 
          justify-center
          shadow-xl 
          transition-all 
          duration-300
          ${isActive ? 'shadow-[0_0_15px_rgba(107,114,128,0.5)] scale-105' : ''}
        `}>
        <div className="text-7xl text-white font-medium">
          {renderTimerDisplay()}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {/* Start/Pause/Resume 按钮 */}
          <button
            className="
              bg-gray-700 
              text-white 
              h-11 w-11 
              flex items-center justify-center
              rounded-full 
              transition-all 
              duration-200
              hover:bg-gray-600
              hover:shadow-[0_0_15px_rgba(107,114,128,0.5)]
              hover:scale-105
              active:scale-95
            "
            onClick={() => {
              if (isActive) {
                pauseTimer()
              } else if (isPaused) {
                resumeTimer()
              } else {
                // 如果计时器未启动
                if (localMinutes <= 0) return
                startTimer(localMinutes)
              }
            }}>
            {isActive ? (
              <FontAwesomeIcon className="w-4 h-4" icon={faPause} />
            ) : isPaused ? (
              <FontAwesomeIcon className="w-4 h-4" icon={faPlay} />
            ) : (
              <FontAwesomeIcon className="w-4 h-4" icon={faPlay} />
            )}
          </button>

          {/* Stop 按钮 */}
          <button
            className="
              bg-gray-700 
              text-white 
              h-11 w-11 
              flex items-center justify-center
              rounded-full 
              transition-all 
              duration-200
              hover:bg-gray-600
              hover:shadow-[0_0_15px_rgba(107,114,128,0.5)]
              hover:scale-105
              active:scale-95
            "
            onClick={() => {
              stopTimer()
              // 若想在Stop时清空localMinutes，也可加: setLocalMinutes(0);
            }}>
            <FontAwesomeIcon className="w-4 h-4" icon={faStop} />
          </button>
        </div>
      </div>
    </div>
  )
}
