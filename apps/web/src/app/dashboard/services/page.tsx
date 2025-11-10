'use client'

import * as React from 'react'
import { Plus, Search, Edit, Trash2, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddServiceDialog } from './components/add-service-dialog'
import { EditServiceDialog } from './components/edit-service-dialog'
import { toast } from 'sonner'

// Mock данные услуг
const mockServices = [
  {
    id: '1',
    name: 'Замена масла',
    description: 'Замена моторного масла и масляного фильтра',
    price: 1500,
    duration: 30,
    category: 'Техническое обслуживание',
  },
  {
    id: '2',
    name: 'Диагностика подвески',
    description: 'Полная диагностика ходовой части автомобиля',
    price: 1000,
    duration: 60,
    category: 'Диагностика',
  },
  {
    id: '3',
    name: 'Замена тормозных колодок',
    description: 'Замена передних тормозных колодок',
    price: 2500,
    duration: 90,
    category: 'Ремонт тормозной системы',
  },
  {
    id: '4',
    name: 'Компьютерная диагностика',
    description: 'Диагностика с помощью сканера OBD-II',
    price: 800,
    duration: 30,
    category: 'Диагностика',
  },
  {
    id: '5',
    name: 'Шиномонтаж',
    description: 'Шиномонтаж 4 колес с балансировкой',
    price: 2000,
    duration: 60,
    category: 'Шиномонтаж',
  },
  {
    id: '6',
    name: 'Замена свечей зажигания',
    description: 'Замена комплекта свечей зажигания',
    price: 1200,
    duration: 45,
    category: 'Техническое обслуживание',
  },
  {
    id: '7',
    name: 'Развал-схождение',
    description: 'Регулировка углов установки колес',
    price: 1800,
    duration: 60,
    category: 'Регулировочные работы',
  },
  {
    id: '8',
    name: 'Замена воздушного фильтра',
    description: 'Замена фильтра воздушной системы двигателя',
    price: 500,
    duration: 15,
    category: 'Техническое обслуживание',
  },
]

export default function ServicesPage() {
  const [services, setServices] = React.useState(mockServices)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<typeof mockServices[0] | null>(null)

  // Фильтрация услуг по поиску
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Группировка по категориям
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof mockServices>)

  const handleAddService = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newService = {
      id: String(services.length + 1),
      ...data,
    }

    setServices([...services, newService])
    toast.success('Услуга добавлена', {
      description: `${data.name} успешно добавлена в каталог`,
    })
  }

  const handleEditService = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setServices(services.map(s =>
      s.id === selectedService?.id ? { ...s, ...data } : s
    ))

    toast.success('Услуга обновлена', {
      description: `${data.name} успешно обновлена`,
    })
  }

  const handleDeleteService = async (service: typeof mockServices[0]) => {
    if (!confirm(`Вы уверены, что хотите удалить услугу "${service.name}"?`)) {
      return
    }

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setServices(services.filter(s => s.id !== service.id))
      toast.success('Услуга удалена')
    } catch (error) {
      toast.error('Ошибка при удалении услуги')
    }
  }

  const handleEditClick = (service: typeof mockServices[0]) => {
    setSelectedService(service)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Услуги</h1>
          <p className="text-muted-foreground">
            Управление каталогом услуг автосервиса
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить услугу
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего услуг</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категорий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(servicesByCategory).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средняя цена</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₽{Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ср. длительность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)} мин
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Поиск услуг</CardTitle>
          <CardDescription>
            Найдите нужную услугу по названию, описанию или категории
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Таблица услуг */}
      <Card>
        <CardHeader>
          <CardTitle>Каталог услуг</CardTitle>
          <CardDescription>
            Список всех доступных услуг ({filteredServices.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Услуги не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {service.description}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₽{service.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{service.duration} мин</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Диалоги */}
      <AddServiceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddService}
      />

      {selectedService && (
        <EditServiceDialog
          service={selectedService}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleEditService}
        />
      )}
    </div>
  )
}
