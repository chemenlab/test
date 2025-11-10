import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'

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

// GET /api/bookings - Получить все записи
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const masterId = searchParams.get('masterId')
    const workPostId = searchParams.get('workPostId')

    let filteredBookings = [...mockBookings]

    // Фильтрация по дате
    if (date) {
      filteredBookings = filteredBookings.filter(
        (booking) => format(new Date(booking.startTime), 'yyyy-MM-dd') === date
      )
    }

    // Фильтрация по мастеру
    if (masterId) {
      filteredBookings = filteredBookings.filter((booking) => booking.masterId === masterId)
    }

    // Фильтрация по рабочему посту
    if (workPostId) {
      filteredBookings = filteredBookings.filter((booking) => booking.workPostId === workPostId)
    }

    return NextResponse.json(filteredBookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST /api/bookings - Создать новую запись
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      vehicleId,
      serviceId,
      masterId,
      workPostId,
      startTime,
      endTime,
      notes,
    } = body

    // Валидация
    if (!clientId || !vehicleId || !serviceId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // Проверка на конфликт времени
    const hasConflict = mockBookings.some((booking) => {
      const existingStart = new Date(booking.startTime).getTime()
      const existingEnd = new Date(booking.endTime).getTime()
      const newStart = new Date(startTime).getTime()
      const newEnd = new Date(endTime).getTime()

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    // Создание новой записи
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      clientId,
      vehicleId,
      serviceId,
      masterId: masterId || null,
      workPostId: workPostId || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'confirmed',
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockBookings.push(newBooking)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
