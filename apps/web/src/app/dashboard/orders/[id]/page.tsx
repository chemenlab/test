'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, FileText, CheckCircle, XCircle, Clock, DollarSign, Printer, Image as ImageIcon, X } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileUpload } from '@/components/ui/file-upload'
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
  photos: {
    before: [] as string[],
    after: [] as string[],
  },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = React.useState(mockOrder)
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null)
  const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false)

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
        <div className="flex gap-2">
          <Link href={`/dashboard/orders/${params.id}/print`} target="_blank">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Печать
            </Button>
          </Link>
          <Link href={`/dashboard/orders/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          </Link>
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

      {/* Фотофиксация */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Фотофиксация</CardTitle>
              <CardDescription>Фотографии до и после ремонта</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Фото ДО */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Фото ДО ремонта
            </h3>
            <FileUpload
              value={order.photos.before}
              onChange={(files) => {
                setOrder({ ...order, photos: { ...order.photos, before: files } })
                toast.success('Фотографии добавлены')
              }}
              maxFiles={10}
            />
          </div>

          <Separator />

          {/* Фото ПОСЛЕ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Фото ПОСЛЕ ремонта
            </h3>
            <FileUpload
              value={order.photos.after}
              onChange={(files) => {
                setOrder({ ...order, photos: { ...order.photos, after: files } })
                toast.success('Фотографии добавлены')
              }}
              maxFiles={10}
            />
          </div>

          {/* Просмотр всех фото */}
          {(order.photos.before.length > 0 || order.photos.after.length > 0) && (
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (order.photos.before.length > 0) {
                    setSelectedPhoto(order.photos.before[0])
                  } else if (order.photos.after.length > 0) {
                    setSelectedPhoto(order.photos.after[0])
                  }
                  setPhotoDialogOpen(true)
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Просмотреть все фото ({order.photos.before.length + order.photos.after.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Просмотр фотографий</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto}
                alt="Фото заказа"
                className="w-full h-auto max-h-[600px] object-contain rounded-lg"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...order.photos.before, ...order.photos.after].map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedPhoto === photo ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
