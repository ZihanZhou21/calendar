'use client'

import Link from 'next/link'
import React from 'react'
import DashboardNav from '../components/DashboardNav'
import CalendarComponent from '../components/Calendar'
import { IEvent } from '@/app/models/Event'
export default function DashboardPage() {
  return (
    <div className="bg-red-200">
      <DashboardNav />
      <CalendarComponent
        events={[]}
        onEdit={function (event: IEvent): void {
          throw new Error('Function not implemented.')
        }}
        onDelete={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
      />
      <div>booked events listed here</div>
    </div>
  )
}
