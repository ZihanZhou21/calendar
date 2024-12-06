'use client'

import { useState } from 'react'
import DailyTaskCard from '@/(site)/components/DailyTaskCard'
import TaskCard from '@/(site)/components/TaskCard'
import TaskForm from '@/(site)/components/TaskForm'
import { Task, DailyTask } from '@type/task'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])

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
  }

  // 获取当天日期
  const today = new Date().toISOString().split('T')[0]

  // 筛选当天的任务
  const todayTasks = dailyTasks.filter((task) => task.date === today)

  return (
    <div className="p-4 space-y-8">
      {/* 创建任务表单 */}
      <section>
        <h1 className="text-2xl font-bold mb-4">创建任务</h1>
        <TaskForm onCreateTask={createTask} />
      </section>

      {/* 每日任务板 */}
      <section>
        <h1 className="text-2xl font-bold mb-4">每日任务板</h1>
        <div className="grid grid-cols-3 gap-4">
          {todayTasks.map((task) => (
            <DailyTaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* 任务板 */}
      <section>
        <h1 className="text-2xl font-bold mb-4">任务板</h1>
        <div className="grid grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  )
}
