'use client'

import { useState, useEffect } from 'react'

/**
 * 让每个卡片通过 taskId 来存取 "timer_{taskId}"。
 * 如果本地没有存过该taskId，就用 defaultSeconds 作为初始 timeLeft。
 */
export function useLocalTimer(taskId: string, defaultSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds) // 剩余秒数
  const [isActive, setIsActive] = useState(false) // 是否正在倒计时

  // 1. 挂载时，从 localStorage 恢复，如果没存过就用 defaultSeconds
  useEffect(() => {
    const storageKey = `timer_${taskId}`
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.timeLeft === 'number') {
          setTimeLeft(parsed.timeLeft)
        } else {
          // 若 timeLeft 不存在或不是number，就用 defaultSeconds
          setTimeLeft(defaultSeconds)
        }
        if (typeof parsed.isActive === 'boolean') {
          setIsActive(parsed.isActive)
        }
      } catch (err) {
        console.error('Failed to parse localStorage for', taskId, err)
        // 解析失败，使用 defaultSeconds 作为初始值
        setTimeLeft(defaultSeconds)
      }
    } else {
      // 本地没存过 -> 用 defaultSeconds
      setTimeLeft(defaultSeconds)
    }
  }, [taskId, defaultSeconds])

  // 2. 每秒倒计时
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // 倒数到0自动停止
      setIsActive(false)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, timeLeft])

  // 3. 每次 timeLeft 或 isActive 改变，就写回 localStorage
  useEffect(() => {
    const storageKey = `timer_${taskId}`
    localStorage.setItem(storageKey, JSON.stringify({ timeLeft, isActive }))
  }, [taskId, timeLeft, isActive])

  // 提供给外部的控制函数
  const startTimer = (seconds: number) => {
    setTimeLeft(seconds)
    setIsActive(true)
  }
  const pauseTimer = () => {
    setIsActive(false)
  }
  const resumeTimer = () => {
    if (timeLeft > 0) setIsActive(true)
  }
  const stopTimer = () => {
    setTimeLeft(0)
    setIsActive(false)
  }

  return {
    timeLeft,
    isActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  }
}
