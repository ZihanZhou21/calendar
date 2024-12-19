import { useState, useEffect } from 'react'

interface TaskFormProps {
  onCreateTask: (
    title: string,
    totalDuration: number,
    totalDays: number
  ) => Promise<void>
  onCancel: () => void
  initialValues?: {
    title: string
    totalDuration: number
    totalDays: number
  }
}

const TaskForm: React.FC<TaskFormProps> = ({
  onCreateTask,
  onCancel,
  initialValues,
}) => {
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const totalDuration = hours * 3600 + minutes * 60
    if (!title.trim()) {
      setError('任务标题不能为空')
      return
    }
    if (totalDuration <= 0) {
      setError('总时长必须大于 0')
      return
    }
    if (totalDays <= 0) {
      setError('总天数必须大于 0')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onCreateTask(title, totalDuration, totalDays)
      setTitle('')
      setHours(0)
      setMinutes(0)
      setTotalDays(1)
    } catch (err) {
      console.error('Failed to create task:', err)
      setError('任务创建失败，请稍后重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onCancel}></div>

      {/* 表单内容 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg z-50 space-y-4 max-w-md w-full">
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded">
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? '提交中...' : '提交'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
