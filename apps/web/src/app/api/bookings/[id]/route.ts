import { NextRequest, NextResponse } from 'next/server'

// Mock database - в будущем заменить на Prisma
let mockBookings = [
  {
    id: '1',
    clientId: '1',
    vehicleId: '1',
    serviceId: '1',
    masterId: '1',
    workPostId: '1',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    status: 'confirmed',
    notes: 'Клиент попросил позвонить за день',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// GET /api/bookings/[id] - Получить запись по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const booking = mockBookings.find((b) => b.id === id)

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

// PATCH /api/bookings/[id] - Обновить запись
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const bookingIndex = mockBookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Обновление записи
    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json(mockBookings[bookingIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/bookings/[id] - Удалить запись
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookingIndex = mockBookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    mockBookings.splice(bookingIndex, 1)

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
