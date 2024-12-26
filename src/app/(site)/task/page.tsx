'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // 导入 useRouter
import TaskCard from '../components/task/TaskCard'
import DailyTaskCard from '../components/task/DailyTaskCard'
import TaskForm from '../components/task/TaskForm'
import { Task, DailyTask } from '@/type/task' // 确保路径正确
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter() // 初始化 useRouter

  const taskApi = '/api/tasks'
  const dailyTaskApi = '/api/daily-tasks'
  const resetDailyTaskApi = '/api/tasks/reset-daily-tasks'

  // --------------------- 获取任务数据的函数 ------------------------
  const fetchTasks = async () => {
    try {
      const response = await fetch(taskApi, { method: 'GET' })
      const data = await response.json()
      if (data.success) {
        setTasks(data.data)
      } else {
        setError('无法加载任务，请稍后重试。')
      }
    } catch (err) {
      setError('无法连接服务器任务，请检查网络。')
    }
  }

  const fetchDailyTasks = async () => {
    try {
      const response = await fetch(dailyTaskApi, { method: 'GET' })
      const data = await response.json()
      if (data.success) {
        setDailyTasks(data.data)
      } else {
        setError('无法加载每日任务，请稍后重试。')
      }
    } catch (err) {
      setError('无法连接每日任务服务器，请检查网络。')
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchDailyTasks()
  }, [])

  // --------------------- 定义更新按钮的处理函数 ------------------------
  const handleResetDailyTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(resetDailyTaskApi, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to reset daily tasks.')
      }
      const data = await response.json()
      if (data.success) {
        console.log('Daily tasks updated:', data.message)
        // 刷新页面数据
        router.refresh()
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err: any) {
      console.error(err)
      setError('更新每日任务失败，请稍后重试。')
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------- 任务相关函数 ------------------------
  const createTask = async (
    title: string,
    totalDuration: number,
    totalDays: number
  ) => {
    try {
      const response = await fetch(taskApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, totalDuration, totalDays }),
      })

      const data = await response.json()
      if (data.success) {
        setTasks((prev) => [...prev, data.data.task])
        setDailyTasks((prev) => [...prev, data.data.dailyTask])
        setShowForm(false)
      } else {
        setError('任务创建失败，请稍后重试。')
      }
    } catch (err) {
      setError('任务创建失败，请稍后重试。')
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${taskApi}/${taskId}`, { method: 'DELETE' })
      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId))
        setDailyTasks((prev) =>
          prev.filter((dailyTask) => dailyTask.taskId !== taskId)
        )
      } else {
        setError('删除任务失败，请稍后重试。')
      }
    } catch {
      setError('删除任务失败，请稍后重试。')
    }
  }

  const editTask = async (
    taskId: string,
    title: string,
    totalDuration: number,
    totalDays: number
  ) => {
    const remainingDuration = totalDuration
    const remainingDays = totalDays
    try {
      const response = await fetch(`${taskApi}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          totalDuration,
          remainingDuration,
          totalDays,
          remainingDays,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, ...data.data } : task
          )
        )
        setEditingTask(null)
        setShowForm(false)
      } else {
        setError('编辑任务失败，请稍后重试。')
      }
    } catch {
      setError('编辑任务失败，请稍后重试。')
    }
  }

  // --------------------- 完成每日任务的函数 ------------------------
  const completeDailyTask = async (
    dailyTaskId: string,
    remainingDuration: number,
    dailyDuration: number,
    taskId: string
  ) => {
    try {
      const currentTask = dailyTasks.find((d) => d._id === dailyTaskId)
      if (currentTask && currentTask.isCompleted) {
        return
      }

      const isCompleted = remainingDuration === 0

      const response = await fetch(`${dailyTaskApi}/${dailyTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted, remainingDuration }),
      })

      const data = await response.json()
      if (data.success) {
        setDailyTasks((prev) =>
          prev.map((dailyTask) =>
            dailyTask._id === dailyTaskId
              ? { ...dailyTask, isCompleted, remainingDuration }
              : dailyTask
          )
        )

        const completedDuration = dailyDuration - remainingDuration

        const taskResponse = await fetch(`${taskApi}/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedDuration }),
        })

        const taskData = await taskResponse.json()
        if (taskData.success) {
          setTasks((prev) =>
            prev.map((task) =>
              task._id === taskId
                ? {
                    ...task,
                    remainingDuration: taskData.data.remainingDuration,
                  }
                : task
            )
          )
        } else {
          setError('更新主任务失败，请稍后重试。')
        }
      } else {
        setError('每日任务状态更新失败，请稍后重试。')
      }
    } catch (error) {
      console.error(error)
      setError('请求过程中出现错误，请稍后重试。')
    }
  }

  // --------------------- 暂停每日任务的函数 ------------------------
  const pauseDailyTask = async (
    dailyTaskId: string,
    remainingDuration: number,
    dailyDuration: number,
    taskId: string
  ) => {
    try {
      // 在更新前获取当前每日任务
      const currentDailyTask = dailyTasks.find((d) => d._id === dailyTaskId)
      if (!currentDailyTask) {
        setError('未找到对应的每日任务')
        return
      }
      const oldDailyRemaining = currentDailyTask.remainingDuration

      // 计算本次暂停使用的时长差值
      const usedDifference = oldDailyRemaining - remainingDuration

      // 更新每日任务
      const isCompleted = remainingDuration === 0
      const response = await fetch(`${dailyTaskApi}/${dailyTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted, remainingDuration }),
      })

      const data = await response.json()
      if (!data.success) {
        setError('暂停每日任务失败，请稍后重试。')
        return
      }

      // 更新前端的dailyTasks状态
      setDailyTasks((prev) =>
        prev.map((dt) =>
          dt._id === dailyTaskId
            ? { ...dt, isCompleted, remainingDuration }
            : dt
        )
      )

      // 找到对应的主任务
      const currentTask = tasks.find((t) => t._id === taskId)
      if (!currentTask) {
        setError('未找到对应的主任务')
        return
      }

      // 基于主任务当前的remainingDuration计算新的剩余时间
      const oldTaskRemaining = currentTask.remainingDuration
      const newRemainingDuration = oldTaskRemaining - usedDifference

      // 向后端发送更新主任务的请求，只传remainingDuration
      const taskResponse = await fetch(`${taskApi}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingDuration: newRemainingDuration }),
      })

      const taskData = await taskResponse.json()
      if (taskData.success) {
        // 更新前端的tasks状态
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, remainingDuration: taskData.data.remainingDuration }
              : t
          )
        )
      } else {
        setError('更新主任务失败，请稍后重试。')
      }
    } catch (error) {
      console.error(error)
      setError('请求过程中出现错误，请稍后重试。')
    }
  }

  // --------------------- 重置每日任务的函数 ------------------------
  const resetDailyTasks = async () => {
    try {
      const response = await fetch(resetDailyTaskApi, { method: 'POST' })
      if (response.ok) {
        // 刷新页面以显示最新数据
        router.refresh()
      } else {
        setError('重置每日任务失败，请稍后重试。')
      }
    } catch {
      setError('重置每日任务失败，请稍后重试。')
    }
  }

  return (
    <div className="container mx-auto p-4 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Task</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between items-center w-full">
        {' '}
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          create task
        </button>
        {/* 更新每日任务按钮 */}
        <button
          onClick={handleResetDailyTasks}
          disabled={isLoading}
          className={`mb-6 px-4 py-2 rounded ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
          {isLoading ? (
            'refreshing...'
          ) : (
            <FontAwesomeIcon icon={faArrowsRotate} />
          )}
        </button>
      </div>
      {/* 创建任务按钮 */}

      {/* 任务表单 */}
      {showForm && (
        <TaskForm
          onCreateTask={
            editingTask
              ? (title, totalDuration, totalDays) =>
                  editTask(editingTask._id, title, totalDuration, totalDays)
              : createTask
          }
          onCancel={() => {
            setEditingTask(null)
            setShowForm(false)
          }}
          initialValues={editingTask || undefined}
        />
      )}

      {/* 任务列表 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">task list</h2>
        {tasks.length === 0 ? (
          <p>No Task</p>
        ) : (
          <div className="grid h-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={() => deleteTask(task._id)}
                onEdit={() => {
                  setEditingTask(task)
                  setShowForm(true)
                }}
                // Add this to allow content to determine height
              />
            ))}
          </div>
        )}
      </div>

      {/* 每日任务列表 */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Daily Task</h2>
        {dailyTasks.length === 0 ? (
          <p>No Daily Task</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
            {dailyTasks.map((dailyTask) => (
              <DailyTaskCard
                key={dailyTask._id}
                task={dailyTask}
                onComplete={async (dailyTaskId, remainingDuration) => {
                  try {
                    if (dailyTask.isCompleted) {
                      return
                    }
                    setIsLoading(true)
                    await completeDailyTask(
                      dailyTaskId,
                      remainingDuration,
                      dailyTask.dailyDuration,
                      dailyTask.taskId
                    )
                  } catch (error) {
                    console.error('Failed to complete daily task:', error)
                    setError('完成每日任务失败，请稍后重试。')
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onPause={async (dailyTaskId, remainingDuration) => {
                  try {
                    if (dailyTask.isCompleted) {
                      return
                    }
                    setIsLoading(true)
                    await pauseDailyTask(
                      dailyTaskId,
                      remainingDuration,
                      dailyTask.dailyDuration,
                      dailyTask.taskId
                    )
                  } catch (error) {
                    console.error('Failed to pause daily task:', error)
                    setError('暂停每日任务失败，请稍后重试。')
                  } finally {
                    setIsLoading(false)
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
