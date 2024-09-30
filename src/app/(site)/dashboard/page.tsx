import Link from 'next/link'
import React from 'react'
import DashboardNav from '../components/DashboardNav'

export default function DashboardPage() {
  return (
    <div className="bg-red-200">
      <DashboardNav />
      <div>booked events listed here</div>
    </div>
  )
}
