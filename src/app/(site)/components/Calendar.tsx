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
    action: 'select' | 'click' | 'doubleClick'
  }) => {
    // 设置选中的日期
    setSelectedDate(slotInfo.start)
  }

  const handleNavigate = (date: React.SetStateAction<Date>) =>
    setCurrentDate(date)
  const allViews = [Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]

  // 修改 filteredEvents 逻辑，只比较日期而不是具体时间
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        const selected = new Date(selectedDate)

        // 重置时间为 00:00:00
        const selectedDateStart = new Date(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate()
        )
        const selectedDateEnd = new Date(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate(),
          23,
          59,
          59
        )

        return eventStart <= selectedDateEnd && eventEnd >= selectedDateStart
      })
    : []

  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }))

  // 添加选中日期的显示格式
  const formattedSelectedDate = selectedDate
    ? moment(selectedDate).format('YYYY年MM月DD日')
    : '未选择日期'

  return (
    <div className="flex flex-col md:flex-row bg-gray-100">
      <div className="flex flex-grow bg-white rounded-lg p-4">
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
          style={{
            height: '80vh',
            width: '100%',
          }}
          className="rounded-lg"
        />
      </div>
      <div className="flex w-[400px] flex-col mx-4 mb-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {formattedSelectedDate}的日程
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={onAdd}>
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

            {!selectedDate ? (
              <p className="text-gray-500 text-center py-4">点击日历选择日期</p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">当天没有安排日程</p>
            ) : (
              <ul className="space-y-2">
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
      </div>
    </div>
  )
}

export default CalendarComponent
