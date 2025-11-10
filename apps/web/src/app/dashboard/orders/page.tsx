'use client'

import * as React from 'react'
import { Plus, Search, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock orders data
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
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-900'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900'
      case 'completed':
        return 'bg-green-100 text-green-900'
      case 'paid':
        return 'bg-blue-100 text-blue-900'
      case 'canceled':
        return 'bg-red-100 text-red-900'
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

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
          <p className="text-muted-foreground">Заказ-наряды и управление работами</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Создать заказ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру, клиенту, авто..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
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
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Заказы не найдены</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
          ))
        )}
      </div>
    </div>
  )
}
