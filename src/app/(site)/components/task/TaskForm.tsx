import { useState } from 'react'

interface TaskFormProps {
  onCreateTask: (
    title: string,
    totalDuration: number, // 总时长以秒为单位
    totalDays: number
  ) => void
  initialValues?: {
    title: string
    totalDuration: number // 总时长以秒为单位
    totalDays: number
  }
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask, initialValues }) => {
  const [title, setTitle] = useState<string>(initialValues?.title || '')
  const [hours, setHours] = useState<number>(
    Math.floor((initialValues?.totalDuration || 0) / 3600)
  )
  const [minutes, setMinutes] = useState<number>(
    Math.floor(((initialValues?.totalDuration || 0) % 3600) / 60)
  )
  const [totalDays, setTotalDays] = useState<number>(
    initialValues?.totalDays || 1
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalDuration = hours * 3600 + minutes * 60 // 换算为秒
    onCreateTask(title, totalDuration, totalDays)
    setTitle('')
    setHours(0)
    setMinutes(0)
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
        <label className="block text-sm font-medium">任务总时长</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
            className="border p-2 rounded w-1/2"
            placeholder="小时"
            required
          />
          <input
            type="number"
            value={minutes}
            onChange={(e) =>
              setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))
            }
            className="border p-2 rounded w-1/2"
            placeholder="分钟"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">任务总天数</label>
        <input
          type="number"
          value={totalDays}
          onChange={(e) => setTotalDays(Math.max(1, Number(e.target.value)))}
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
