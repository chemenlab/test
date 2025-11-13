'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, addMinutes, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Users,
  Calendar,
  DollarSign,
  Wrench,
  Plus,
  FileText,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Phone,
  MessageSquare,
  UserPlus,
  Warehouse,
  ChevronRight,
  Circle,
  UserCheck,
  Car,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Тип для записи с временем
type TimelineBooking = {
  id: string
  time: string
  endTime: string
  client: string
  phone: string
  vehicle: string
  service: string
  status: 'completed' | 'in_progress' | 'pending'
  startDate: Date
  endDate: Date
  postId: string
  masterName: string
}

// Тип для рабочего поста
type WorkPost = {
  id: string
  name: string
  master: string
}

const today = new Date()

// Mock данные рабочих постов
const mockWorkPosts: WorkPost[] = [
  { id: '1', name: 'Пост 1', master: 'Дмитрий М.' },
  { id: '2', name: 'Пост 2', master: 'Алексей С.' },
  { id: '3', name: 'Пост 3', master: 'Не назначен' },
]

// Mock данные записей с временем
const initialBookings: TimelineBooking[] = [
  {
    id: '1',
    time: '10:00',
    endTime: '11:00',
    client: 'Иван Петров',
    phone: '+79991234567',
    vehicle: 'Toyota Camry',
    service: 'Замена масла',
    status: 'completed',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    postId: '1',
    masterName: 'Дмитрий М.',
  },
  {
    id: '2',
    time: '11:30',
    endTime: '12:30',
    client: 'Мария Сидорова',
    phone: '+79992345678',
    vehicle: 'BMW X5',
    service: 'Диагностика',
    status: 'in_progress',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
    postId: '1',
    masterName: 'Дмитрий М.',
  },
  {
    id: '3',
    time: '14:30',
    endTime: '16:00',
    client: 'Елена Волкова',
    phone: '+79994567890',
    vehicle: 'Audi A4',
    service: 'Тормозные колодки',
    status: 'pending',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
    postId: '1',
    masterName: 'Дмитрий М.',
  },
  {
    id: '4',
    time: '13:00',
    endTime: '14:00',
    client: 'Алексей Смирнов',
    phone: '+79993456789',
    vehicle: 'Mercedes C-Class',
    service: 'Шиномонтаж',
    status: 'in_progress',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
    postId: '2',
    masterName: 'Алексей С.',
  },
  {
    id: '5',
    time: '16:00',
    endTime: '17:30',
    client: 'Дмитрий Козлов',
    phone: '+79995678901',
    vehicle: 'Volkswagen Polo',
    service: 'ТО',
    status: 'pending',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
    postId: '2',
    masterName: 'Алексей С.',
  },
]

// Mock данные уведомлений
const mockNotifications = [
  {
    id: '1',
    type: 'warning',
    icon: AlertTriangle,
    message: 'Низкий остаток на складе',
    description: 'Масляный фильтр - осталось 3 шт (мин: 10)',
    urgent: true,
  },
  {
    id: '2',
    type: 'warning',
    icon: AlertTriangle,
    message: 'Низкий остаток на складе',
    description: 'Свечи зажигания - осталось 2 шт (мин: 6)',
    urgent: true,
  },
  {
    id: '3',
    type: 'info',
    icon: Phone,
    message: 'Запись подтверждена',
    description: 'Иван Петров подтвердил запись на 15:00',
    urgent: false,
  },
  {
    id: '4',
    type: 'success',
    icon: DollarSign,
    message: 'Платеж получен',
    description: '25,000₽ от Марии Сидоровой',
    urgent: false,
  },
]

