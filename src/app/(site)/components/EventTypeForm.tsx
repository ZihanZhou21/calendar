'use client'

import React, { useState, useEffect } from 'react'
import { IEvent } from '../../models/Event'
import { format, parseISO, isValid } from 'date-fns'

interface EventFormProps {
  onClose: () => void
  onSave: (event: EventFormData) => void
  initialData?: IEvent | null
}

interface EventFormData {
  title: string
  description?: string
  start: string
  end: string
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
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')

      // 统一解析日期格式
      const startDate =
        typeof initialData.start === 'string'
          ? parseISO(initialData.start)
          : (initialData.start as Date) instanceof Date
          ? initialData.start
          : null

      const endDate =
        typeof initialData.end === 'string'
          ? parseISO(initialData.end)
          : (initialData.end as Date) instanceof Date
          ? initialData.end
          : null

      if (startDate && isValid(startDate)) {
        setStart(format(startDate, "yyyy-MM-dd'T'HH:mm"))
      } else {
        console.error('Invalid start date format:', initialData.start)
      }

      if (endDate && isValid(endDate)) {
        setEnd(format(endDate, "yyyy-MM-dd'T'HH:mm"))
      } else {
        console.error('Invalid end date format:', initialData.end)
      }
    } else {
      setTitle('')
      setDescription('')
      setStart('')
      setEnd('')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(end) < new Date(start)) {
      alert('结束时间不能早于开始时��')
      return
    }

    const event: EventFormData = {
      title,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    }

    onSave(event)
    onClose()
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {initialData ? '编辑日程' : '添加日程'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              placeholder="可选：输入描述"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              开始时间
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              结束时间
            </label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              取消
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              {initialData ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventTypeForm
