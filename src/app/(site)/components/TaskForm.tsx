import { useState } from 'react'

interface TaskFormProps {
  onCreateTask: (
    title: string,
    totalDuration: number,
    totalDays: number
  ) => void
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask }) => {
  const [title, setTitle] = useState<string>('')
  const [hours, setHours] = useState<number>(0) // 小时
  const [minutes, setMinutes] = useState<number>(0) // 分钟
  const [totalDays, setTotalDays] = useState<number>(1) // 天数

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 计算总时长（秒）
    const totalDuration = hours * 3600 + minutes * 60

    if (totalDuration === 0) {
      alert('总时长不能为空！')
      return
    }

    onCreateTask(title, totalDuration, totalDays)

    // 重置表单
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
          <p>小时</p>
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
          <p>分钟</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">任务总天数</label>
        <input
          type="number"
          value={totalDays}
          onChange={(e) => setTotalDays(Math.max(1, Number(e.target.value)))}
          className="border p-2 rounded w-full"
          placeholder="天数"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded">
        创建任务
      </button>
    </form>
  )
}

export default TaskForm
