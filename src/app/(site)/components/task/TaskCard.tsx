import { Task } from '@type/task'
import { formatDuration } from '@/utils/formatDuration'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboard,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onEdit: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const { title, totalDuration, remainingDuration, remainingDays } = task
  const isCompleted = remainingDuration === 0

  // 新增展开/收起状态
  const [isOpen, setIsOpen] = useState(false)

  // 进度条计算
  const percent = totalDuration > 0 ? 1 - remainingDuration / totalDuration : 1
  // 颜色渐变：红(0%) - 橙(50%) - 绿(100%)
  const getProgressColor = (p: number) => {
    if (p < 0.33) return 'bg-red-400'
    if (p < 0.66) return 'bg-yellow-400'
    return 'bg-green-500'
  }

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
        relative flex flex-col items-center justify-center cursor-pointer
        p-3 rounded-lg shadow-lg
        transition-all duration-300 hover:shadow-2xl hover:scale-105
        w-32 min-h-[110px] max-w-full
        ${backgroundClass}
      `}
      onClick={() => setIsOpen((v) => !v)}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}>
      {/* 缩小的图标和标题 */}
      <FontAwesomeIcon
        icon={faClipboard}
        className="text-2xl text-purple-700 mb-1"
      />
      <h3 className="text-xs font-bold text-gray-700 truncate mb-1 text-center w-full">
        {title}
      </h3>
      {/* 进度条 */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full ${getProgressColor(percent)} transition-all duration-300`}
          style={{ width: `${Math.round(percent * 100)}%` }}
        />
      </div>
      {/* 展开时显示详细信息和操作按钮 */}
      {isOpen && (
        <div
          className="w-56 mt-2 flex flex-col items-center z-10 absolute left-1/2 -translate-x-1/2 top-full bg-white rounded-xl shadow-2xl p-4 border border-purple-100"
          onClick={(e) => e.stopPropagation()}>
          <div className="space-y-2 text-gray-700 w-full">
            <p className="text-sm">
              <span className="text-gray-600">剩余天数:</span>{' '}
              <span className="font-semibold text-gray-900">
                {remainingDays}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">总时长:</span>{' '}
              <span className="font-semibold text-gray-900">
                {formatDuration(totalDuration)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">剩余时长:</span>{' '}
              {isCompleted ? (
                <span className="ml-1 font-bold text-green-700 text-lg">
                  已完成
                </span>
              ) : (
                <span className="ml-1 text-2xl font-extrabold text-red-600">
                  {formatDuration(remainingDuration)}
                </span>
              )}
            </p>
          </div>
          {/* 操作按钮区 */}
          <div className="flex space-x-4 mt-4">
            {!isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="text-blue-700 hover:text-blue-900 transition-colors duration-200"
                aria-label="Edit"
                title="编辑任务">
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
              aria-label="Delete"
              title="删除任务">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard
