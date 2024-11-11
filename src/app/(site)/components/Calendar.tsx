import { useState } from 'react'
import ReactCalendar, { TileContentFunc } from 'react-calendar'
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

  const filteredEvents = events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    // 将 selectedDate 的时间部分设置为 00:00:00
    const startOfSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )

    // 将 selectedDate 的时间部分设置为 23:59:59
    const endOfSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59
    )

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
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        return (
          eventStart.toDateString() === date.toDateString() ||
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
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3">
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>
      <div className="w-full md:w-2/3 md:ml-4 mt-4 md:mt-0 sm:ml-4">
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
