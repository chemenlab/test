'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  User,
  Wrench,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

type OrderStatus = 'draft' | 'in_progress' | 'completed'
type WorkStatus = 'pending' | 'in_progress' | 'completed'

interface MechanicOrder {
  id: string
  orderNumber: string
  client: { id: string; name: string; phone: string }
  vehicle: { brand: string; model: string; plateNumber: string }
  status: OrderStatus
  mechanicId: string
  workPost: { id: string; name: string }
  works: Array<{ id: string; name: string; status: WorkStatus; duration: number }>
  total: number
  createdAt: Date
  startedAt: Date | null
  completedAt: Date | null
}

// Mock data for mechanic
const currentMechanic = {
  id: 'mech-1',
  name: 'Дмитрий Мастеров',
  role: 'mechanic' as const,
}

// Mock orders assigned to current mechanic
const mockMechanicOrders: MechanicOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    client: { id: '1', name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
    vehicle: { brand: 'Toyota', model: 'Camry', plateNumber: 'А123БВ' },
    status: 'draft',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '1', name: 'Замена масла', status: 'pending', duration: 30 },
      { id: '2', name: 'Замена фильтра', status: 'pending', duration: 15 },
    ],
    total: 3500,
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-005',
    client: { id: '2', name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
    vehicle: { brand: 'BMW', model: 'X5', plateNumber: 'К456МН' },
    status: 'in_progress',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '3', name: 'Диагностика подвески', status: 'completed', duration: 45 },
      { id: '4', name: 'Замена стоек', status: 'in_progress', duration: 120 },
      { id: '5', name: 'Регулировка развал-схождения', status: 'pending', duration: 30 },
    ],
    total: 22300,
    createdAt: new Date(Date.now() - 86400000),
    startedAt: new Date(Date.now() - 7200000),
    completedAt: null,
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-008',
    client: { id: '3', name: 'Алексей Смирнов', phone: '+7 (999) 345-67-89' },
    vehicle: { brand: 'Volkswagen', model: 'Polo', plateNumber: 'В456ГД' },
    status: 'in_progress',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '6', name: 'Замена тормозных колодок', status: 'completed', duration: 60 },
      { id: '7', name: 'Проточка дисков', status: 'in_progress', duration: 90 },
    ],
    total: 8500,
    createdAt: new Date(Date.now() - 172800000),
    startedAt: new Date(Date.now() - 3600000),
    completedAt: null,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-010',
    client: { id: '4', name: 'Елена Волкова', phone: '+7 (999) 456-78-90' },
    vehicle: { brand: 'Mazda', model: 'CX-5', plateNumber: 'Т234УФ' },
    status: 'completed',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '8', name: 'ТО-2', status: 'completed', duration: 120 },
      { id: '9', name: 'Замена свечей', status: 'completed', duration: 30 },
    ],
    total: 7800,
    createdAt: new Date(Date.now() - 259200000),
    startedAt: new Date(Date.now() - 172800000),
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-012',
    client: { id: '5', name: 'Дмитрий Козлов', phone: '+7 (999) 567-89-01' },
    vehicle: { brand: 'Hyundai', model: 'Solaris', plateNumber: 'Х567ЦЧ' },
    status: 'completed',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '10', name: 'Замена ремня ГРМ', status: 'completed', duration: 180 },
      { id: '11', name: 'Замена помпы', status: 'completed', duration: 60 },
    ],
    total: 15700,
    createdAt: new Date(Date.now() - 432000000),
    startedAt: new Date(Date.now() - 345600000),
    completedAt: new Date(Date.now() - 259200000),
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-015',
    client: { id: '6', name: 'Сергей Николаев', phone: '+7 (999) 678-90-12' },
    vehicle: { brand: 'Kia', model: 'Rio', plateNumber: 'С789ЕЖ' },
    status: 'draft',
    mechanicId: 'mech-1',
    workPost: { id: 'post-1', name: 'Пост 1' },
    works: [
      { id: '12', name: 'Замена масла', status: 'pending', duration: 30 },
      { id: '13', name: 'Замена воздушного фильтра', status: 'pending', duration: 15 },
    ],
    total: 2800,
    createdAt: new Date(Date.now() - 43200000),
    startedAt: null,
    completedAt: null,
  },
]

