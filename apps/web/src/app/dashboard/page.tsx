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
  Activity,
  Bell,
  ArrowRight,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Обзор работы автосервиса за сегодня
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications}
              </span>
            )}
          </Button>
          <Link href="/dashboard/bookings">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Новая запись
            </Button>
          </Link>
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
        <StatsCard
          title="Всего клиентов"
          value="1,234"
          description="от прошлого месяца"
          icon={Users}
          trend={{ value: '12%', positive: true }}
        />
        <StatsCard
          title="Записи сегодня"
          value="8"
          description="5 завершено, 3 в работе"
          icon={Calendar}
        />
        <StatsCard
          title="Выручка за месяц"
          value="₽342,500"
          description="от прошлого месяца"
          icon={DollarSign}
          trend={{ value: '8%', positive: true }}
        />
        <StatsCard
          title="Активные заказы"
          value="12"
          description="в работе"
          icon={Wrench}
        />
      </div>

      {/* Алерты низких остатков */}
      {mockLowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="h-5 w-5" />
              Внимание: низкий остаток на складе
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Следующие запчасти заканчиваются
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockLowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-yellow-900">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-yellow-600 text-yellow-900">
                      {item.quantity} шт
                    </Badge>
                    <span className="text-yellow-700">
                      мин: {item.minQuantity} шт
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3 bg-yellow-200" />
            <Link href="/dashboard/warehouse">
              <Button variant="outline" size="sm" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Перейти на склад
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* График выручки */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Выручка за 30 дней</CardTitle>
              <CardDescription>
                Динамика выручки за последний месяц
              </CardDescription>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="outline" size="sm">
                Подробнее
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Выручка
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value?.toLocaleString('ru-RU')}₽
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
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Сегодняшние записи */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Сегодняшние записи</CardTitle>
                <CardDescription>
                  Расписание на {format(new Date(), 'd MMMM yyyy', { locale: ru })}
                </CardDescription>
              </div>
              <Link href="/dashboard/bookings">
                <Button variant="outline" size="sm">
                  Все записи
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTodayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                      <div className="text-center">
                        <div className="text-lg font-bold">{booking.time.split(':')[0]}</div>
                        <div className="text-xs text-muted-foreground">{booking.time.split(':')[1]}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.client}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.vehicle} • {booking.service}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {booking.post}
                        </Badge>
                        <Badge className={getStatusColor(booking.status) + ' text-xs'}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {booking.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {booking.status === 'in_progress' && (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Топ мастеров */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Топ мастеров
            </CardTitle>
            <CardDescription>За текущий месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Алексей С.', orders: 24, revenue: '₽125,000' },
                { name: 'Дмитрий М.', orders: 18, revenue: '₽98,000' },
                { name: 'Сергей К.', orders: 15, revenue: '₽87,500' },
              ].map((master, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{master.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {master.orders} заказов
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{master.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Активные заказы и Популярные услуги */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Активные заказы</CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm">
                  Все заказы
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActiveOrders.map((order) => (
                <div key={order.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.client} • {order.vehicle}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.progress}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Мастер: {order.master}
                  </div>
                  {order !== mockActiveOrders[mockActiveOrders.length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные услуги</CardTitle>
            <CardDescription>Топ услуг за месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPopularServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.count} заказов
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{service.revenue.toLocaleString('ru-RU')}₽</div>
                    <div className="text-xs text-muted-foreground">выручка</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Последние действия */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Последние действия
          </CardTitle>
          <CardDescription>
            Активность в системе за последние несколько часов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(activity.time)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.client}</p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
