// Header.tsx - server component
'use server'
import React from 'react'
import { session } from '@/app/libs/session'
import HeaderContent from './HeaderContent' // client component

export default async function Header() {
  const email = await session().get('email')

  return <HeaderContent email={email} />
}
