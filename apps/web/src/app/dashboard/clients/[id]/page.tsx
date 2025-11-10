'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar, FileText, Car, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { EditClientDialog } from './components/edit-client-dialog'
import { toast } from 'sonner'

// Mock client data
const mockClient = {
  id: '1',
  name: 'Иван Петров',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  source: 'website',
  tags: ['VIP'],
  notes: 'Постоянный клиент',
  createdAt: new Date('2024-01-15'),
  vehicles: [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2020,
      plateNumber: 'А123БВ',
      vin: 'XYZ123456789',
    },
    {
      id: '2',
      brand: 'BMW',
      model: 'X5',
      year: 2022,
      plateNumber: 'К456МН',
      vin: 'ABC987654321',
    },
  ],
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: new Date('2024-03-01'),
      service: 'Замена масла',
      vehicle: 'Toyota Camry',
      total: 3500,
      status: 'completed',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-015',
      date: new Date('2024-02-15'),
      service: 'Техосмотр',
      vehicle: 'Toyota Camry',
      total: 1500,
      status: 'completed',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-002',
      date: new Date('2024-01-20'),
      service: 'Замена тормозных колодок',
      vehicle: 'BMW X5',
      total: 8500,
      status: 'completed',
    },
  ],
  bookings: [
    {
      id: '1',
      date: new Date('2024-03-25 14:00'),
      service: 'Диагностика двигателя',
      vehicle: 'Toyota Camry',
      status: 'confirmed',
    },
  ],
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = React.useState(mockClient)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)

  const totalSpent = client.orders.reduce((sum, order) => sum + order.total, 0)

  const handleSaveClient = async (data: any) => {
    // TODO: API call to update client
    await new Promise(resolve => setTimeout(resolve, 1000))

    setClient({
      ...client,
      ...data,
    })
  }

  const handleDeleteClient = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента? Это действие необратимо.')) {
      return
    }

    try {
      // TODO: API call to delete client
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Клиент удален')
      router.push('/dashboard/clients')
    } catch (error) {
      toast.error('Ошибка при удалении клиента')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">
            Клиент с {client.createdAt.toLocaleDateString('ru-RU')}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDeleteClient}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Телефон</p>
                <p className="text-sm text-muted-foreground font-mono">{client.phone}</p>
              </div>
            </div>
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
            )}
            {client.source && (
              <div>
                <p className="text-sm font-medium mb-2">Источник</p>
                <Badge variant="outline">{client.source}</Badge>
              </div>
            )}
            {client.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Теги</p>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {client.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Заметки</p>
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">₽{totalSpent.toLocaleString('ru-RU')}</p>
              <p className="text-sm text-muted-foreground">Всего потрачено</p>
            </div>
            <Separator />
            <div>
              <p className="text-2xl font-bold">{client.orders.length}</p>
              <p className="text-sm text-muted-foreground">Завершенных заказов</p>
            </div>
            <Separator />
            <div>
              <p className="text-2xl font-bold">{client.vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Автомобилей</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Booking */}
        {client.bookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Следующая запись</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {client.bookings[0].date.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.bookings[0].service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.bookings[0].vehicle}</span>
                </div>
                <Badge className="mt-2">{client.bookings[0].status}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Автомобили</CardTitle>
          <CardDescription>Зарегистрированные автомобили клиента</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {client.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                  </div>
                  <Car className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Гос. номер:</span>{' '}
                    <span className="font-mono">{vehicle.plateNumber}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">VIN:</span>{' '}
                    <span className="font-mono text-xs">{vehicle.vin}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>История заказов</CardTitle>
          <CardDescription>Все заказы клиента</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {client.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.orderNumber}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status === 'completed' ? 'Завершен' : order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.service}</p>
                  <p className="text-sm text-muted-foreground">{order.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₽{order.total.toLocaleString('ru-RU')}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.date.toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditClientDialog
        client={client}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveClient}
      />
    </div>
  )
}
