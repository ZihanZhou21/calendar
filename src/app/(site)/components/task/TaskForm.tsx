import { useState } from 'react'

interface TaskFormProps {
  onCreateTask: (
    title: string,
    totalDuration: number,
    totalDays: number
  ) => void
  initialValues?: {
    title: string
    totalDuration: number
    totalDays: number
  }
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask, initialValues }) => {
  const [title, setTitle] = useState<string>(initialValues?.title || '')
  const [totalDuration, setTotalDuration] = useState<number>(
    initialValues?.totalDuration || 0
  )
  const [totalDays, setTotalDays] = useState<number>(
    initialValues?.totalDays || 1
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateTask(title, totalDuration, totalDays)
    setTitle('')
    setTotalDuration(0)
    setTotalDays(1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">任务标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">任务总时长（秒）</label>
        <input
          type="number"
          value={totalDuration}
          onChange={(e) => setTotalDuration(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">任务总天数</label>
        <input
          type="number"
          value={totalDays}
          onChange={(e) => setTotalDays(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded">
        提交
      </button>
    </form>
  )
}

export default TaskForm
