// components/EventItem.tsx
'use client'

import React from 'react'
import { IEvent } from '../../models/Event'

interface EventItemProps {
  event: IEvent
  onEdit: (event: IEvent) => void
  onDelete: (id: string) => void
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center p-2 border-b">
      <div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.description}</p>
        <p className="text-sm">
          {new Date(event.start).toLocaleString()} -{' '}
          {new Date(event.end).toLocaleString()}
        </p>
      </div>
      <div>
        <button
          onClick={() => onEdit(event)}
          className="text-blue-500 mr-2 hover:underline">
          编辑
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="text-red-500 hover:underline">
          删除
        </button>
      </div>
    </li>
  )
}

export default EventItem
