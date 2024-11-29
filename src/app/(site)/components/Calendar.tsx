import { useState } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventItem from './EventItem'
import { IEvent } from '../../models/Event'

interface CalendarComponentProps {
  events: IEvent[]
  onEdit: (event: IEvent) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

const localizer = momentLocalizer(moment)

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentView, setCurrentView] = useState(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date()) // Controlled date
  const handleViewChange = (view: any) => setCurrentView(view)
  const handleSelectEvent = (event: IEvent) => {
    onEdit(event)
    console.log(event)
  }

  const handleSelectSlot = (slotInfo: {
    start: Date
    end: Date
    slots: Date[]
  }) => {
    setSelectedDate(slotInfo.start)
  }

  const handleNavigate = (date: React.SetStateAction<Date>) =>
    setCurrentDate(date)
  const allViews = [Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]

  const filteredEvents =
    selectedDate &&
    events.filter((event) => {
      const start = new Date(event.start)
      const end = new Date(event.end)
      return start <= selectedDate && end >= selectedDate
    })

  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }))

  return (
    <div className="flex flex-col md:flex-row bg-slate-500">
      <div className="flex flex-grow">
        <Calendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          views={allViews}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={handleNavigate}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          style={{ height: '80vh', width: '100%' }}
        />
      </div>
      <div className="flex w-400 flex-col mx-4 mb-4 bg-slate-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold my-2 ml-2">
            Selected Date&apos;s Events
          </h2>
          <button className="mr-[5%]" onClick={onAdd}>
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
        {filteredEvents && filteredEvents.length === 0 ? (
          <p>No events scheduled for this date.</p>
        ) : (
          <ul className="rounded-2xl bg-white overflow-hidden">
            {filteredEvents &&
              filteredEvents.map((event) => (
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
