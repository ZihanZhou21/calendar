'use client'

import React, { useState, useEffect } from 'react'
import { IEvent } from '../../models/Event'
import Link from 'next/link'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { format, parseISO } from 'date-fns'

interface EventFormProps {
  onClose: () => void
  onSave: (event: EventFormData) => void // 使用新的类型
  initialData?: IEvent | null
}

interface FormData {
  title: string
  description?: string
  start: Date | string
  end: Date | string
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
  const {
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')

      const startDate = parseISO(initialData.start as string)
      const endDate = parseISO(initialData.end as string)

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setStart(format(startDate, "yyyy-MM-dd'T'HH:mm"))
        setEnd(format(endDate, "yyyy-MM-dd'T'HH:mm"))
      } else {
        console.error('无效的日期格式')
        setStart('')
        setEnd('')
      }
    } else {
      reset({
        title: '',
        description: '',
        start: '',
        end: '',
      })
      setTitle('')
      setDescription('')
      setStart('')
      setEnd('')
    }
  }, [initialData, reset])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(end) < new Date(start)) {
      alert('结束时间不能早于起始时间')
      return
    }

    // 使用简化后的类型创建事件对象
    const event: EventFormData = {
      title,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    }

    onSave(event)
    onClose()
    console.log('Event:', event)
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className=" p-6  w-full max-w-md">
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
              onClick={onClose}
              className=" px-4 py-2 border rounded">
              取消
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
