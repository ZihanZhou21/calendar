// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../utils/dbConnect'
import Event, { IEvent } from '../../../models/Event'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const event: IEvent | null = await Event.findById(params.id)
    if (!event) {
      return NextResponse.json(
        { success: false, error: '未找到对应的日程' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const body = await req.json()
    const event: IEvent | null = await Event.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!event) {
      return NextResponse.json(
        { success: false, error: '未找到对应的日程' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const deletedEvent = await Event.deleteOne({ _id: params.id })
    if (!deletedEvent.deletedCount) {
      return NextResponse.json(
        { success: false, error: '未找到对应的日程' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
