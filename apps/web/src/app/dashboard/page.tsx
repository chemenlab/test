'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
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
  Bell,
  ChevronRight,
  Circle,
  UserCheck,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Тип для записи
type Booking = {
  id: string
  time: string
  endTime: string
  client: string
  phone: string
  vehicle: string
  service: string
  status: 'completed' | 'in_progress' | 'pending'
}

// Тип для рабочего поста
type WorkPost = {
  id: string
  name: string
  master: string
  bookings: Booking[]
}

// Mock данные записей на сегодня, сгруппированных по постам
const initialWorkPosts: WorkPost[] = [
  {
    id: '1',
    name: 'Пост 1',
    master: 'Дмитрий М.',
    bookings: [
      {
        id: '1',
        time: '10:00',
        endTime: '11:00',
        client: 'Иван Петров',
        phone: '+79991234567',
        vehicle: 'Toyota Camry',
        service: 'Замена масла',
        status: 'completed',
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
      },
    ],
  },
  {
    id: '2',
    name: 'Пост 2',
    master: 'Алексей С.',
    bookings: [
      {
        id: '4',
        time: '13:00',
        endTime: '14:00',
        client: 'Алексей Смирнов',
        phone: '+79993456789',
        vehicle: 'Mercedes C-Class',
        service: 'Шиномонтаж',
        status: 'in_progress',
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
      },
    ],
  },
  {
    id: '3',
    name: 'Пост 3',
    master: 'Не назначен',
    bookings: [],
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
    time: new Date(Date.now() - 1000 * 60 * 10),
    urgent: true,
  },
  {
    id: '2',
    type: 'warning',
    icon: AlertTriangle,
    message: 'Низкий остаток на складе',
    description: 'Свечи зажигания - осталось 2 шт (мин: 6)',
    time: new Date(Date.now() - 1000 * 60 * 15),
    urgent: true,
  },
  {
    id: '3',
    type: 'info',
    icon: Phone,
    message: 'Запись подтверждена',
    description: 'Иван Петров подтвердил запись на 15:00',
    time: new Date(Date.now() - 1000 * 60 * 25),
    urgent: false,
  },
  {
    id: '4',
    type: 'success',
    icon: DollarSign,
    message: 'Платеж получен',
    description: '25,000₽ от Марии Сидоровой',
    time: new Date(Date.now() - 1000 * 60 * 45),
    urgent: false,
  },
]

// Mock данные активных заказов
const mockActiveOrders = [
  {
    id: 'ORD-2024-048',
    client: 'Алексей Смирнов',
    vehicle: 'Mercedes C-Class',
    status: 'in_progress',
    progress: 65,
  },
  {
    id: 'ORD-2024-049',
    client: 'Елена Волкова',
    vehicle: 'Audi A4',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'ORD-2024-050',
    client: 'Петр Сидоров',
    vehicle: 'Ford Focus',
    status: 'in_progress',
    progress: 30,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [workPosts, setWorkPosts] = React.useState<WorkPost[]>(initialWorkPosts)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900 border-green-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200'
      case 'pending':
        return 'bg-gray-100 text-gray-900 border-gray-200'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено'
      case 'in_progress':
        return 'В работе'
      case 'pending':
        return 'Ожидает'
      default:
        return status
    }
  }

  const getTotalBookings = () => {
    return workPosts.reduce((sum, post) => sum + post.bookings.length, 0)
  }

  const getInProgressCount = () => {
    return workPosts.reduce(
      (sum, post) => sum + post.bookings.filter(b => b.status === 'in_progress').length,
      0
    )
  }

  const getLowStockCount = () => {
    return mockNotifications.filter(n => n.type === 'warning' && n.urgent).length
  }

  const urgentNotifications = mockNotifications.filter(n => n.urgent)

  // Обработчик клика на запись - открывает детали
  const handleBookingClick = (bookingId: string) => {
    router.push(`/dashboard/bookings?id=${bookingId}`)
  }

  // Обработчик быстрого обновления статуса "Клиент пришел"
  const handleClientArrived = (postId: string, bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    setWorkPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              bookings: post.bookings.map(booking =>
                booking.id === bookingId
                  ? { ...booking, status: 'in_progress' as const }
                  : booking
              ),
            }
          : post
      )
    )

    toast.success('Статус обновлен', {
      description: 'Клиент отмечен как прибывший',
    })
  }

  // Обработчик звонка
  const handleCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `tel:${phone}`
  }

  // Обработчик сообщения (WhatsApp)
  const handleMessage = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Убираем + из номера для WhatsApp
    const cleanPhone = phone.replace(/\+/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Заголовок */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Рабочий день</h2>
          <p className="text-muted-foreground">
            {format(new Date(), 'd MMMM yyyy, EEEE', { locale: ru })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/bookings">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Календарь
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
              {workPosts.filter(p => p.bookings.length > 0).length} постов заняты
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
            <p className="text-xs text-muted-foreground">
              План: ₽60,000
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          getLowStockCount() > 0 && "border-orange-200 bg-orange-50"
        )}>
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
        {/* Записи на сегодня - 2 колонки */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Записи по постам</h3>

            <div className="space-y-4">
              {workPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Wrench className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{post.name}</CardTitle>
                          <CardDescription className="text-sm">
                            Мастер: {post.master}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {post.bookings.length} {post.bookings.length === 1 ? 'запись' : 'записей'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {post.bookings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Нет записей на сегодня
                        </p>
                        <Link href="/dashboard/bookings">
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить запись
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {post.bookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={() => handleBookingClick(booking.id)}
                            className={cn(
                              "flex items-start gap-3 rounded-lg border p-3 transition-all cursor-pointer",
                              "hover:shadow-md hover:scale-[1.01]",
                              getStatusColor(booking.status)
                            )}
                          >
                            <div className="flex flex-col items-center pt-1 min-w-[50px]">
                              <div className="text-sm font-semibold">{booking.time}</div>
                              <div className="text-xs text-muted-foreground">{booking.endTime}</div>
                            </div>

                            <Separator orientation="vertical" className="h-14" />

                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium truncate">{booking.client}</p>
                                {getStatusIcon(booking.status)}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{booking.vehicle}</p>
                              <p className="text-sm truncate">{booking.service}</p>
                            </div>

                            <div className="flex flex-col gap-1">
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 text-xs whitespace-nowrap"
                                  onClick={(e) => handleClientArrived(post.id, booking.id, e)}
                                >
                                  <UserCheck className="mr-1 h-3 w-3" />
                                  Пришел
                                </Button>
                              )}
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => handleCall(booking.phone, e)}
                                  title="Позвонить"
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => handleMessage(booking.phone, e)}
                                  title="WhatsApp"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Правая колонка - Уведомления и быстрые действия */}
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

          {/* Уведомления */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Уведомления</CardTitle>
                <Badge variant="secondary">{mockNotifications.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotifications.filter(n => !n.urgent).map((notification) => {
                const Icon = notification.icon
                return (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                )
              })}
              <Button variant="ghost" size="sm" className="w-full">
                Показать все
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

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
    </div>
  )
}
