// components/EventForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { IEvent } from '../../models/Event'
import Link from 'next/link'
import clsx from 'clsx'

interface EventFormProps {
  onClose: () => void
  onSave: (event: Omit<IEvent, '_id' | 'createdAt'>) => void
  initialData?: IEvent | null
}

const EventTypeForm: React.FC<EventFormProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setStart(initialData.start.toISOString().substring(0, 16)) // 格式化为 "YYYY-MM-DDTHH:mm"
      setEnd(initialData.end.toISOString().substring(0, 16))
    }
    console.log(initialData)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const event = {
      title,
      description,
      start: new Date(start),
      end: new Date(end),
    }
    onSave(initialData ? { ...event } : event)
    onClose()
    console.log(event)
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {initialData ? '编辑日程' : '添加日程'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1">开始时间</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">结束时间</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              // onClick={onClose}
              className="mr-2 px-4 py-2 border rounded">
              <Link
                className={clsx(
                  'rounded-full  px-4 py-2 '
                  // isEventTypesPage && 'bg-gray-200',
                  // !isEventTypesPage && 'bg-blue-600'
                )}
                href={'/dashboard'}>
                取消
              </Link>
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded">
              {initialData ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventTypeForm
