'use server'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { session } from '@/app/libs/session'
export default async function Header() {
  const email = await session().get('email')

  return (
    <header className="flex gap-4 justify-between py-4 text-gray-600 font-light">
      <div className="flex items-center gap-10">
        <Link
          className="text-blue-600 font-bold text-2xl gap-2 items-center flex"
          href={'/'}>
          <CalendarDays size={28} />
          Calendix
        </Link>
        <nav className="flex gap-4 items-center ">
          <Link href={'/features'}>Features</Link>
          <Link href={'/about'}>About</Link>
          <Link href={'/pricing'}>pricing</Link>
        </nav>
      </div>
      {email && (
        <nav className="flex gap-4 items-center ">
          <Link href={'/dashboard'}>{email}</Link>
          <a href={'/api/logout'}>logout</a>
        </nav>
      )}
      {!email && (
        <nav className="flex gap-4 items-center ">
          <Link href={'/api/auth'}>Sign in</Link>
          <Link
            href={'/about'}
            className="bg-blue-600 text-white p-2 rounded-full">
            Get started
          </Link>
        </nav>
      )}
    </header>
  )
}
