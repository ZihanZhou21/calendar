'use client'

import { useState } from 'react'
import DailyTaskCard from '@/(site)/components/DailyTaskCard'
import TaskCard from '@/(site)/components/TaskCard'
import TaskForm from '@/(site)/components/TaskForm'
import { Task, DailyTask } from '@type/task'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const createTask = (
    title: string,
    totalDuration: number,
    totalDays: number
  ) => {
    const taskId = tasks.length + 1
    const newTask: Task = {
      id: taskId,
      title,
      totalDuration,
      totalDays,
      remainingDuration: totalDuration,
      remainingDays: totalDays,
      startDate: new Date().toISOString().split('T')[0],
    }

    const dailyTaskList: DailyTask[] = Array.from(
      { length: totalDays },
      (_, i) => ({
        id: dailyTasks.length + i + 1,
        taskId,
        title: `${title} - Day ${i + 1}`,
        dailyDuration: Math.floor(totalDuration / totalDays),
        remainingDuration: Math.floor(totalDuration / totalDays),
        isCompleted: false,
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      })
    )

    setTasks([...tasks, newTask])
    setDailyTasks([...dailyTasks, ...dailyTaskList])
    setShowForm(false)
  }

  const deleteTask = (taskId: number) => {
    // 删除任务
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    // 删除与任务相关的每日任务
    setDailyTasks((prevDailyTasks) =>
      prevDailyTasks.filter((dailyTask) => dailyTask.taskId !== taskId)
    )
  }

  const editTask = (
    id: number,
    title: string,
    totalDuration: number,
    totalDays: number
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title,
              totalDuration,
              totalDays,
              remainingDuration: totalDuration,
              remainingDays: totalDays,
            }
          : task
      )
    )

    setDailyTasks((prevDailyTasks) =>
      prevDailyTasks
        .filter((task) => task.taskId !== id)
        .concat(
          Array.from({ length: totalDays }, (_, i) => ({
            id: dailyTasks.length + i + 1,
            taskId: id,
            title: `${title} - Day ${i + 1}`,
            dailyDuration: Math.floor(totalDuration / totalDays),
            remainingDuration: Math.floor(totalDuration / totalDays),
            isCompleted: false,
            date: new Date(Date.now() + i * 86400000)
              .toISOString()
              .split('T')[0],
          }))
        )
    )
    setEditingTask(null)
  }

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = dailyTasks.filter((task) => task.date === today)

  return (
    <div className="p-4 space-y-8 relative">
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 w-1/2">
            <h2 className="text-xl font-bold mb-4">创建任务</h2>
            <TaskForm onCreateTask={createTask} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-red-500 underline">
              取消
            </button>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 w-1/2">
            <h2 className="text-xl font-bold mb-4">编辑任务</h2>
            <TaskForm
              onCreateTask={(title, totalDuration, totalDays) =>
                editTask(editingTask.id, title, totalDuration, totalDays)
              }
              initialValues={{
                title: editingTask.title,
                totalDuration: editingTask.totalDuration,
                totalDays: editingTask.totalDays,
              }}
            />
            <button
              onClick={() => setEditingTask(null)}
              className="mt-4 text-red-500 underline">
              取消
            </button>
          </div>
        </div>
      )}

      <section className="bg-gray-100 border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">任务板</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            创建任务
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">每日任务板</h1>
        <div className="grid grid-cols-3 gap-4">
          {todayTasks.map((task) => (
            <DailyTaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  )
}
