'use client'
import { useState } from 'react'
import { Button, Drawer } from 'flowbite-react'
import EventTypeForm from '../../components/EventTypeForm'
import DashboardNav from '../../components/DashboardNav'
import CalendarComponent from '../../components/Calendar'
import { IEvent } from '../../../models/Event'
import useSWR, { mutate } from 'swr'
interface EventFormData {
  title: string
  description?: string
  start: string
  end: string
}
export default function EventTypesPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)
  const [formKey, setFormKey] = useState(0) // 用于强制重新渲染表单组件
  const { data, error } = useSWR('/api/events')

  if (error) return <div>加载失败: {error.error}</div>
  if (!data) return <div>加载中...</div>

  const addEvent = async (event: EventFormData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      const result = await res.json()
      if (result.success) {
        setIsOpen(false)
        mutate('/api/events')
      } else {
        console.error(result.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateEvent = async (id: string, updatedEvent: Partial<IEvent>) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      })
      const result = await res.json()
      if (result.success) {
        setIsOpen(false)
        setSelectedEvent(null)
        mutate('/api/events')
      } else {
        console.error(result.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (result.success) {
        mutate('/api/events')
      } else {
        console.error(result.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (event: IEvent) => {
    setSelectedEvent(event)
    setFormKey((prevKey) => prevKey + 1) // 更新 key 值来重新渲染表单
    setIsOpen(true)
  }
  const handleAdd = () => {
    setSelectedEvent(null)
    setFormKey((prevKey) => prevKey + 1) // 更新 key 值来重新渲染表单
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className="bg-green-200 flex-col">
      <DashboardNav />
      <CalendarComponent
        events={data.data}
        onEdit={handleEdit}
        onDelete={deleteEvent}
        onAdd={handleAdd}
      />
      <Drawer open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header>{selectedEvent ? '编辑日程' : '添加日程'}</Drawer.Header>
        <div className="p-4">
          <EventTypeForm
            key={formKey} // 每次重新渲染时更新 key
            onClose={handleClose}
            onSave={
              selectedEvent
                ? (updatedEvent) => updateEvent(selectedEvent._id, updatedEvent)
                : addEvent
            }
            initialData={selectedEvent}
          />
        </div>
      </Drawer>
    </div>
  )
}
