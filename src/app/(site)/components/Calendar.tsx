'use client'

import { useState } from 'react'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import EventItem from './EventItem'
import { IEvent } from '../../models/Event'

interface CalendarProps {
  events: IEvent[]
  onEdit: (event: IEvent) => void
  onDelete: (id: string) => void
}

const CalendarComponent: React.FC<CalendarProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const filteredEvents = events.filter(
    (event) =>
      new Date(event.start).toDateString() === selectedDate.toDateString()
  )

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3">
        <ReactCalendar onChange={setSelectedDate} value={selectedDate} />
      </div>
      <div className="w-full md:w-2/3 md:ml-4 mt-4 md:mt-0">
        <h2 className="text-xl font-semibold mb-2">选定日期的日程</h2>
        {filteredEvents.length === 0 ? (
          <p>该日期没有日程安排。</p>
        ) : (
          <ul>
            {filteredEvents.map((event) => (
              <EventItem
                key={event._id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CalendarComponent
