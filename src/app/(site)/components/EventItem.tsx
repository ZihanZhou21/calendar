// components/EventItem.tsx
'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { IEvent } from '../../models/Event'

interface EventItemProps {
  event: IEvent
  onEdit: (event: IEvent) => void
  onDelete: (id: string) => void
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onDelete }) => {
  return (
    <div className="flex  rounded-xl justify-between gap-3 items-center p-2 ">
      <div className="overflow-hidden">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm break-all break-words text-gray-600">
          {event.description}
        </p>
        <p className="text-sm">
          {new Date(event.start).toLocaleString()} -{' '}
          {new Date(event.end).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-2 ">
        <button
          onClick={() => onEdit(event)}
          className="whitespace-nowrap text-blue-500 hover:underline">
          <FontAwesomeIcon icon={faPenToSquare} className="bg-blue-300" />
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="whitespace-nowrap text-red-500 hover:underline">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  )
}

export default EventItem
