import Link from 'next/link'
import React from 'react'
import DashboardNav from '../components/DashboardNav'

export default function DashboardPage() {
  return (
    <>
      <DashboardNav />
      <div>booked events listed here</div>
    </>
  )
}
