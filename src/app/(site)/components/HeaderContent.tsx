// HeaderContent.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { Dropdown } from 'flowbite-react'

interface HeaderContentProps {
  email?: string | null
}

export default function HeaderContent({ email }: HeaderContentProps) {
  const menuItems = [
    { path: '/features', label: 'Features' },
    { path: '/about', label: 'About' },
    { path: '/pricing', label: 'Pricing' },
  ]

  return (
    <header className="bg-green-200 flex justify-between items-center p-4 text-gray-600 font-light">
      {/* Left side with logo */}
      <Link
        href="/"
        className="text-blue-600 font-bold text-2xl flex items-center gap-2">
        <CalendarDays size={28} />
        Calendix
      </Link>

      {/* Navigation links for larger screens */}
      <nav className="hidden custom:flex gap-4 items-center">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path}>
            {item.label}
          </Link>
        ))}
        {email ? (
          <>
            <Link href="/dashboard">{email}</Link>
            <a href="/api/logout">Logout</a>
          </>
        ) : (
          <>
            <Link href="/api/auth">Sign in</Link>
            <Link
              href="/about"
              className="bg-blue-600 text-white p-2 rounded-full">
              Get started
            </Link>
          </>
        )}
      </nav>
      {/* Dropdown for smaller screens */}
      <div className="custom:hidden">
        <Dropdown
          label={email || 'Sign in'}
          inline
          dismissOnClick
          className="ml-auto">
          {email ? (
            <>
              <Dropdown.Item href="/dashboard">{email}</Dropdown.Item>
              <Dropdown.Divider />
              {menuItems.map((item, index) => (
                <Dropdown.Item key={index} href={item.path}>
                  {item.label}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item href="/api/logout">Logout</Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item href="/api/auth">Sign in</Dropdown.Item>
              <Dropdown.Divider />
              {menuItems.map((item, index) => (
                <Dropdown.Item key={index} href={item.path}>
                  {item.label}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item
                href="/about"
                className="bg-blue-600 text-white p-2 rounded-full">
                Get started
              </Dropdown.Item>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  )
}
