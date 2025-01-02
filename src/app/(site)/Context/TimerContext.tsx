'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'

// 1. 定义 Context 中需要暴露的类型
interface TimerContextType {
  timeLeft: number // 剩余倒计时(秒)
  isActive: boolean // 是否在计时
  startTimer: (minutes: number) => void // 开始计时函数
  stopTimer: () => void // 停止(重置)计时函数
  pauseTimer: () => void // 暂停计时函数
  resumeTimer: () => void // 继续计时函数
}

// 2. 创建 Context 并设定默认值
const TimerContext = createContext<TimerContextType>({
  timeLeft: 0,
  isActive: false,
  startTimer: () => {},
  stopTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
})

// 3. 封装一个方便使用的 Hook
export function useTimer() {
  return useContext(TimerContext)
}

// 4. 创建 Provider，让它包裹住你所有的页面
export function TimerProvider({ children }: { children: ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  // 如果 isActive = true 且 timeLeft > 0，则每秒减少1
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // 如果倒计时剩余时间为0，则停止
      setIsActive(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, timeLeft])

  // 开始计时，传入“分钟”转换成秒
  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60)
    setIsActive(true)
  }

  // 停止(重置)计时
  const stopTimer = () => {
    setTimeLeft(0)
    setIsActive(false)
  }

  // 暂停计时：只停止倒计时进程，但保留剩余时间
  const pauseTimer = () => {
    setIsActive(false)
  }

  // 继续计时：如果还有剩余时间，则重新激活
  const resumeTimer = () => {
    if (timeLeft > 0) {
      setIsActive(true)
    }
  }

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        isActive,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
      }}>
      {children}
    </TimerContext.Provider>
  )
}
