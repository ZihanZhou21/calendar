import { Task } from '@type/task'
import { formatDuration } from '@/utils/formatDuration' // 引入格式化工具函数

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { title, totalDuration, remainingDuration, remainingDays } = task

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-blue-500 text-white relative">
      <h2 className="text-lg font-semibold truncate">{title}</h2>
      <p className="text-sm">总时长: {formatDuration(totalDuration)}</p>
      <p className="text-sm">剩余时长: {formatDuration(remainingDuration)}</p>
      <p className="text-sm">剩余天数: {remainingDays}天</p>
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={onEdit}
          className="bg-white text-blue-500 px-2 py-1 rounded">
          编辑
        </button>
        <button
          onClick={() => {
            if (confirm(`确定要删除任务 "${title}" 吗？`)) {
              onDelete()
            }
          }}
          className="bg-red-500 text-white px-2 py-1 rounded">
          删除
        </button>
      </div>
    </div>
  )
}

export default TaskCard
