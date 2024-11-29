import { useState } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
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
  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(moment().toDate())

  const handleViewChange = (view: View) => {
    setCurrentView(view)
    console.log(currentDate)
    console.log(getStartDate())
    console.log(getLength())
  }

  const handleSelectEvent = (event: IEvent) => {
    onEdit(event)
  }

  const handleSelectSlot = (slotInfo: {
    start: Date
    end: Date
    slots: Date[]
    action: 'select' | 'click' | 'doubleClick'
  }) => {
    setSelectedDate(slotInfo.start)
  }

  const handleNavigate = (date: React.SetStateAction<Date>) =>
    setCurrentDate(date)

  const allViews = [Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]

  // 使用 moment 处理事件过滤
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventStart = moment(event.start)
        const eventEnd = moment(event.end)
        const selectedDay = moment(selectedDate)

        const selectedDayStart = selectedDay.clone().startOf('day')
        const selectedDayEnd = selectedDay.clone().endOf('day')

        return (
          eventStart.isSameOrBefore(selectedDayEnd) &&
          eventEnd.isSameOrAfter(selectedDayStart)
        )
      })
    : []

  // 使用 moment 格式化事件日期
  const formattedEvents = events.map((event) => ({
    ...event,
    start: moment(event.start).toDate(),
    end: moment(event.end).toDate(),
  }))

  // 使用 moment 格式化选中日期显示
  const formattedSelectedDate = selectedDate
    ? moment(selectedDate).format('YYYY年MM月DD日')
    : '未选择日期'

  // 使用 moment 处理日期样式
  const dayPropGetter = (date: Date) => {
    const currentDate = moment(date)
    const selectedDay = selectedDate && moment(selectedDate)
    const today = moment()

    // 检查是否是选中的日期
    if (selectedDay && currentDate.isSame(selectedDay, 'day')) {
      return {
        className:
          'bg-blue-50 rounded-md border-2 border-blue-200 font-semibold text-blue-700',
      }
    }

    // 检查是否是今天
    if (currentDate.isSame(today, 'day')) {
      return {
        className: 'bg-gray-50 rounded-md font-medium',
      }
    }

    return {}
  }

  // 事件样式
  const eventPropGetter = () => ({
    className:
      'text-xs py-0.5 px-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200',
  })

  // 根据当前视图获取agenda范围配置
  const [startDate, setStartDate] = useState<Date>(
    moment(currentDate).startOf('month').toDate()
  )
  const [length, setLength] = useState(1)
  const getStartDate = () => {
    switch (currentView) {
      case Views.MONTH:
        return setStartDate(moment(currentDate).startOf('month').toDate())
      case Views.WEEK:
        return setStartDate(moment(currentDate).startOf('week').toDate())
      case Views.DAY:
        return currentDate
      default:
        return moment(currentDate).startOf('month').toDate()
    }
  }
  const getLength = () => {
    switch (currentView) {
      case Views.MONTH:
        return setLength(moment(currentDate).daysInMonth())
      case Views.WEEK:
        return setLength(7)
      case Views.DAY:
        return setLength(1)
      default:
        return moment(currentDate).daysInMonth()
    }
  }
  return (
    <div className="flex flex-col md:flex-row bg-gray-100">
      <div className="flex flex-grow bg-white rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={formattedEvents as any[]}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          views={allViews}
          onView={handleViewChange}
          // date={currentDate}
          onNavigate={handleNavigate}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          className="rounded-lg [&_.rbc-event]:min-h-[20px] [&_.rbc-event-content]:text-xs [&_.rbc-event-content]:leading-4 [&_.rbc-show-more]:text-xs [&_.rbc-show-more]:text-blue-500 [&_.rbc-show-more]:bg-transparent [&_.rbc-show-more]:p-0.5 [&_.rbc-event]:my-0.5 [&_.rbc-event-label]:text-[0.7rem] [&_.rbc-event-label]:px-0.5 [&_.rbc-allday-cell]:max-h-[45px]"
          style={{
            height: '80vh',
            width: '100%',
          }}
          length={length}
          date={currentDate}
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
