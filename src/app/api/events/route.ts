// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../utils/dbConnect'
import Event, { IEvent } from '../../models/Event'

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const events: IEvent[] = await Event.find({})
    console.log('Events fetched from database:', events)
    return NextResponse.json({ success: true, data: events }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const body = await req.json()
    const event: IEvent = await Event.create(body)
    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
