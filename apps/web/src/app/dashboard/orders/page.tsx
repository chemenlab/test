'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Search, FileText, Calendar, ArrowUpDown, X, Download } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subDays, startOfDay, endOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { downloadCSV, formatDateTimeForExport } from '@/lib/export'
import { toast } from 'sonner'

// Mock orders data - расширенный набор
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    client: { id: '1', name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
    vehicle: { brand: 'Toyota', model: 'Camry', plateNumber: 'А123БВ' },
    status: 'in_progress',
    total: 12500,
    createdAt: new Date(),
    completedAt: null,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    client: { id: '2', name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
    vehicle: { brand: 'BMW', model: 'X5', plateNumber: 'К456МН' },
    status: 'completed',
    total: 8500,
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    client: { id: '1', name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
    vehicle: { brand: 'Toyota', model: 'Camry', plateNumber: 'А123БВ' },
    status: 'draft',
    total: 3500,
    createdAt: new Date(Date.now() - 172800000),
    completedAt: null,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    client: { id: '3', name: 'Дмитрий Иванов', phone: '+7 (999) 345-67-89' },
    vehicle: { brand: 'Kia', model: 'Rio', plateNumber: 'С789ЕЖ' },
    status: 'paid',
    total: 15700,
    createdAt: new Date(Date.now() - 259200000),
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    client: { id: '4', name: 'Алексей Смирнов', phone: '+7 (999) 456-78-90' },
    vehicle: { brand: 'Volkswagen', model: 'Polo', plateNumber: 'В456ГД' },
    status: 'in_progress',
    total: 22300,
    createdAt: new Date(Date.now() - 345600000),
    completedAt: null,
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    client: { id: '5', name: 'Елена Васильева', phone: '+7 (999) 567-89-01' },
    vehicle: { brand: 'Mazda', model: 'CX-5', plateNumber: 'Т234УФ' },
    status: 'completed',
    total: 7800,
    createdAt: new Date(Date.now() - 432000000),
    completedAt: new Date(Date.now() - 259200000),
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    client: { id: '6', name: 'Сергей Николаев', phone: '+7 (999) 678-90-12' },
    vehicle: { brand: 'Hyundai', model: 'Solaris', plateNumber: 'Х567ЦЧ' },
    status: 'canceled',
    total: 5400,
    createdAt: new Date(Date.now() - 518400000),
    completedAt: null,
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    client: { id: '2', name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
    vehicle: { brand: 'BMW', model: 'X5', plateNumber: 'К456МН' },
    status: 'paid',
    total: 18900,
    createdAt: new Date(Date.now() - 604800000),
    completedAt: new Date(Date.now() - 432000000),
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('date-desc')
  const [dateFrom, setDateFrom] = React.useState<string>('')
  const [dateTo, setDateTo] = React.useState<string>('')
  const [datePreset, setDatePreset] = React.useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
      case 'completed':
        return 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
      case 'paid':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
      case 'canceled':
        return 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
      default:
        return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Черновик'
      case 'in_progress':
        return 'В работе'
      case 'completed':
        return 'Завершен'
      case 'paid':
        return 'Оплачен'
      case 'canceled':
        return 'Отменен'
      default:
        return status
    }
  }

  // Применение date preset
  const handleDatePreset = (preset: string) => {
    setDatePreset(preset)
    const today = new Date()

    switch (preset) {
      case 'today':
        setDateFrom(format(startOfDay(today), 'yyyy-MM-dd'))
        setDateTo(format(endOfDay(today), 'yyyy-MM-dd'))
        break
      case 'week':
        setDateFrom(format(subDays(today, 7), 'yyyy-MM-dd'))
        setDateTo(format(today, 'yyyy-MM-dd'))
        break
      case 'month':
        setDateFrom(format(startOfMonth(today), 'yyyy-MM-dd'))
        setDateTo(format(endOfMonth(today), 'yyyy-MM-dd'))
        break
      case 'all':
        setDateFrom('')
        setDateTo('')
        break
    }
  }

  // Фильтрация и сортировка
  const filteredOrders = React.useMemo(() => {
    let filtered = mockOrders.filter((order) => {
      // Поиск
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())

      // Статус
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter

      // Даты
      const matchesDateFrom = !dateFrom || order.createdAt >= new Date(dateFrom)
      const matchesDateTo = !dateTo || order.createdAt <= new Date(dateTo)

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'date-asc':
          return a.createdAt.getTime() - b.createdAt.getTime()
        case 'total-desc':
          return b.total - a.total
        case 'total-asc':
          return a.total - b.total
        case 'number-desc':
          return b.orderNumber.localeCompare(a.orderNumber)
        case 'number-asc':
          return a.orderNumber.localeCompare(b.orderNumber)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, statusFilter, sortBy, dateFrom, dateTo])

  // Статистика
  const stats = React.useMemo(() => {
    return {
      total: filteredOrders.length,
      draft: filteredOrders.filter(o => o.status === 'draft').length,
      inProgress: filteredOrders.filter(o => o.status === 'in_progress').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      paid: filteredOrders.filter(o => o.status === 'paid').length,
      canceled: filteredOrders.filter(o => o.status === 'canceled').length,
      totalAmount: filteredOrders.reduce((sum, o) => sum + o.total, 0),
    }
  }, [filteredOrders])

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortBy('date-desc')
    setDateFrom('')
    setDateTo('')
    setDatePreset('all')
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo

  // Экспорт данных
  const handleExport = () => {
    const exportData = filteredOrders.map((order) => ({
      '№ Заказа': order.orderNumber,
      'Дата создания': formatDateTimeForExport(order.createdAt),
      'Клиент': order.client.name,
      'Телефон': order.client.phone,
      'Автомобиль': `${order.vehicle.brand} ${order.vehicle.model}`,
      'Гос. номер': order.vehicle.plateNumber,
      'Статус': getStatusLabel(order.status),
      'Сумма': order.total,
      'Дата завершения': order.completedAt ? formatDateTimeForExport(order.completedAt) : '',
    }))

    const filename = `orders_${format(new Date(), 'yyyy-MM-dd_HH-mm')}`
    downloadCSV(exportData, filename)
    toast.success('Данные экспортированы', {
      description: `Файл ${filename}.csv загружен`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
          <p className="text-muted-foreground">Заказ-наряды и управление работами</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Link href="/dashboard/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего заказов</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              На сумму: ₽{stats.totalAmount.toLocaleString('ru-RU')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>В работе</CardDescription>
            <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100">
              Активные
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Завершено</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100">
              Готово
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Оплачено</CardDescription>
            <CardTitle className="text-3xl">{stats.paid}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
              Оплачено
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Фильтры и поиск</CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Сбросить фильтры
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру, клиенту, авто..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
                <SelectItem value="paid">Оплачен</SelectItem>
                <SelectItem value="canceled">Отменен</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Сначала новые</SelectItem>
                <SelectItem value="date-asc">Сначала старые</SelectItem>
                <SelectItem value="total-desc">Сумма: по убыванию</SelectItem>
                <SelectItem value="total-asc">Сумма: по возрастанию</SelectItem>
                <SelectItem value="number-desc">Номер: Я-А</SelectItem>
                <SelectItem value="number-asc">Номер: А-Я</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Период</Label>
            <div className="flex flex-wrap gap-4">
              <Select value={datePreset} onValueChange={handleDatePreset}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все время</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Последние 7 дней</SelectItem>
                  <SelectItem value="month">Текущий месяц</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <Label htmlFor="dateFrom" className="text-xs">От</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value)
                      setDatePreset('custom')
                    }}
                    className="w-[150px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateTo" className="text-xs">До</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value)
                      setDatePreset('custom')
                    }}
                    className="w-[150px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Заказы не найдены</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        {format(order.createdAt, 'd MMMM yyyy, HH:mm', { locale: ru })}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Клиент</p>
                      <p className="font-medium">{order.client.name}</p>
                      <p className="text-sm text-muted-foreground">{order.client.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Автомобиль</p>
                      <p className="font-medium">
                        {order.vehicle.brand} {order.vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {order.vehicle.plateNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Сумма</p>
                      <p className="text-2xl font-bold">
                        ₽{order.total.toLocaleString('ru-RU')}
                      </p>
                      {order.completedAt && (
                        <p className="text-sm text-muted-foreground">
                          Завершен {format(order.completedAt, 'd MMM', { locale: ru })}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
