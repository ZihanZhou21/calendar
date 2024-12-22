import { Task } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import { FaEdit, FaTrash } from 'react-icons/fa' // 引入图标组件
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faCoffee,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onEdit: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const { title, totalDuration, remainingDuration } = task
  const isCompleted = remainingDuration === 0

  // 根据是否完成改变背景
  const backgroundColor = isCompleted ? 'bg-gray-100' : 'bg-purple-100'

  return (
    <div
      className={`relative border p-6 rounded-lg shadow-md ${backgroundColor}`}>
      {/* 右上角的图标按钮 */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {!isCompleted && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            aria-label="编辑任务"
            title="编辑任务">
            {/* <FaEdit className="w-5 h-5" /> */}
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
          aria-label="删除任务"
          title="删除任务">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* 任务标题 */}
      <h3 className="text-xl font-bold mb-4 text-[#7E5CAD] truncate">
        {title}
      </h3>

      {/* 任务时长信息 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          总时长:{' '}
          <span className="font-semibold text-gray-900">
            {formatDuration(totalDuration)}
          </span>
        </p>
        <p className="text-sm text-gray-700">
          剩余时长:{' '}
          {isCompleted ? (
            <span className="ml-1 font-bold text-green-600 text-lg">
              已完成
            </span>
          ) : (
            <span className="ml-1 text-3xl font-extrabold text-red-600">
              {formatDuration(remainingDuration)}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default TaskCard
