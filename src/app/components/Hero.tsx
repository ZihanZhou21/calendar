'use client'
import { Play } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useEffect, useState } from 'react'
export default function Hero() {
  const [showLine, setShowLine] = useState(false)
  useEffect(() => {
    setShowLine(true)
  }, [])
  return (
    <section className="text-center mt-24">
      <h1 className="text-5xl font-bold mb-4 leading-tight">
        Scheduling{' '}
        <span
          className={
            'text-blue-600 cool-underline ' + (showLine ? 'show-underline' : '')
          }>
          made simple
        </span>
        <br />
        for people like you
      </h1>
      <p className="text-gray-500">
        Most Scheduling appas are simple but ours is even more simple.
        <br />
        On top of this, it&apos;s open source and you can see the code.
      </p>
      <div className="mt-4 flex gap-4 justify-center">
        <Link href={'/'} className="bg-black text-white py-2 px-4 rounded-full">
          Get started for free
        </Link>
        <Link
          href={'/'}
          className=" py-2 px-4 rounded-full inline-flex gap-1 border items-center border-gray-300">
          <Play size={18} />
          watch video
        </Link>
      </div>
    </section>
  )
}
