'use client'

import React, { useState } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import useSWR, { mutate } from 'swr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DashboardNav from '../components/DashboardNav'
import EventItem from '../components/EventItem'
import EventTypeForm from '../components/EventTypeForm'
import { Drawer, Button } from 'flowbite-react'
import { IEvent } from '@/app/models/Event'

const localizer = momentLocalizer(moment)

interface EventFormData {
  title: string
  description?: string
  start: string
  end: string
}

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState(Views.MONTH) // Controlled view
  const [currentDate, setCurrentDate] = useState(new Date()) // Controlled date
  const [isOpen, setIsOpen] = useState(false) // Drawer visibility
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null) // Selected event for editing
  const [formKey, setFormKey] = useState(0) // Unique key for form re-rendering

  const { data, error, isLoading } = useSWR('/api/events')

  const allViews = [Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]

  const handleViewChange = (view: any) => setCurrentView(view)
  const handleNavigate = (date: React.SetStateAction<Date>) =>
    setCurrentDate(date)

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

  const updateEvent = async (id: string, updatedEvent: EventFormData) => {
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading events</div>
  const handleSelectSlot = (slotInfo: {
    start: Date
    end: Date
    slots: Date[]
  }) => {
    setSelectedDate(slotInfo.start)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardNav />
      <div className="container mx-auto py-6">
        <Button onClick={handleAdd} className="mb-4">
          Add New Event
        </Button>
        <Calendar
          localizer={localizer}
          events={
            data?.data.map((event: IEvent) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            })) || []
          }
          // events={ data.data}
          view={currentView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={handleNavigate}
          views={allViews}
          selectable
          onSelectEvent={handleEdit}
          onSelectSlot={handleSelectSlot}
          style={{
            height: '80vh',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
          }}
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {data?.data.map((event: IEvent) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <EventItem
                event={event}
                onEdit={handleEdit}
                onDelete={() => deleteEvent(event._id)}
              />
            </div>
          ))}
        </ul>
      </div>
      <Drawer open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header>
          {selectedEvent ? 'Edit Event' : 'Add Event'}
        </Drawer.Header>
        <div className="p-4">
          <EventTypeForm
            key={formKey}
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
