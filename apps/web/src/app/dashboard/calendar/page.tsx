'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Wrench } from 'lucide-react'
import { format, addDays, startOfDay, addMinutes, isSameDay, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'

interface TimelineBooking {
  id: string
  clientName: string
  vehicleName: string
  serviceName: string
  startTime: Date
  endTime: Date
  mechanicId: string
  workPostId: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
}

interface Mechanic {
  id: string
  name: string
  workPostId: string
}

interface WorkPost {
  id: string
  name: string
}

// Mock data
const mockMechanics: Mechanic[] = [
  { id: 'mech-1', name: 'Дмитрий Мастеров', workPostId: 'post-1' },
  { id: 'mech-2', name: 'Алексей Иванов', workPostId: 'post-1' },
  { id: 'mech-3', name: 'Сергей Петров', workPostId: 'post-2' },
]

const mockWorkPosts: WorkPost[] = [
  { id: 'post-1', name: 'Пост 1' },
  { id: 'post-2', name: 'Пост 2' },
  { id: 'post-3', name: 'Пост 3' },
]

const today = new Date()

const mockBookings: TimelineBooking[] = [
  {
    id: 'b1',
    clientName: 'Иван Петров',
    vehicleName: 'Toyota Camry',
    serviceName: 'Замена масла',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    mechanicId: 'mech-1',
    workPostId: 'post-1',
    status: 'confirmed',
  },
  {
    id: 'b2',
    clientName: 'Мария Сидорова',
    vehicleName: 'BMW X5',
    serviceName: 'Диагностика подвески',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
    mechanicId: 'mech-1',
    workPostId: 'post-1',
    status: 'in_progress',
  },
  {
    id: 'b3',
    clientName: 'Алексей Смирнов',
    vehicleName: 'Volkswagen Polo',
    serviceName: 'Замена тормозных колодок',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
    mechanicId: 'mech-2',
    workPostId: 'post-1',
    status: 'confirmed',
  },
  {
    id: 'b4',
    clientName: 'Елена Волкова',
    vehicleName: 'Mazda CX-5',
    serviceName: 'ТО-2',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
    mechanicId: 'mech-3',
    workPostId: 'post-2',
    status: 'pending',
  },
]

export default function ImprovedCalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(today)
  const [viewMode, setViewMode] = React.useState<'mechanic' | 'workpost'>('mechanic')
  const [bookings, setBookings] = React.useState<TimelineBooking[]>(mockBookings)
  const [draggedBooking, setDraggedBooking] = React.useState<TimelineBooking | null>(null)

  // Time slots from 8:00 to 20:00 in 30-minute increments
  const timeSlots = React.useMemo(() => {
    const slots: Date[] = []
    const startHour = 8
    const endHour = 20

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 0))
      slots.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 30))
    }

    return slots
  }, [selectedDate])

  const filteredBookings = React.useMemo(() => {
    return bookings.filter(booking => isSameDay(booking.startTime, selectedDate))
  }, [bookings, selectedDate])

  const resourceList = viewMode === 'mechanic' ? mockMechanics : mockWorkPosts

  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1))
  }

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1))
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const handleDragStart = (e: React.DragEvent, booking: TimelineBooking) => {
    setDraggedBooking(booking)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (
    e: React.DragEvent,
    resourceId: string,
    timeSlot: Date
  ) => {
    e.preventDefault()

    if (!draggedBooking) return

    // Calculate duration
    const duration = draggedBooking.endTime.getTime() - draggedBooking.startTime.getTime()
    const newStartTime = timeSlot
    const newEndTime = new Date(timeSlot.getTime() + duration)

    // Check for conflicts
    const hasConflict = filteredBookings.some(booking => {
      if (booking.id === draggedBooking.id) return false

      const bookingResourceId = viewMode === 'mechanic' ? booking.mechanicId : booking.workPostId
      if (bookingResourceId !== resourceId) return false

      return (
        (newStartTime >= booking.startTime && newStartTime < booking.endTime) ||
        (newEndTime > booking.startTime && newEndTime <= booking.endTime) ||
        (newStartTime <= booking.startTime && newEndTime >= booking.endTime)
      )
    })

    if (hasConflict) {
      toast.error('Конфликт времени', {
        description: 'В это время уже есть другая запись',
      })
      setDraggedBooking(null)
      return
    }

    // Update booking
    setBookings(prev =>
      prev.map(booking => {
        if (booking.id === draggedBooking.id) {
          const updated = {
            ...booking,
            startTime: newStartTime,
            endTime: newEndTime,
          }

          if (viewMode === 'mechanic') {
            updated.mechanicId = resourceId
            // Find work post for this mechanic
            const mechanic = mockMechanics.find(m => m.id === resourceId)
            if (mechanic) {
              updated.workPostId = mechanic.workPostId
            }
          } else {
            updated.workPostId = resourceId
          }

          return updated
        }
        return booking
      })
    )

    toast.success('Запись перемещена', {
      description: `Новое время: ${format(newStartTime, 'HH:mm', { locale: ru })} - ${format(newEndTime, 'HH:mm', { locale: ru })}`,
    })

    setDraggedBooking(null)
  }

  const getBookingPosition = (booking: TimelineBooking, resourceId: string) => {
    const bookingResourceId = viewMode === 'mechanic' ? booking.mechanicId : booking.workPostId
    if (bookingResourceId !== resourceId) return null

    const slotHeight = 60 // pixels
    const startMinutes = booking.startTime.getHours() * 60 + booking.startTime.getMinutes()
    const endMinutes = booking.endTime.getHours() * 60 + booking.endTime.getMinutes()
    const dayStartMinutes = 8 * 60 // 8:00 AM

    const top = ((startMinutes - dayStartMinutes) / 30) * slotHeight
    const duration = endMinutes - startMinutes
    const height = (duration / 30) * slotHeight

    return { top, height }
  }

  const getStatusColor = (status: TimelineBooking['status']) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700',
      confirmed: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
      in_progress: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
      completed: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    }
    return colors[status]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Календарь записей</h1>
          <p className="text-muted-foreground">
            Timeline view с drag & drop функционалом
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'mechanic' | 'workpost') => setViewMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mechanic">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  По мастерам
                </div>
              </SelectItem>
              <SelectItem value="workpost">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  По постам
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                {format(selectedDate, 'd MMMM yyyy, EEEE', { locale: ru })}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Сегодня
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid gap-0 border-b" style={{ gridTemplateColumns: '80px repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div className="border-r p-2 text-sm font-medium text-muted-foreground">
                  Время
                </div>
                {resourceList.map((resource) => (
                  <div key={resource.id} className="border-r p-2 text-sm font-medium text-center">
                    {resource.name}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="relative">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="grid gap-0 border-b"
                    style={{ gridTemplateColumns: '80px repeat(auto-fit, minmax(150px, 1fr))' }}
                  >
                    <div className="border-r p-2 text-xs text-muted-foreground">
                      {format(slot, 'HH:mm')}
                    </div>
                    {resourceList.map((resource) => (
                      <div
                        key={resource.id}
                        className="border-r h-[60px] hover:bg-muted/50 transition-colors relative"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, resource.id, slot)}
                      />
                    ))}
                  </div>
                ))}

                {/* Bookings Overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ top: 0, left: 80 }}>
                  <div className="grid gap-0 h-full" style={{ gridTemplateColumns: `repeat(${resourceList.length}, minmax(150px, 1fr))` }}>
                    {resourceList.map((resource) => (
                      <div key={resource.id} className="relative pointer-events-none">
                        {filteredBookings.map((booking) => {
                          const position = getBookingPosition(booking, resource.id)
                          if (!position) return null

                          return (
                            <div
                              key={booking.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, booking)}
                              className={`absolute left-1 right-1 rounded-lg border-2 p-2 cursor-move pointer-events-auto ${getStatusColor(booking.status)} ${
                                draggedBooking?.id === booking.id ? 'opacity-50' : ''
                              }`}
                              style={{
                                top: `${position.top}px`,
                                height: `${position.height}px`,
                              }}
                            >
                              <div className="text-xs font-semibold truncate">
                                {booking.clientName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {booking.serviceName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900 border border-yellow-300" />
              <span>Ожидание</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900 border border-blue-300" />
              <span>Подтверждена</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900 border border-green-300" />
              <span>В работе</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300" />
              <span>Завершена</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Записей на сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Подтверждено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredBookings.filter(b => b.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredBookings.filter(b => b.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredBookings.filter(b => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
