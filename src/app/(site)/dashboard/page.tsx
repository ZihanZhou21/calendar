'use client'

import Link from 'next/link'
import React from 'react'
import DashboardNav from '../components/DashboardNav'
import CalendarComponent from '../components/Calendar'
import { IEvent } from '@/app/models/Event'
import useSWR, { mutate } from 'swr'
import EventItem from '../components/EventItem'

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/api/events')
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading events</div>
  console.log('Fetched Events:', data)

  return (
    <div className="bg-red-200">
      <DashboardNav />
      <CalendarComponent
        events={data.data}
        onEdit={function (event: IEvent): void {
          throw new Error('Function not implemented.')
        }}
        onDelete={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
      />
      <ul>
        {data.data.map((event) => (
          <EventItem
            key={event._id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      <div>booked events listed here</div>
    </div>
  )
}
