import { Task } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onEdit: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const { title, totalDuration, remainingDuration, remainingDays } = task
  const isCompleted = remainingDuration === 0

  /**
   * 使用一个渐变+半透明组合背景，实现更现代的「卡片」风格。
   * 若已完成，呈现更柔和的渐变，否则使用色彩更饱满的渐变。
   */
  const backgroundClass = isCompleted
    ? 'bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300'
    : 'bg-gradient-to-tr from-purple-400 via-pink-300 to-pink-200'

  return (
    <div
      className={`
        relative p-6 rounded-xl shadow-xl
        transition-shadow duration-300 hover:shadow-2xl
        ${backgroundClass}
      `}>
      {/* 右上角的图标按钮区 */}
      <div className="absolute top-4 right-4 flex space-x-3">
        {/* 只有未完成状态才显示编辑按钮 */}
        {!isCompleted && (
          <button
            onClick={onEdit}
            className="
              text-blue-700 hover:text-blue-900
              transition-colors duration-200
            "
            aria-label="Edit"
            title="Edit Task">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}
        <button
          onClick={onDelete}
          className="
            text-red-600 hover:text-red-800
            transition-colors duration-200
          "
          aria-label="Delete"
          title="Delete">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* 任务标题 */}
      <h3
        className="
          text-xl font-bold mb-4 text-gray-700
          truncate
        ">
        {title}
      </h3>

      {/* 任务时长信息 */}
      <div className="space-y-2 text-gray-700">
        <p className="text-sm">
          <span className="text-gray-600">Remaining Days:</span>{' '}
          <span className="font-semibold text-gray-900">{remainingDays}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Total Duration:</span>{' '}
          <span className="font-semibold text-gray-900">
            {formatDuration(totalDuration)}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Duration:</span>{' '}
          {isCompleted ? (
            <span className="ml-1 font-bold text-green-700 text-lg">
              Completed
            </span>
          ) : (
            <span className="ml-1 text-2xl font-extrabold text-red-600">
              {formatDuration(remainingDuration)}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default TaskCard
