'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { clsx } from 'clsx/lite'
export default function DashboardNav() {
  const pathname = usePathname()
  const isEventTypesPage = pathname.includes('event-types')

  return (
    <div className="flex gap-4 justify-center bg-purple-50 pt-4">
      <Link
        className={clsx(
          'rounded-full  px-4 py-2 ',
          isEventTypesPage && 'bg-gray-200',
          !isEventTypesPage && 'bg-blue-600'
        )}
        href={'/dashboard'}>
        Booked events
      </Link>
      <Link
        className={clsx(
          'rounded-full  px-4 py-2 ',
          isEventTypesPage && 'bg-blue-600',
          !isEventTypesPage && 'bg-gray-200'
        )}
        href={'/dashboard/event-types'}>
        event types
      </Link>
    </div>
  )
}
