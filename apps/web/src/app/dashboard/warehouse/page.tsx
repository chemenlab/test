'use client'

import * as React from 'react'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddPartDialog } from './components/add-part-dialog'
import { EditPartDialog } from './components/edit-part-dialog'
import { toast } from 'sonner'

// Mock данные запчастей
const mockParts = [
  {
    id: '1',
    name: 'Моторное масло 5W-40',
    article: 'OIL-5W40-4L',
    brand: 'Shell',
    category: 'Масла',
    price: 2500,
    purchasePrice: 1800,
    quantity: 25,
    minQuantity: 10,
    unit: 'л',
  },
  {
    id: '2',
    name: 'Тормозные колодки передние',
    article: 'BRP-FR-TOYOT',
    brand: 'Brembo',
    category: 'Тормозная система',
    price: 3500,
    purchasePrice: 2800,
    quantity: 8,
    minQuantity: 5,
    unit: 'компл',
  },
  {
    id: '3',
    name: 'Масляный фильтр',
    article: 'FILT-OIL-STD',
    brand: 'Mann',
    category: 'Фильтры',
    price: 450,
    purchasePrice: 320,
    quantity: 3,
    minQuantity: 10,
    unit: 'шт',
  },
  {
    id: '4',
    name: 'Воздушный фильтр',
    article: 'FILT-AIR-STD',
    brand: 'Filtron',
    category: 'Фильтры',
    price: 650,
    purchasePrice: 450,
    quantity: 15,
    minQuantity: 8,
    unit: 'шт',
  },
  {
    id: '5',
    name: 'Свечи зажигания',
    article: 'SPARK-NGK-4PCS',
    brand: 'NGK',
    category: 'Зажигание',
    price: 1200,
    purchasePrice: 900,
    quantity: 2,
    minQuantity: 6,
    unit: 'компл',
  },
  {
    id: '6',
    name: 'Антифриз G12+',
    article: 'ANTIFRZ-G12-5L',
    brand: 'Liqui Moly',
    category: 'Охлаждающие жидкости',
    price: 1800,
    purchasePrice: 1300,
    quantity: 12,
    minQuantity: 8,
    unit: 'л',
  },
]

export default function WarehousePage() {
  const [parts, setParts] = React.useState(mockParts)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedPart, setSelectedPart] = React.useState<typeof mockParts[0] | null>(null)

  // Получить уникальные категории
  const categories = Array.from(new Set(parts.map(p => p.category)))

  // Фильтрация запчастей
  const filteredParts = parts.filter(part => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Запчасти с низким остатком
  const lowStockParts = parts.filter(p => p.quantity < p.minQuantity)

  // Общая стоимость склада
  const totalValue = parts.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const totalPurchaseValue = parts.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0)
  const potentialProfit = totalValue - totalPurchaseValue

  const handleAddPart = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPart = {
      id: String(parts.length + 1),
      ...data,
    }

    setParts([...parts, newPart])
    toast.success('Запчасть добавлена', {
      description: `${data.name} успешно добавлена на склад`,
    })
  }

  const handleEditPart = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setParts(parts.map(p =>
      p.id === selectedPart?.id ? { ...p, ...data } : p
    ))

    toast.success('Запчасть обновлена', {
      description: `${data.name} успешно обновлена`,
    })
  }

  const handleDeletePart = async (part: typeof mockParts[0]) => {
    if (!confirm(`Вы уверены, что хотите удалить "${part.name}"?`)) {
      return
    }

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setParts(parts.filter(p => p.id !== part.id))
      toast.success('Запчасть удалена')
    } catch (error) {
      toast.error('Ошибка при удалении запчасти')
    }
  }

  const handleEditClick = (part: typeof mockParts[0]) => {
    setSelectedPart(part)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Склад</h1>
          <p className="text-muted-foreground">
            Управление запчастями и остатками
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить запчасть
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего позиций</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Низкий остаток</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockParts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Стоимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₽{Math.round(totalValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">по розничным ценам</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Потенц. прибыль</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₽{Math.round(potentialProfit).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">разница с закупкой</p>
          </CardContent>
        </Card>
      </div>

      {/* Алерты низких остатков */}
      {lowStockParts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="h-5 w-5" />
              Внимание: низкий остаток
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Следующие запчасти заканчиваются на складе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockParts.map(part => (
                <div key={part.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-yellow-900">{part.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-yellow-600 text-yellow-900">
                      {part.quantity} {part.unit}
                    </Badge>
                    <span className="text-yellow-700">
                      мин: {part.minQuantity} {part.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Поиск и фильтры */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, артикулу, бренду..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Таблица запчастей */}
      <Card>
        <CardHeader>
          <CardTitle>Запчасти на складе</CardTitle>
          <CardDescription>
            Список всех запчастей ({filteredParts.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead>Бренд</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Закупка</TableHead>
                <TableHead>Розница</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Запчасти не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell className="font-mono text-sm">{part.article}</TableCell>
                    <TableCell>{part.brand}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{part.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={part.quantity < part.minQuantity ? 'text-yellow-600 font-semibold' : ''}>
                          {part.quantity} {part.unit}
                        </span>
                        {part.quantity < part.minQuantity && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₽{part.purchasePrice.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">₽{part.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(part)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePart(part)}
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
      <AddPartDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddPart}
      />

      {selectedPart && (
        <EditPartDialog
          part={selectedPart}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleEditPart}
        />
      )}
    </div>
  )
}
