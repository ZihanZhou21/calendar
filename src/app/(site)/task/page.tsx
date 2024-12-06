'use client'
import TaskCard from '../components/TaskCard'
import DailyTaskCard from '../components/DailyTaskCard'
import { useState } from 'react'

export default function TaskManagementPage() {
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      title: '学习编程 - Day 1',
      dailyDuration: 3600,
      remainingDuration: 1800,
      isCompleted: false,
      date: '2024-01-01',
    },
    {
      id: 2,
      title: '学习编程 - Day 2',
      dailyDuration: 3600,
      remainingDuration: 3600,
      isCompleted: false,
      date: '2024-01-02',
    },
  ])

  const tasks = [
    {
      id: 1,
      title: '学习编程',
      totalDuration: 7200,
      remainingDuration: 3600,
      isCompleted: false,
      startDate: '2024-01-01',
    },
    {
      id: 2,
      title: '阅读书籍',
      totalDuration: 5400,
      remainingDuration: 2400,
      isCompleted: false,
      startDate: '2024-01-02',
    },
  ]

  return (
    <div className="p-4 space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">每日任务板</h1>
        <div className="grid grid-cols-3 gap-4">
          {dailyTasks.map((task) => (
            <DailyTaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

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
