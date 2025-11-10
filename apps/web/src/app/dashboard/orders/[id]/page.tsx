'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

// Mock данные заказа
const mockOrder = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  status: 'in_progress',
  createdAt: new Date(),
  completedAt: null,
  client: {
    id: '1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
  },
  vehicle: {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    plateNumber: 'А123БВ',
    vin: 'JT2BG22K123456789',
  },
  works: [
    {
      id: '1',
      name: 'Замена масла',
      price: 1500,
      quantity: 1,
      total: 1500,
    },
    {
      id: '2',
      name: 'Замена масляного фильтра',
      price: 500,
      quantity: 1,
      total: 500,
    },
    {
      id: '3',
      name: 'Диагностика двигателя',
      price: 1000,
      quantity: 1,
      total: 1000,
    },
  ],
  parts: [
    {
      id: '1',
      name: 'Моторное масло 5W-40',
      article: 'OIL-5W40-4L',
      price: 2500,
      quantity: 4,
      total: 10000,
    },
    {
      id: '2',
      name: 'Масляный фильтр',
      article: 'FILT-OIL-STD',
      price: 450,
      quantity: 1,
      total: 450,
    },
  ],
  discount: 5, // процент
  notes: 'Клиент просил использовать оригинальные запчасти. Позвонить после завершения работ.',
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = React.useState(mockOrder)

  const worksTotal = order.works.reduce((sum, work) => sum + work.total, 0)
  const partsTotal = order.parts.reduce((sum, part) => sum + part.total, 0)
  const subtotal = worksTotal + partsTotal
  const discountAmount = (subtotal * order.discount) / 100
  const total = subtotal - discountAmount

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

  const handleStatusChange = async (newStatus: string) => {
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setOrder({ ...order, status: newStatus })
      toast.success('Статус обновлен', {
        description: `Статус заказа изменен на "${getStatusLabel(newStatus)}"`,
      })
    } catch (error) {
      toast.error('Ошибка при обновлении статуса')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h1>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Создан {format(order.createdAt, 'd MMMM yyyy, HH:mm', { locale: ru })}
          </p>
        </div>
        <Select value={order.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="completed">Завершен</SelectItem>
            <SelectItem value="paid">Оплачен</SelectItem>
            <SelectItem value="canceled">Отменен</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Информация о клиенте и автомобиле */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Клиент</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Имя</p>
              <p className="font-medium">{order.client.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Телефон</p>
              <p className="font-mono">{order.client.phone}</p>
            </div>
            {order.client.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{order.client.email}</p>
              </div>
            )}
            <Link href={`/dashboard/clients/${order.client.id}`}>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Перейти к клиенту
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Автомобиль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Марка и модель</p>
              <p className="font-medium">
                {order.vehicle.brand} {order.vehicle.model} {order.vehicle.year}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Гос. номер</p>
              <p className="font-mono font-semibold text-lg">{order.vehicle.plateNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">VIN</p>
              <p className="font-mono text-sm">{order.vehicle.vin}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Работы */}
      <Card>
        <CardHeader>
          <CardTitle>Работы</CardTitle>
          <CardDescription>Выполняемые работы и услуги</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.works.map((work) => (
                <TableRow key={work.id}>
                  <TableCell className="font-medium">{work.name}</TableCell>
                  <TableCell className="text-right">₽{work.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{work.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₽{work.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">
                  Итого работы:
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₽{worksTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Запчасти */}
      <Card>
        <CardHeader>
          <CardTitle>Запчасти</CardTitle>
          <CardDescription>Использованные запчасти и материалы</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell className="font-mono text-sm">{part.article}</TableCell>
                  <TableCell className="text-right">₽{part.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{part.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₽{part.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-semibold">
                  Итого запчасти:
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₽{partsTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Примечания */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Примечания</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Итоги */}
      <Card>
        <CardHeader>
          <CardTitle>Итого</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Работы:</span>
              <span className="font-medium">₽{worksTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Запчасти:</span>
              <span className="font-medium">₽{partsTotal.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Промежуточный итог:</span>
              <span className="font-medium">₽{subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка ({order.discount}%):</span>
                <span>-₽{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl">
              <span className="font-semibold">К оплате:</span>
              <span className="font-bold text-3xl">₽{total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
