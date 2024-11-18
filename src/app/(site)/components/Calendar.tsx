import { useState } from 'react'
import ReactCalendar, { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import EventItem from './EventItem'
import { IEvent } from '../../models/Event'
import { isSameDay, startOfDay, endOfDay, parseISO } from 'date-fns'

interface CalendarComponentProps {
  events: IEvent[]
  onEdit: (event: IEvent) => void
  onDelete: (id: string) => void
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateChange: CalendarProps['onChange'] = (value, event) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      setSelectedDate(value[0])
    }
  }

  const filteredEvents = events.filter((event) => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)
    const startOfSelectedDate = startOfDay(selectedDate)
    const endOfSelectedDate = endOfDay(selectedDate)
    return eventStart <= endOfSelectedDate && eventEnd >= startOfSelectedDate
  })

  const tileContent: CalendarProps['tileContent'] = ({ date, view }) => {
    if (
      view === 'month' ||
      view === 'year' ||
      view === 'decade' ||
      view === 'century'
    ) {
      const hasEvent = events.some((event) => {
        const eventStart = parseISO(event.start)
        const eventEnd = parseISO(event.end)
        return (
          isSameDay(eventStart, date) ||
          (eventStart <= date && eventEnd >= date)
        )
      })
      return hasEvent ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      ) : null
    }
    return null
  }

  return (
    <div className="flex flex-col md:flex-row bg-slate-500">
      <div className="flex">
        <ReactCalendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>
      <div className="flex flex-col mx-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold my-2 ml-2">
            Selected Date&apos;s Events
          </h2>
          <button className="mr-[5%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
        {filteredEvents.length === 0 ? (
          <p>No events scheduled for this date.</p>
        ) : (
          <ul className="rounded-2xl bg-white overflow-hidden">
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
