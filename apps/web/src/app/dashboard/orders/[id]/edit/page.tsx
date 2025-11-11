'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Mock данные
const mockClients = [
  { id: '1', name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
  { id: '2', name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
  { id: '3', name: 'Дмитрий Иванов', phone: '+7 (999) 345-67-89' },
]

const mockVehicles: Record<string, any[]> = {
  '1': [
    { id: '1', brand: 'Toyota', model: 'Camry', year: 2020, plateNumber: 'А123БВ' },
    { id: '2', brand: 'BMW', model: 'X5', year: 2022, plateNumber: 'К456МН' },
  ],
  '2': [
    { id: '3', brand: 'Volkswagen', model: 'Polo', year: 2019, plateNumber: 'В456ГД' },
  ],
  '3': [
    { id: '4', brand: 'Kia', model: 'Rio', year: 2021, plateNumber: 'С789ЕЖ' },
  ],
}

const mockServices = [
  { id: '1', name: 'Замена масла', price: 1500, duration: 30 },
  { id: '2', name: 'Диагностика подвески', price: 1000, duration: 60 },
  { id: '3', name: 'Замена тормозных колодок', price: 2500, duration: 90 },
  { id: '4', name: 'Компьютерная диагностика', price: 800, duration: 30 },
  { id: '5', name: 'Шиномонтаж', price: 2000, duration: 60 },
]

const mockParts = [
  { id: '1', name: 'Моторное масло 5W-40', article: 'OIL-5W40', price: 2500, quantity: 25 },
  { id: '2', name: 'Тормозные колодки передние', article: 'BRP-FR', price: 3500, quantity: 8 },
  { id: '3', name: 'Масляный фильтр', article: 'FILT-OIL', price: 450, quantity: 15 },
  { id: '4', name: 'Воздушный фильтр', article: 'FILT-AIR', price: 650, quantity: 15 },
  { id: '5', name: 'Свечи зажигания (комплект)', article: 'SPARK-4', price: 1200, quantity: 10 },
]

// Mock данные существующего заказа
const mockOrder = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  status: 'in_progress',
  clientId: '1',
  vehicleId: '1',
  works: [
    {
      id: '1',
      serviceId: '1',
      name: 'Замена масла',
      price: 1500,
      quantity: 1,
    },
    {
      id: '2',
      serviceId: '2',
      name: 'Замена масляного фильтра',
      price: 500,
      quantity: 1,
    },
    {
      id: '3',
      serviceId: '4',
      name: 'Диагностика двигателя',
      price: 1000,
      quantity: 1,
    },
  ],
  parts: [
    {
      id: '1',
      partId: '1',
      name: 'Моторное масло 5W-40',
      article: 'OIL-5W40-4L',
      price: 2500,
      quantity: 4,
    },
    {
      id: '2',
      partId: '3',
      name: 'Масляный фильтр',
      article: 'FILT-OIL-STD',
      price: 450,
      quantity: 1,
    },
  ],
  discount: 5,
  notes: 'Клиент просил использовать оригинальные запчасти. Позвонить после завершения работ.',
}

type OrderWork = {
  id: string
  serviceId: string
  name: string
  price: number
  quantity: number
}

type OrderPart = {
  id: string
  partId: string
  name: string
  article: string
  price: number
  quantity: number
}

export default function EditOrderPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  // TODO: Загрузить данные заказа по ID из API
  const [clientId, setClientId] = React.useState(mockOrder.clientId)
  const [vehicleId, setVehicleId] = React.useState(mockOrder.vehicleId)
  const [works, setWorks] = React.useState<OrderWork[]>(mockOrder.works)
  const [parts, setParts] = React.useState<OrderPart[]>(mockOrder.parts)
  const [discount, setDiscount] = React.useState(mockOrder.discount)
  const [status, setStatus] = React.useState(mockOrder.status)
  const [notes, setNotes] = React.useState(mockOrder.notes)

  const selectedClient = mockClients.find(c => c.id === clientId)
  const clientVehicles = clientId ? mockVehicles[clientId] || [] : []
  const selectedVehicle = clientVehicles.find(v => v.id === vehicleId)

  // Добавление работы
  const handleAddWork = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId)
    if (!service) return

    setWorks([
      ...works,
      {
        id: Math.random().toString(),
        serviceId: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
      },
    ])
  }

  // Удаление работы
  const handleRemoveWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id))
  }

  // Изменение количества работы
  const handleWorkQuantityChange = (id: string, quantity: number) => {
    setWorks(works.map(w => w.id === id ? { ...w, quantity } : w))
  }

  // Изменение цены работы
  const handleWorkPriceChange = (id: string, price: number) => {
    setWorks(works.map(w => w.id === id ? { ...w, price } : w))
  }

  // Добавление запчасти
  const handleAddPart = (partId: string) => {
    const part = mockParts.find(p => p.id === partId)
    if (!part) return

    setParts([
      ...parts,
      {
        id: Math.random().toString(),
        partId: part.id,
        name: part.name,
        article: part.article,
        price: part.price,
        quantity: 1,
      },
    ])
  }

  // Удаление запчасти
  const handleRemovePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id))
  }

  // Изменение количества запчасти
  const handlePartQuantityChange = (id: string, quantity: number) => {
    setParts(parts.map(p => p.id === id ? { ...p, quantity } : p))
  }

  // Изменение цены запчасти
  const handlePartPriceChange = (id: string, price: number) => {
    setParts(parts.map(p => p.id === id ? { ...p, price } : p))
  }

  // Расчет итогов
  const worksTotal = works.reduce((sum, w) => sum + w.price * w.quantity, 0)
  const partsTotal = parts.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const subtotal = worksTotal + partsTotal
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  // Сохранение изменений
  const handleSave = async () => {
    if (!clientId || !vehicleId) {
      toast.error('Заполните обязательные поля', {
        description: 'Выберите клиента и автомобиль',
      })
      return
    }

    if (works.length === 0 && parts.length === 0) {
      toast.error('Добавьте работы или запчасти', {
        description: 'Заказ должен содержать хотя бы одну работу или запчасть',
      })
      return
    }

    try {
      // TODO: API call to update order
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Заказ обновлен', {
        description: `Заказ-наряд ${mockOrder.orderNumber} успешно обновлен`,
      })

      router.push(`/dashboard/orders/${orderId}`)
    } catch (error) {
      toast.error('Ошибка при обновлении заказа')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/orders/${orderId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Редактирование заказа {mockOrder.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Изменение данных заказа-наряда
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Сохранить изменения
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Информация о клиенте и автомобиле */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Информация о клиенте</CardTitle>
            <CardDescription>Выберите клиента и автомобиль</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">Клиент *</Label>
                <Select value={clientId} onValueChange={(value) => {
                  setClientId(value)
                  setVehicleId('') // Сбросить выбор автомобиля
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Автомобиль *</Label>
                <Select
                  value={vehicleId}
                  onValueChange={setVehicleId}
                  disabled={!clientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите автомобиль" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.plateNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedClient && selectedVehicle && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Клиент</p>
                    <p className="font-medium">{selectedClient.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Автомобиль</p>
                    <p className="font-medium">
                      {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedVehicle.plateNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Статус и настройки */}
        <Card>
          <CardHeader>
            <CardTitle>Настройки заказа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Работы */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Работы</CardTitle>
              <CardDescription>Добавьте выполняемые работы</CardDescription>
            </div>
            <Select onValueChange={handleAddWork}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Добавить работу..." />
              </SelectTrigger>
              <SelectContent>
                {mockServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - ₽{service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {works.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Работы не добавлены
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-[120px]">Цена</TableHead>
                  <TableHead className="w-[100px]">Кол-во</TableHead>
                  <TableHead className="w-[120px]">Сумма</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell className="font-medium">{work.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={work.price}
                        onChange={(e) => handleWorkPriceChange(work.id, Number(e.target.value))}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={work.quantity}
                        onChange={(e) => handleWorkQuantityChange(work.id, Number(e.target.value))}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₽{(work.price * work.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveWork(work.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Запчасти */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Запчасти</CardTitle>
              <CardDescription>Добавьте использованные запчасти</CardDescription>
            </div>
            <Select onValueChange={handleAddPart}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Добавить запчасть..." />
              </SelectTrigger>
              <SelectContent>
                {mockParts.map((part) => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name} - ₽{part.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {parts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Запчасти не добавлены
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead className="w-[120px]">Цена</TableHead>
                  <TableHead className="w-[100px]">Кол-во</TableHead>
                  <TableHead className="w-[120px]">Сумма</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell className="font-mono text-sm">{part.article}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={part.price}
                        onChange={(e) => handlePartPriceChange(part.id, Number(e.target.value))}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => handlePartQuantityChange(part.id, Number(e.target.value))}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₽{(part.price * part.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePart(part.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Примечания */}
      <Card>
        <CardHeader>
          <CardTitle>Примечания</CardTitle>
          <CardDescription>Дополнительная информация о заказе</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Примечания, особые условия, рекомендации..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Итоги */}
      <Card>
        <CardHeader>
          <CardTitle>Итого</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка ({discount}%):</span>
                <span>-₽{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">К оплате:</span>
              <span className="font-bold text-2xl">₽{total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
