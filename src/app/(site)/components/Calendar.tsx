import { useState } from 'react'
import ReactCalendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import EventItem from './EventItem'
import { IEvent } from '../../models/Event'
import { isSameDay, startOfDay, endOfDay, parseISO } from 'date-fns'

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

  const filteredEvents = events.filter((event) => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)

    const startOfSelectedDate = startOfDay(selectedDate)
    const endOfSelectedDate = endOfDay(selectedDate)

    return eventStart <= endOfSelectedDate && eventEnd >= startOfSelectedDate
  })

  const tileContent: TileContentFunc = ({ date, view }) => {
    if (
      view === 'month' ||
      view === 'day' ||
      view === 'week' ||
      view === 'year'
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
      <div className=" flex">
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>
      <div className="flex flex-col mx-4 mb-4">
        <h2 className="text-xl font-semibold my-2 ml-2">选定日期的日程</h2>
        {filteredEvents.length === 0 ? (
          <p>该日期没有日程安排。</p>
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
