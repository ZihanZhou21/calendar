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
    <li className="flex bg-blue-200 rounded-xl m-2 justify-between gap-3 items-center p-2 ">
      <div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.description}</p>
        <p className="text-sm">
          {new Date(event.start).toLocaleString()} -{' '}
          {new Date(event.end).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-2 ">
        <button
          onClick={() => onEdit(event)}
          className="whitespace-nowrap text-blue-500 hover:underline">
          编辑
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="whitespace-nowrap text-red-500 hover:underline">
          删除
        </button>
      </div>
    </li>
  )
}

export default EventItem
