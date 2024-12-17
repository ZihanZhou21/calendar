'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/(site)/components/task/TaskCard'
import DailyTaskCard from '@/(site)/components/task/DailyTaskCard'
import TaskForm from '@/(site)/components/task/TaskForm'
import { Task, DailyTask } from '@type/task'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

  const taskApi = '/api/tasks'
  const dailyTaskApi = '/api/daily-tasks'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(taskApi)
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
        const response = await fetch(dailyTaskApi)
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

    fetchTasks()
    fetchDailyTasks()
  }, [])

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
        // 添加任务到任务列表
        setTasks((prev) => [...prev, data.data.task])
        // 添加每日任务到每日任务列表
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
    try {
      const response = await fetch(`${taskApi}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, totalDuration, totalDays }),
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

  const completeDailyTask = async (dailyTaskId: string) => {
    try {
      const response = await fetch(`${dailyTaskApi}/${dailyTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: true }),
      })

      const data = await response.json()
      if (data.success) {
        setDailyTasks((prev) =>
          prev.map((dailyTask) =>
            dailyTask._id === dailyTaskId
              ? { ...dailyTask, isCompleted: true }
              : dailyTask
          )
        )
      } else {
        setError('每日任务完成失败，请稍后重试。')
      }
    } catch {
      setError('每日任务完成失败，请稍后重试。')
    }
  }

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        创建任务
      </button>
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
      <div>
        <h2 className="text-xl font-bold mb-2">任务列表</h2>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={() => deleteTask(task._id)}
            onEdit={() => {
              setEditingTask(task)
              setShowForm(true)
            }}
          />
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold mt-6 mb-2">每日任务列表</h2>
        {dailyTasks.map((dailyTask) => (
          <DailyTaskCard
            key={dailyTask._id}
            task={dailyTask}
            onComplete={() => completeDailyTask(dailyTask._id)}
          />
        ))}
      </div>
    </div>
  )
}