// Mock данные активных заказов
const mockActiveOrders = [
  { id: 'ORD-2024-048', client: 'Алексей Смирнов', vehicle: 'Mercedes C-Class', status: 'in_progress', progress: 65 },
  { id: 'ORD-2024-049', client: 'Елена Волкова', vehicle: 'Audi A4', status: 'pending', progress: 0 },
  { id: 'ORD-2024-050', client: 'Петр Сидоров', vehicle: 'Ford Focus', status: 'in_progress', progress: 30 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = React.useState<TimelineBooking[]>(initialBookings)
  const [selectedBooking, setSelectedBooking] = React.useState<TimelineBooking | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [draggedBooking, setDraggedBooking] = React.useState<TimelineBooking | null>(null)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  // Автообновление текущего времени каждую минуту
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Временные слоты с 9:00 до 18:00 с шагом 30 минут
  const timeSlots = React.useMemo(() => {
    const slots: Date[] = []
    const startHour = 9
    const endHour = 18

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0))
      slots.push(new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 30))
    }
    return slots
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900 border-green-300'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300'
      case 'pending':
        return 'bg-blue-100 text-blue-900 border-blue-300'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'in_progress':
        return <Clock className="h-3 w-3 text-yellow-600" />
      case 'pending':
        return <Circle className="h-3 w-3 text-blue-600" />
      default:
        return null
    }
  }

  const getTotalBookings = () => bookings.length
  const getInProgressCount = () => bookings.filter(b => b.status === 'in_progress').length
  const getLowStockCount = () => mockNotifications.filter(n => n.type === 'warning' && n.urgent).length
  const urgentNotifications = mockNotifications.filter(n => n.urgent)

  // Позиция записи на timeline
  const getBookingPosition = (booking: TimelineBooking, postId: string) => {
    if (booking.postId !== postId) return null

    const slotHeight = 40 // pixels
    const startMinutes = booking.startDate.getHours() * 60 + booking.startDate.getMinutes()
    const endMinutes = booking.endDate.getHours() * 60 + booking.endDate.getMinutes()
    const dayStartMinutes = 9 * 60 // 9:00 AM

    const top = ((startMinutes - dayStartMinutes) / 30) * slotHeight
    const duration = endMinutes - startMinutes
    const height = (duration / 30) * slotHeight

    return { top, height }
  }

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, booking: TimelineBooking) => {
    setDraggedBooking(booking)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, postId: string, timeSlot: Date) => {
    e.preventDefault()
    if (!draggedBooking) return

    const duration = draggedBooking.endDate.getTime() - draggedBooking.startDate.getTime()
    const newStartTime = timeSlot
    const newEndTime = new Date(timeSlot.getTime() + duration)

    // Проверка конфликтов
    const hasConflict = bookings.some(booking => {
      if (booking.id === draggedBooking.id) return false
      if (booking.postId !== postId) return false

      return (
        (newStartTime >= booking.startDate && newStartTime < booking.endDate) ||
        (newEndTime > booking.startDate && newEndTime <= booking.endDate) ||
        (newStartTime <= booking.startDate && newEndTime >= booking.endDate)
      )
    })

    if (hasConflict) {
      toast.error('Конфликт времени', {
        description: 'В это время уже есть другая запись',
      })
      setDraggedBooking(null)
      return
    }

    // Обновление записи
    setBookings(prev =>
      prev.map(booking => {
        if (booking.id === draggedBooking.id) {
          const post = mockWorkPosts.find(p => p.id === postId)
          return {
            ...booking,
            startDate: newStartTime,
            endDate: newEndTime,
            time: format(newStartTime, 'HH:mm'),
            endTime: format(newEndTime, 'HH:mm'),
            postId: postId,
            masterName: post?.master || 'Не назначен',
          }
        }
        return booking
      })
    )

    toast.success('Запись перемещена', {
      description: `Новое время: ${format(newStartTime, 'HH:mm')} - ${format(newEndTime, 'HH:mm')}`,
    })

    setDraggedBooking(null)
  }

  // Click handlers
  const handleBookingClick = (booking: TimelineBooking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCall = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    window.location.href = `tel:${phone}`
  }

  const handleMessage = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const cleanPhone = phone.replace(/\+/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
  }

  const handleStatusChange = (newStatus: 'completed' | 'in_progress' | 'pending') => {
    if (!selectedBooking) return

    setBookings(prev =>
      prev.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, status: newStatus } : booking
      )
    )

    setSelectedBooking({ ...selectedBooking, status: newStatus })
    toast.success('Статус обновлен')
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Заголовок */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Рабочий день</h2>
          <p className="text-muted-foreground">
            {format(currentTime, 'd MMMM yyyy, EEEE', { locale: ru })}
            <span className="ml-2 text-sm">• {format(currentTime, 'HH:mm')}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/calendar">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Полный календарь
            </Button>
          </Link>
          <Link href="/dashboard/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Новый заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* Компактная статистика */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Записи сегодня</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalBookings()}</div>
            <p className="text-xs text-muted-foreground">
              {mockWorkPosts.filter(p => bookings.some(b => b.postId === p.id)).length} постов заняты
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getInProgressCount()}</div>
            <p className="text-xs text-muted-foreground">
              {mockActiveOrders.length} активных заказов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка сегодня</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽45,000</div>
            <p className="text-xs text-muted-foreground">План: ₽60,000</p>
          </CardContent>
        </Card>

        <Card className={cn(getLowStockCount() > 0 && "border-orange-200 bg-orange-50")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Склад</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getLowStockCount() > 0 ? (
                <span className="text-orange-600">{getLowStockCount()}</span>
              ) : (
                <span className="text-green-600">OK</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getLowStockCount() > 0 ? 'позиций требуют пополнения' : 'все в порядке'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Основной контент */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline календарь - 2 колонки */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Расписание на сегодня</CardTitle>
                  <CardDescription>
                    Перетаскивайте записи для изменения времени и поста
                  </CardDescription>
                </div>
                <Badge variant="outline">{getTotalBookings()} записей</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Header */}
                  <div className="grid gap-0 border-b" style={{ gridTemplateColumns: '60px repeat(3, 1fr)' }}>
                    <div className="border-r p-2 text-xs font-medium text-muted-foreground">
                      Время
                    </div>
                    {mockWorkPosts.map((post) => (
                      <div key={post.id} className="border-r p-2 text-xs font-medium text-center">
                        <div>{post.name}</div>
                        <div className="text-[10px] text-muted-foreground">{post.master}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="relative">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="grid gap-0 border-b"
                        style={{ gridTemplateColumns: '60px repeat(3, 1fr)' }}
                      >
                        <div className="border-r p-1 text-xs text-muted-foreground">
                          {format(slot, 'HH:mm')}
                        </div>
                        {mockWorkPosts.map((post) => (
                          <div
                            key={post.id}
                            className="border-r h-[40px] hover:bg-muted/30 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, post.id, slot)}
                          />
                        ))}
                      </div>
                    ))}

                    {/* Bookings Overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{ top: 0, left: 60 }}>
                      <div className="grid gap-0 h-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {mockWorkPosts.map((post) => (
                          <div key={post.id} className="relative pointer-events-none">
                            {bookings.map((booking) => {
                              const position = getBookingPosition(booking, post.id)
                              if (!position) return null

                              return (
                                <div
                                  key={booking.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, booking)}
                                  onClick={() => handleBookingClick(booking)}
                                  className={cn(
                                    "absolute left-1 right-1 rounded border-2 p-1 cursor-move pointer-events-auto overflow-hidden",
                                    "hover:shadow-md transition-all",
                                    getStatusColor(booking.status),
                                    draggedBooking?.id === booking.id && 'opacity-50'
                                  )}
                                  style={{
                                    top: `${position.top}px`,
                                    height: `${position.height}px`,
                                  }}
                                >
                                  <div className="text-[10px] font-semibold truncate flex items-center gap-1">
                                    {getStatusIcon(booking.status)}
                                    {booking.client}
                                  </div>
                                  <div className="text-[9px] text-muted-foreground truncate">
                                    {booking.service}
                                  </div>
                                  <div className="text-[9px] text-muted-foreground">
                                    {booking.time} - {booking.endTime}
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
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
                  <span>Ожидает</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
                  <span>В работе</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                  <span>Завершено</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/bookings" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Новая запись
                </Button>
              </Link>
              <Link href="/dashboard/orders/new" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Создать заказ
                </Button>
              </Link>
              <Link href="/dashboard/clients" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Новый клиент
                </Button>
              </Link>
              <Link href="/dashboard/warehouse" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Warehouse className="mr-2 h-4 w-4" />
                  Управление складом
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Критичные уведомления */}
          {urgentNotifications.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <CardTitle className="text-base text-orange-900">
                    Требует внимания
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {urgentNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 rounded-lg bg-white border border-orange-200 p-3"
                    >
                      <Icon className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-orange-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-orange-700">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Активные заказы */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Активные заказы</CardTitle>
              <CardDescription>
                {mockActiveOrders.length} в работе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActiveOrders.map((order) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                  <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {order.client.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.vehicle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{order.progress}%</div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm" className="w-full">
                  Все заказы
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Модальное окно с деталями записи */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Детали записи</DialogTitle>
            <DialogDescription>
              {selectedBooking && `${selectedBooking.time} - ${selectedBooking.endTime} • ${selectedBooking.masterName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Статус</span>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(value) => handleStatusChange(value as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Клиент</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Телефон</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(selectedBooking.phone)}
                    >
                      Позвонить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessage(selectedBooking.phone)}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Автомобиль</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.vehicle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Услуга</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.service}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Время</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.time} - {selectedBooking.endTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Закрыть
            </Button>
            <Link href={`/dashboard/bookings?id=${selectedBooking?.id}`}>
              <Button>Редактировать</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
