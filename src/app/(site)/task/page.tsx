'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/(site)/components/task/TaskCard'
import TaskForm from '@/(site)/components/task/TaskForm'
import { Task } from '@type/task'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

  const taskApi = '/api/tasks'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(taskApi)
        const data = await response.json()
        console.log('Fetched tasks:', data) // Debugging log
        if (data.success) {
          setTasks(data.data)
        } else {
          console.error('Failed to fetch tasks:', data.error)
          setError('无法加载任务，请稍后重试。')
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        setError('无法连接服务器，请检查网络。')
      }
    }
    fetchTasks()
  }, [])
  console.log('tasks', tasks)
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

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      if (data.success) {
        setTasks((prev) => [...prev, data.data])
        setShowForm(false)
      }
    } catch (err) {
      console.error('Failed to create task:', err)
      setError('任务创建失败，请稍后重试。')
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${taskApi}/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
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

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      if (data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, ...data.data } : task
          )
        )
        setEditingTask(null)
      }
    } catch (err) {
      console.error('Failed to edit task:', err)
      setError('编辑任务失败，请稍后重试。')
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={() => setShowForm(true)}>创建任务</button>
      {showForm && (
        <TaskForm
          onCreateTask={
            editingTask
              ? (title, totalDuration, totalDays) =>
                  editTask(editingTask._id, title, totalDuration, totalDays)
              : createTask
          }
          initialValues={editingTask || undefined}
        />
      )}
      <div>
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id || `task-${index}`}
            task={task}
            onDelete={() => deleteTask(task._id)}
            onEdit={() => {
              setEditingTask(task)
              setShowForm(true)
            }}
          />
        ))}
      </div>
    </div>
  )
}
