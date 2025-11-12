'use client'

import * as React from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimeSlotsGrid } from './components/time-slots-grid'
import { CreateBookingDialog } from './components/create-booking-dialog'
import { BookingDetailsDialog } from './components/booking-details-dialog'
import { Booking, CreateBookingInput, Client, Vehicle, Service, User, WorkPost } from '@/lib/types'

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    source: 'website',
    tags: ['VIP'],
    notes: 'Постоянный клиент',
    clientType: "regular",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    _count: { bookings: 12, orders: 12 },
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    phone: '+7 (999) 234-56-78',
    email: 'maria@example.com',
    source: 'recommendation',
    tags: [],
    notes: null,
    clientType: "regular",
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    _count: { bookings: 3, orders: 3 },
  },
]

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    clientId: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    plateNumber: 'А123БВ',
    vin: 'XYZ123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    clientId: '2',
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    plateNumber: 'К456МН',
    vin: 'ABC987654321',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Замена масла',
    description: 'Замена моторного масла и масляного фильтра',
    price: 3500,
    duration: 60,
    category: 'Техобслуживание',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Диагностика двигателя',
    description: 'Компьютерная диагностика',
    price: 2000,
    duration: 30,
    category: 'Диагностика',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Замена тормозных колодок',
    description: 'Замена передних и задних колодок',
    price: 8500,
    duration: 120,
    category: 'Ремонт',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockMasters: User[] = [
  {
    id: '1',
    name: 'Алексей Смирнов',
    email: 'aleksey@example.com',
    role: 'master',
    avatar: null,
    phone: '+7 (999) 111-22-33',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Дмитрий Козлов',
    email: 'dmitry@example.com',
    role: 'master',
    avatar: null,
    phone: '+7 (999) 222-33-44',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockWorkPosts: WorkPost[] = [
  {
    id: '1',
    name: 'Пост 1',
    description: 'Основной рабочий пост',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Пост 2',
    description: 'Дополнительный пост',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockBookings: Booking[] = [
  {
    id: '1',
    clientId: '1',
    client: mockClients[0],
    vehicleId: '1',
    vehicle: mockVehicles[0],
    serviceId: '1',
    service: mockServices[0],
    masterId: '1',
    master: mockMasters[0],
    workPostId: '1',
    workPost: mockWorkPosts[0],
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    status: 'confirmed',
    notes: 'Клиент попросил позвонить за день',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    clientId: '2',
    client: mockClients[1],
    vehicleId: '2',
    vehicle: mockVehicles[1],
    serviceId: '2',
    service: mockServices[1],
    masterId: '2',
    master: mockMasters[1],
    workPostId: '2',
    workPost: mockWorkPosts[1],
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(14, 30, 0, 0)),
    status: 'in_progress',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [bookings, setBookings] = React.useState<Booking[]>(mockBookings)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState<string>('')
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [calendarOpen, setCalendarOpen] = React.useState(false)

  const handleSlotClick = (time: string) => {
    setSelectedTime(time)
    setCreateDialogOpen(true)
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setDetailsDialogOpen(true)
  }

  const handleCreateBooking = async (data: CreateBookingInput) => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: data.clientId,
      client: mockClients.find((c) => c.id === data.clientId),
      vehicleId: data.vehicleId,
      vehicle: mockVehicles.find((v) => v.id === data.vehicleId),
      serviceId: data.serviceId,
      service: mockServices.find((s) => s.id === data.serviceId),
      masterId: data.masterId || null,
      master: data.masterId ? mockMasters.find((m) => m.id === data.masterId) : null,
      workPostId: data.workPostId || null,
      workPost: data.workPostId ? mockWorkPosts.find((p) => p.id === data.workPostId) : null,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'confirmed',
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setBookings([...bookings, newBooking])
  }

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking)
    // TODO: Implement edit
  }

  const handleCancelBooking = (booking: Booking) => {
    setBookings(
      bookings.map((b) => (b.id === booking.id ? { ...b, status: 'canceled' as const } : b))
    )
  }

  const handleCompleteBooking = (booking: Booking) => {
    const newStatus = booking.status === 'confirmed' ? 'in_progress' : 'completed'
    setBookings(
      bookings.map((b) =>
        b.id === booking.id ? { ...b, status: newStatus as Booking['status'] } : b
      )
    )
  }

  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1))
  }

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Записи</h1>
          <p className="text-muted-foreground">Календарь записей и управление расписанием</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">Выбрать дату</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setCalendarOpen(false)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Новая запись
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border rounded-lg p-4 gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-center">
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Сегодня
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Slots Grid */}
      <TimeSlotsGrid
        date={selectedDate}
        bookings={bookings}
        onSlotClick={handleSlotClick}
        onBookingClick={handleBookingClick}
      />

      {/* Dialogs */}
      <CreateBookingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        clients={mockClients}
        vehicles={mockVehicles}
        services={mockServices}
        masters={mockMasters}
        workPosts={mockWorkPosts}
        onSubmit={handleCreateBooking}
      />

      <BookingDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        booking={selectedBooking}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
        onComplete={handleCompleteBooking}
      />
    </div>
  )
}
