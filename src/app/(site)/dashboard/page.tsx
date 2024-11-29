'use client'

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import DashboardNav from '../components/DashboardNav'
import EventItem from '../components/EventItem'
import EventTypeForm from '../components/EventTypeForm'
import { Drawer, Button } from 'flowbite-react'
import { IEvent } from '@/app/models/Event'
import CalendarComponent from '@/app/(site)/components/Calendar'

interface EventFormData {
  title: string
  description?: string
  start: string
  end: string
}

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)
  const [formKey, setFormKey] = useState(0)

  const { data, error, isLoading } = useSWR('/api/events')

  const handleEdit = (event: IEvent) => {
    setSelectedEvent(event)
    setFormKey((prev) => prev + 1)
    setIsOpen(true)
  }

  const handleAdd = () => {
    setSelectedEvent(null)
    setFormKey((prev) => prev + 1)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个日程吗？')) {
      try {
        await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        })
        mutate('/api/events')
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  const handleUpdate = async (id: string, updatedEvent: EventFormData) => {
    try {
      await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      })
      mutate('/api/events')
      handleClose()
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  const handleAddEvent = async (newEvent: EventFormData) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
      mutate('/api/events')
      handleClose()
    } catch (error) {
      console.error('添加失败:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading events</div>

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardNav />
      <div className="container mx-auto py-6">
        <CalendarComponent
          events={data?.data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
      <Drawer open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header>{selectedEvent ? '编辑日程' : '添加日程'}</Drawer.Header>
        <div className="p-4">
          <EventTypeForm
            key={formKey}
            onClose={handleClose}
            onSave={
              selectedEvent
                ? (updatedEvent) =>
                    handleUpdate(selectedEvent._id, updatedEvent)
                : handleAddEvent
            }
            initialData={selectedEvent}
          />
        </div>
      </Drawer>
    </div>
  )
}
