'use client'

import * as React from 'react'
import Link from 'next/link'
import { format, subDays } from 'date-fns'
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
  TrendingUp,
  TrendingDown,
  Activity,
  Bell,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Mock данные для графика выручки
const mockRevenueData = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i)
  return {
    date: format(date, 'd MMM', { locale: ru }),
    revenue: Math.floor(Math.random() * 50000) + 10000,
  }
})

// Mock данные для последних действий
const mockRecentActivity = [
  {
    id: '1',
    type: 'booking',
    message: 'Новая запись создана',
    client: 'Иван Петров',
    details: 'Toyota Camry - Замена масла',
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'order',
    message: 'Заказ-наряд завершен',
    client: 'Мария Сидорова',
    details: 'ORD-2024-045',
    time: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    type: 'client',
    message: 'Новый клиент зарегистрирован',
    client: 'Алексей Смирнов',
    details: '+7 (999) 345-67-89',
    time: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    type: 'warehouse',
    message: 'Низкий остаток на складе',
    client: 'Масляный фильтр',
    details: 'Осталось 3 шт',
    time: new Date(Date.now() - 1000 * 60 * 60),
  },
]

// Mock данные сегодняшних записей
const mockTodayBookings = [
  {
    id: '1',
    time: '10:00',
    client: 'Иван Петров',
    vehicle: 'Toyota Camry',
    service: 'Замена масла',
    status: 'completed',
    post: 'Пост 1',
  },
  {
    id: '2',
    time: '11:30',
    client: 'Мария Сидорова',
    vehicle: 'BMW X5',
    service: 'Диагностика',
    status: 'completed',
    post: 'Пост 2',
  },
  {
    id: '3',
    time: '13:00',
    client: 'Алексей Смирнов',
    vehicle: 'Mercedes C-Class',
    service: 'Шиномонтаж',
    status: 'in_progress',
    post: 'Пост 3',
  },
  {
    id: '4',
    time: '14:30',
    client: 'Елена Волкова',
    vehicle: 'Audi A4',
    service: 'Тормозные колодки',
    status: 'pending',
    post: 'Пост 1',
  },
  {
    id: '5',
    time: '16:00',
    client: 'Дмитрий Козлов',
    vehicle: 'Volkswagen Polo',
    service: 'ТО',
    status: 'pending',
    post: 'Пост 2',
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
    master: 'Дмитрий М.',
  },
  {
    id: 'ORD-2024-049',
    client: 'Елена Волкова',
    vehicle: 'Audi A4',
    status: 'pending',
    progress: 0,
    master: 'Не назначен',
  },
  {
    id: 'ORD-2024-050',
    client: 'Петр Сидоров',
    vehicle: 'Ford Focus',
    status: 'in_progress',
    progress: 30,
    master: 'Алексей С.',
  },
]

// Mock данные популярных услуг
const mockPopularServices = [
  { name: 'Замена масла', count: 45, revenue: 135000 },
  { name: 'Диагностика', count: 32, revenue: 96000 },
  { name: 'Шиномонтаж', count: 28, revenue: 56000 },
  { name: 'Тормозные колодки', count: 24, revenue: 144000 },
]

// Mock данные уведомлений
const mockNotifications = [
  {
    id: '1',
    type: 'warning',
    message: 'Низкий остаток масляных фильтров',
    time: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
  },
  {
    id: '2',
    type: 'info',
    message: 'Запись на 15:00 подтверждена клиентом',
    time: new Date(Date.now() - 1000 * 60 * 25),
    read: false,
  },
  {
    id: '3',
    type: 'success',
    message: 'Платеж на 25,000₽ получен',
    time: new Date(Date.now() - 1000 * 60 * 45),
    read: true,
  },
]

// Mock данные низких остатков
const mockLowStockItems = [
  { name: 'Масляный фильтр', quantity: 3, minQuantity: 10 },
  { name: 'Свечи зажигания', quantity: 2, minQuantity: 6 },
]

export default function DashboardPage() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar
      case 'order':
        return FileText
      case 'client':
        return Users
      case 'warehouse':
        return Package
      default:
        return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900'
      case 'pending':
        return 'bg-gray-100 text-gray-900'
      default:
        return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено'
      case 'in_progress':
        return 'В работе'
      case 'pending':
        return 'Ожидание'
      default:
        return status
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)

    if (minutes < 1) return 'только что'
    if (minutes < 60) return `${minutes} мин назад`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ч назад`
    return format(date, 'd MMM, HH:mm', { locale: ru })
  }

  const unreadNotifications = mockNotifications.filter(n => !n.read).length

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего клиентов
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1">от прошлого месяца</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Записи сегодня
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              5 завершено, 3 в работе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выручка за месяц
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽342,500</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+8%</span>
              <span className="ml-1">от прошлого месяца</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные заказы
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              в работе
            </p>
          </CardContent>
        </Card>
      </div>

      {/* График выручки и Последние записи */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Обзор выручки</CardTitle>
            <CardDescription>
              Динамика выручки за последний месяц
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₽${value / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Выручка
                              </span>
                              <span className="font-bold">
                                ₽{payload[0].value?.toLocaleString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "hsl(var(--primary))" },
                  }}
                  style={{
                    stroke: "hsl(var(--primary))",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>
              {mockActiveOrders.length} активных заказов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {mockActiveOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{order.client.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{order.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.vehicle}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm">
                    {order.progress}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Сегодняшние записи и Популярные услуги */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Сегодняшние записи</CardTitle>
          <CardDescription>
            {mockTodayBookings.length} записей на {format(new Date(), 'd MMMM', { locale: ru })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockTodayBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted">
                  <div className="text-center">
                    <div className="text-sm font-bold">{booking.time}</div>
                  </div>
                </div>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{booking.client}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.service}
                  </p>
                </div>
                <div className="ml-auto">
                  {booking.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {booking.status === 'in_progress' && (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  {booking.status === 'pending' && (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Популярные услуги */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Популярные услуги</CardTitle>
          <CardDescription>
            Топ услуг за текущий месяц
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockPopularServices.map((service, index) => (
              <div key={index} className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.count} заказов
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  ₽{(service.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
