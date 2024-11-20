// Header.tsx - server component
'use server'
import React from 'react'
import { sessionOptions } from '@/app/libs/session'
import HeaderContent from './HeaderContent'
import { getIronSession } from 'iron-session'
import { SessionData } from 'next-app-session/dist/types'
import { cookies } from 'next/headers'
// client component
async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  )
  return session.email
}

export default async function Header() {
  const email = await getSession()

  return <HeaderContent email={email} />
}
