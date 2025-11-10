'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Booking, TimeSlot } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

interface TimeSlotsGridProps {
  date: Date
  bookings: Booking[]
  onSlotClick: (time: string) => void
  onBookingClick: (booking: Booking) => void
}

// Генерация временных слотов с 9:00 до 20:00 с интервалом 30 минут
const generateTimeSlots = (date: Date, bookings: Booking[]): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 20

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotDate = new Date(date)
      slotDate.setHours(hour, minute, 0, 0)

      // Проверяем есть ли запись на это время
      const booking = bookings.find((b) => {
        const bookingStart = new Date(b.startTime)
        return (
          bookingStart.getHours() === hour &&
          bookingStart.getMinutes() === minute &&
          format(bookingStart, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )
      })

      slots.push({
        time: timeString,
        isAvailable: !booking,
        booking,
      })
    }
  }

  return slots
}

export function TimeSlotsGrid({
  date,
  bookings,
  onSlotClick,
  onBookingClick,
}: TimeSlotsGridProps) {
  const timeSlots = generateTimeSlots(date, bookings)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 border-blue-300 text-blue-900'
      case 'in_progress':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-900'
      case 'canceled':
        return 'bg-red-100 border-red-300 text-red-900'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает'
      case 'confirmed':
        return 'Подтверждено'
      case 'in_progress':
        return 'В работе'
      case 'completed':
        return 'Завершено'
      case 'canceled':
        return 'Отменено'
      default:
        return status
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {format(date, 'd MMMM yyyy', { locale: ru })}
        </h3>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
            <span className="text-muted-foreground">Подтверждено</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
            <span className="text-muted-foreground">В работе</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <div key={slot.time}>
            {slot.booking ? (
              <button
                onClick={() => onBookingClick(slot.booking!)}
                className={cn(
                  'w-full p-3 rounded-lg border-2 text-left transition-all hover:shadow-md',
                  getStatusColor(slot.booking.status)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="h-4 w-4" />
                    <span>{slot.time}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getStatusLabel(slot.booking.status)}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="font-medium text-sm">
                    {slot.booking.client?.name || 'Клиент'}
                  </p>
                  <p className="text-xs opacity-75">
                    {slot.booking.service?.name || 'Услуга'}
                  </p>
                  {slot.booking.vehicle && (
                    <p className="text-xs opacity-75">
                      {slot.booking.vehicle.brand} {slot.booking.vehicle.model}
                    </p>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={() => onSlotClick(slot.time)}
                className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 text-left transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{slot.time}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Свободно
                </p>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