export default function MechanicDashboard() {
  const [orders, setOrders] = React.useState(mockMechanicOrders)
  const [draggedOrderId, setDraggedOrderId] = React.useState<string | null>(null)

  // Group orders by status
  const ordersByStatus = React.useMemo(() => {
    return {
      draft: orders.filter(o => o.status === 'draft'),
      in_progress: orders.filter(o => o.status === 'in_progress'),
      completed: orders.filter(o => o.status === 'completed'),
    }
  }, [orders])

  // Get active order (first in_progress order)
  const activeOrder = ordersByStatus.in_progress[0]

  // Statistics
  const stats = React.useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const completedThisMonth = orders.filter(
      o => o.status === 'completed' &&
      o.completedAt &&
      o.completedAt >= startOfMonth
    )

    return {
      totalInProgress: ordersByStatus.in_progress.length,
      completedThisMonth: completedThisMonth.length,
      avgCheck: completedThisMonth.length > 0
        ? Math.round(completedThisMonth.reduce((sum, o) => sum + o.total, 0) / completedThisMonth.length)
        : 0,
      pendingOrders: ordersByStatus.draft.length,
    }
  }, [orders, ordersByStatus])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, orderId: string) => {
    setDraggedOrderId(orderId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: OrderStatus) => {
    e.preventDefault()

    if (!draggedOrderId) return

    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === draggedOrderId) {
          // Update order status
          const updatedOrder = { ...order, status: targetStatus }

          // Update timestamps
          if (targetStatus === 'in_progress' && !order.startedAt) {
            updatedOrder.startedAt = new Date()
          }
          if (targetStatus === 'completed' && !order.completedAt) {
            updatedOrder.completedAt = new Date()
            // Mark all works as completed
            updatedOrder.works = order.works.map(w => ({ ...w, status: 'completed' as const }))
          }

          return updatedOrder
        }
        return order
      })
    )

    setDraggedOrderId(null)
  }

  const handleWorkToggle = (orderId: string, workId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            works: order.works.map(work => {
              if (work.id === workId) {
                return {
                  ...work,
                  status: work.status === 'completed' ? 'in_progress' : 'completed',
                }
              }
              return work
            }),
          }
        }
        return order
      })
    )
  }

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      draft: { variant: 'secondary' as const, label: 'Новый' },
      in_progress: { variant: 'default' as const, label: 'В работе' },
      completed: { variant: 'outline' as const, label: 'Завершён' },
    }
    return variants[status]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Рабочее место мастера</h1>
        <p className="text-muted-foreground">
          Добро пожаловать, {currentMechanic.name}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInProgress}</div>
            <p className="text-xs text-muted-foreground">
              активных заказов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              новых заказов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено в месяц</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              заказов завершено
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgCheck.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs text-muted-foreground">
              за этот месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Order Card */}
      {activeOrder && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Текущий заказ: {activeOrder.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Клиент:</span>
                  <span>{activeOrder.client.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Автомобиль:</span>
                  <span>{activeOrder.vehicle.brand} {activeOrder.vehicle.model}</span>
                  <Badge variant="outline">{activeOrder.vehicle.plateNumber}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Начат:</span>
                  <span>
                    {activeOrder.startedAt
                      ? format(activeOrder.startedAt, 'dd MMM yyyy, HH:mm', { locale: ru })
                      : '—'
                    }
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Сумма:</span>{' '}
                  <span className="text-lg font-bold">{activeOrder.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Чек-лист работ:</h4>
              <div className="space-y-2 rounded-lg border p-3">
                {activeOrder.works.map((work) => (
                  <div key={work.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`work-${work.id}`}
                      checked={work.status === 'completed'}
                      onCheckedChange={() => handleWorkToggle(activeOrder.id, work.id)}
                    />
                    <label
                      htmlFor={`work-${work.id}`}
                      className={`flex-1 text-sm cursor-pointer ${
                        work.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {work.name}
                    </label>
                    <span className="text-xs text-muted-foreground">{work.duration} мин</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Выполнено: {activeOrder.works.filter(w => w.status === 'completed').length} из {activeOrder.works.length}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Column: Новые */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Новые</h3>
            <Badge variant="secondary">{ordersByStatus.draft.length}</Badge>
          </div>
          <div
            className="min-h-[400px] space-y-3 rounded-lg border-2 border-dashed bg-muted/20 p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'draft')}
          >
            {ordersByStatus.draft.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDragStart={handleDragStart}
                isDragging={draggedOrderId === order.id}
              />
            ))}
            {ordersByStatus.draft.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Нет новых заказов
              </div>
            )}
          </div>
        </div>

        {/* Column: В работе */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">В работе</h3>
            <Badge>{ordersByStatus.in_progress.length}</Badge>
          </div>
          <div
            className="min-h-[400px] space-y-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            {ordersByStatus.in_progress.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDragStart={handleDragStart}
                isDragging={draggedOrderId === order.id}
              />
            ))}
            {ordersByStatus.in_progress.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Нет заказов в работе
              </div>
            )}
          </div>
        </div>

        {/* Column: Завершенные */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Завершенные</h3>
            <Badge variant="outline">{ordersByStatus.completed.length}</Badge>
          </div>
          <div
            className="min-h-[400px] space-y-3 rounded-lg border-2 border-dashed bg-muted/20 p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            {ordersByStatus.completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDragStart={handleDragStart}
                isDragging={draggedOrderId === order.id}
              />
            ))}
            {ordersByStatus.completed.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Нет завершенных заказов
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Card Component for Kanban
interface OrderCardProps {
  order: MechanicOrder
  onDragStart: (e: React.DragEvent<HTMLDivElement>, orderId: string) => void
  isDragging: boolean
}

function OrderCard({ order, onDragStart, isDragging }: OrderCardProps) {
  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      draft: { variant: 'secondary' as const, label: 'Новый' },
      in_progress: { variant: 'default' as const, label: 'В работе' },
      completed: { variant: 'outline' as const, label: 'Завершён' },
    }
    return variants[status]
  }

  const completedWorks = order.works.filter(w => w.status === 'completed').length
  const totalWorks = order.works.length
  const progress = totalWorks > 0 ? Math.round((completedWorks / totalWorks) * 100) : 0

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      className={`cursor-move transition-opacity hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <CardHeader className="p-4 pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{order.orderNumber}</p>
              <Badge variant={getStatusBadge(order.status).variant} className="text-xs">
                {getStatusBadge(order.status).label}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{order.client.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Car className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {order.vehicle.brand} {order.vehicle.model}
            </span>
            <span className="text-xs font-mono">{order.vehicle.plateNumber}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            Работы: {completedWorks}/{totalWorks}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            {order.createdAt && format(order.createdAt, 'dd.MM.yyyy', { locale: ru })}
          </span>
          <span className="text-sm font-bold">
            {order.total.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
