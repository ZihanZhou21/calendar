import { formatDuration } from '../../utils/formatDuration'

export default function TaskCard({ task }) {
  const { title, totalDuration, remainingDuration, isCompleted, startDate } =
    task

  const handleEdit = () => {
    console.log(`编辑任务: ${title}`)
  }

  const handleDelete = () => {
    console.log(`删除任务: ${title}`)
  }

  const handleViewDetails = () => {
    console.log(`查看任务详情: ${title}`)
  }

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-sm font-semibold truncate">{title}</h2>
      <p className="text-xs">总时长: {formatDuration(totalDuration)}</p>
      <p className="text-xs">剩余时长: {formatDuration(remainingDuration)}</p>
      <p className="text-xs">开始日期: {startDate}</p>
      <p
        className={
          isCompleted ? 'text-green-500 text-xs' : 'text-red-500 text-xs'
        }>
        {isCompleted ? '已完成' : '未完成'}
      </p>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={handleEdit}
          className="text-blue-500 text-xs underline">
          编辑
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 text-xs underline">
          删除
        </button>
        <button
          onClick={handleViewDetails}
          className="text-green-500 text-xs underline">
          查看详情
        </button>
      </div>
    </div>
  )
}
