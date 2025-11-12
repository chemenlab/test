'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  AlertTriangle,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'

type RequestStatus = 'pending' | 'approved' | 'rejected' | 'ordered' | 'received'
type Priority = 'low' | 'normal' | 'high' | 'critical'

interface PurchaseRequest {
  id: string
  requestNumber: string
  partName: string
  partNumber: string
  quantity: number
  priority: Priority
  status: RequestStatus
  supplier: string | null
  estimatedPrice: number | null
  notes: string | null
  orderId: string | null
  createdAt: Date
  createdBy: { id: string; name: string }
  reviewedAt: Date | null
  reviewedBy: { id: string; name: string } | null
  rejectionReason: string | null
}

interface LowStockAlert {
  id: string
  partName: string
  partNumber: string
  currentStock: number
  minStock: number
  lastOrderDate: Date | null
}

// Mock current user (can be toggled between purchaser and admin)
const defaultUser = {
  id: 'user-1',
  name: 'Анна Закупщик',
  role: 'purchaser' as const,
}

const adminUser = {
  id: 'admin-1',
  name: 'Иван Админов',
  role: 'admin' as const,
}

// Mock purchase requests
const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-1',
    requestNumber: 'PR-2024-001',
    partName: 'Масло моторное 5W-30',
    partNumber: 'OIL-5W30-001',
    quantity: 20,
    priority: 'high',
    status: 'pending',
    supplier: null,
    estimatedPrice: null,
    notes: 'Срочно, заканчивается',
    orderId: null,
    createdAt: new Date(),
    createdBy: defaultUser,
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  {
    id: 'pr-2',
    requestNumber: 'PR-2024-002',
    partName: 'Фильтр масляный',
    partNumber: 'FILTER-OIL-002',
    quantity: 30,
    priority: 'normal',
    status: 'approved',
    supplier: 'Emex',
    estimatedPrice: 15000,
    notes: null,
    orderId: null,
    createdAt: new Date(Date.now() - 86400000),
    createdBy: defaultUser,
    reviewedAt: new Date(Date.now() - 43200000),
    reviewedBy: { id: 'admin-1', name: 'Иван Админов' },
    rejectionReason: null,
  },
  {
    id: 'pr-3',
    requestNumber: 'PR-2024-003',
    partName: 'Тормозные колодки передние',
    partNumber: 'BRAKE-PAD-FRONT-003',
    quantity: 10,
    priority: 'critical',
    status: 'approved',
    supplier: 'Exist.ru',
    estimatedPrice: 25000,
    notes: 'Для заказа BMW X5',
    orderId: null,
    createdAt: new Date(Date.now() - 172800000),
    createdBy: defaultUser,
    reviewedAt: new Date(Date.now() - 86400000),
    reviewedBy: { id: 'admin-1', name: 'Иван Админов' },
    rejectionReason: null,
  },
  {
    id: 'pr-4',
    requestNumber: 'PR-2024-004',
    partName: 'Свечи зажигания NGK',
    partNumber: 'SPARK-NGK-004',
    quantity: 50,
    priority: 'low',
    status: 'rejected',
    supplier: null,
    estimatedPrice: null,
    notes: null,
    orderId: null,
    createdAt: new Date(Date.now() - 259200000),
    createdBy: defaultUser,
    reviewedAt: new Date(Date.now() - 172800000),
    reviewedBy: { id: 'admin-1', name: 'Иван Админов' },
    rejectionReason: 'Слишком большое количество, закажите 20 штук',
  },
  {
    id: 'pr-5',
    requestNumber: 'PR-2024-005',
    partName: 'Антифриз G12+',
    partNumber: 'COOLANT-G12-005',
    quantity: 15,
    priority: 'normal',
    status: 'ordered',
    supplier: 'Emex',
    estimatedPrice: 8500,
    notes: null,
    orderId: 'ORD-SUPPLY-001',
    createdAt: new Date(Date.now() - 432000000),
    createdBy: defaultUser,
    reviewedAt: new Date(Date.now() - 345600000),
    reviewedBy: { id: 'admin-1', name: 'Иван Админов' },
    rejectionReason: null,
  },
]

// Mock low stock alerts
const mockLowStockAlerts: LowStockAlert[] = [
  {
    id: 'alert-1',
    partName: 'Масло моторное 5W-30',
    partNumber: 'OIL-5W30-001',
    currentStock: 3,
    minStock: 10,
    lastOrderDate: new Date(Date.now() - 604800000),
  },
  {
    id: 'alert-2',
    partName: 'Фильтр воздушный',
    partNumber: 'FILTER-AIR-002',
    currentStock: 2,
    minStock: 15,
    lastOrderDate: new Date(Date.now() - 1209600000),
  },
  {
    id: 'alert-3',
    partName: 'Тормозная жидкость DOT-4',
    partNumber: 'BRAKE-FLUID-003',
    currentStock: 1,
    minStock: 8,
    lastOrderDate: new Date(Date.now() - 864000000),
  },
]

export default function PurchaseRequestsPage() {
  const [requests, setRequests] = React.useState<PurchaseRequest[]>(mockPurchaseRequests)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | 'all'>('all')

  // Current user role (for demo, can be toggled)
  const [currentUserRole, setCurrentUserRole] = React.useState<'purchaser' | 'admin'>('purchaser')
  const currentUser = currentUserRole === 'admin' ? adminUser : defaultUser

  // Admin review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<PurchaseRequest | null>(null)
  const [reviewAction, setReviewAction] = React.useState<'approve' | 'reject'>('approve')
  const [rejectionReason, setRejectionReason] = React.useState('')

  // Form state for new request
  const [formData, setFormData] = React.useState({
    partName: '',
    partNumber: '',
    quantity: '',
    priority: 'normal' as Priority,
    supplier: '',
    estimatedPrice: '',
    notes: '',
  })

  // Filter requests
  const filteredRequests = React.useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchQuery === '' ||
        request.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, searchQuery, statusFilter])

  // Statistics
  const stats = React.useMemo(() => {
    return {
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      rejected: requests.filter((r) => r.status === 'rejected').length,
      ordered: requests.filter((r) => r.status === 'ordered').length,
      lowStockAlerts: mockLowStockAlerts.length,
    }
  }, [requests])

  const handleCreateRequest = () => {
    if (!formData.partName || !formData.partNumber || !formData.quantity) {
      toast.error('Заполните обязательные поля')
      return
    }

    const newRequest: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      requestNumber: `PR-2024-${String(requests.length + 1).padStart(3, '0')}`,
      partName: formData.partName,
      partNumber: formData.partNumber,
      quantity: parseInt(formData.quantity),
      priority: formData.priority,
      status: 'pending',
      supplier: formData.supplier || null,
      estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
      notes: formData.notes || null,
      orderId: null,
      createdAt: new Date(),
      createdBy: currentUser,
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    }

    setRequests([newRequest, ...requests])
    setDialogOpen(false)
    setFormData({
      partName: '',
      partNumber: '',
      quantity: '',
      priority: 'normal',
      supplier: '',
      estimatedPrice: '',
      notes: '',
    })
    toast.success('Заявка создана', {
      description: `Заявка ${newRequest.requestNumber} отправлена на согласование`,
    })
  }

  const handleOpenReviewDialog = (request: PurchaseRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setReviewAction(action)
    setRejectionReason('')
    setReviewDialogOpen(true)
  }

  const handleReviewRequest = () => {
    if (!selectedRequest) return

    if (reviewAction === 'reject' && !rejectionReason) {
      toast.error('Укажите причину отклонения')
      return
    }

    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === selectedRequest.id) {
          return {
            ...request,
            status: reviewAction === 'approve' ? 'approved' : 'rejected',
            reviewedAt: new Date(),
            reviewedBy: currentUser,
            rejectionReason: reviewAction === 'reject' ? rejectionReason : null,
          }
        }
        return request
      })
    )

    toast.success(
      reviewAction === 'approve' ? 'Заявка одобрена' : 'Заявка отклонена',
      {
        description: `Заявка ${selectedRequest.requestNumber} ${
          reviewAction === 'approve' ? 'одобрена' : 'отклонена'
        }`,
      }
    )

    setReviewDialogOpen(false)
    setSelectedRequest(null)
    setRejectionReason('')
  }

  const getStatusBadge = (status: RequestStatus) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'На рассмотрении', icon: Clock },
      approved: { variant: 'default' as const, label: 'Одобрено', icon: CheckCircle2 },
      rejected: { variant: 'destructive' as const, label: 'Отклонено', icon: XCircle },
      ordered: { variant: 'outline' as const, label: 'Заказано', icon: Package },
      received: { variant: 'outline' as const, label: 'Получено', icon: CheckCircle2 },
    }
    return variants[status]
  }

  const getPriorityBadge = (priority: Priority) => {
    const variants = {
      low: { variant: 'outline' as const, label: 'Низкий' },
      normal: { variant: 'secondary' as const, label: 'Обычный' },
      high: { variant: 'default' as const, label: 'Высокий' },
      critical: { variant: 'destructive' as const, label: 'Критический' },
    }
    return variants[priority]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заявки на закупку</h1>
          <p className="text-muted-foreground">
            {currentUserRole === 'admin'
              ? 'Рассмотрение и одобрение заявок на приобретение запчастей'
              : 'Управление заявками на приобретение запчастей'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {/* Role toggle for demo */}
          <Button
            variant="outline"
            onClick={() => setCurrentUserRole(currentUserRole === 'admin' ? 'purchaser' : 'admin')}
          >
            {currentUserRole === 'admin' ? '👤 Админ' : '🛒 Закупщик'}
          </Button>
          {currentUserRole === 'purchaser' && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Создать заявку
            </Button>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {mockLowStockAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Критические остатки на складе
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {mockLowStockAlerts.map((alert) => (
              <Card key={alert.id} className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-medium">{alert.partName}</CardTitle>
                  <CardDescription className="text-xs">{alert.partNumber}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Остаток:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {alert.currentStock} шт
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Минимум:</span>
                      <span>{alert.minStock} шт</span>
                    </div>
                    {alert.lastOrderDate && (
                      <div className="text-muted-foreground">
                        Последний заказ:{' '}
                        {format(alert.lastOrderDate, 'dd.MM.yyyy', { locale: ru })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На рассмотрении</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Одобрено</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отклонено</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказано</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordered}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критические остатки</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.lowStockAlerts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Поиск по названию, артикулу, номеру заявки..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | 'all')}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">На рассмотрении</SelectItem>
                  <SelectItem value="approved">Одобрено</SelectItem>
                  <SelectItem value="rejected">Отклонено</SelectItem>
                  <SelectItem value="ordered">Заказано</SelectItem>
                  <SelectItem value="received">Получено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Заявки ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№ Заявки</TableHead>
                <TableHead>Запчасть</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead className="text-right">Количество</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Поставщик</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead>Дата создания</TableHead>
                {currentUserRole === 'admin' && <TableHead className="text-right">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={currentUserRole === 'admin' ? 10 : 9} className="text-center text-muted-foreground">
                    Заявки не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => {
                  const statusBadge = getStatusBadge(request.status)
                  const priorityBadge = getPriorityBadge(request.priority)
                  const StatusIcon = statusBadge.icon

                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requestNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.partName}</div>
                          {request.notes && (
                            <div className="text-xs text-muted-foreground">{request.notes}</div>
                          )}
                          {request.rejectionReason && (
                            <div className="text-xs text-destructive mt-1">
                              Причина отклонения: {request.rejectionReason}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{request.partNumber}</TableCell>
                      <TableCell className="text-right">{request.quantity} шт</TableCell>
                      <TableCell>
                        <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.supplier || '—'}</TableCell>
                      <TableCell className="text-right">
                        {request.estimatedPrice
                          ? `${request.estimatedPrice.toLocaleString('ru-RU')} ₽`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {format(request.createdAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </TableCell>
                      {currentUserRole === 'admin' && (
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleOpenReviewDialog(request, 'approve')}
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Одобрить
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleOpenReviewDialog(request, 'reject')}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Отклонить
                              </Button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <span className="text-xs text-muted-foreground">
                              {request.reviewedBy?.name || '—'}
                            </span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Новая заявка на закупку</DialogTitle>
            <DialogDescription>
              Заполните информацию о требуемой запчасти. Заявка будет отправлена на согласование
              администратору.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="partName">
                Название запчасти <span className="text-destructive">*</span>
              </Label>
              <Input
                id="partName"
                placeholder="Например: Масло моторное 5W-30"
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="partNumber">
                Артикул <span className="text-destructive">*</span>
              </Label>
              <Input
                id="partNumber"
                placeholder="Например: OIL-5W30-001"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">
                  Количество <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="critical">Критический</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="supplier">Поставщик (опционально)</Label>
                <Input
                  id="supplier"
                  placeholder="Например: Emex"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estimatedPrice">Ориентировочная цена (₽)</Label>
                <Input
                  id="estimatedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                placeholder="Дополнительная информация о заявке..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateRequest}>Создать заявку</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Одобрить заявку' : 'Отклонить заявку'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && `Заявка ${selectedRequest.requestNumber} - ${selectedRequest.partName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Артикул:</span>
                  <div className="font-mono">{selectedRequest.partNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Количество:</span>
                  <div className="font-medium">{selectedRequest.quantity} шт</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Приоритет:</span>
                  <div>
                    <Badge variant={getPriorityBadge(selectedRequest.priority).variant}>
                      {getPriorityBadge(selectedRequest.priority).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Поставщик:</span>
                  <div>{selectedRequest.supplier || '—'}</div>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <span className="text-sm text-muted-foreground">Примечания:</span>
                  <p className="text-sm mt-1">{selectedRequest.notes}</p>
                </div>
              )}

              {reviewAction === 'reject' && (
                <div className="grid gap-2">
                  <Label htmlFor="rejectionReason">
                    Причина отклонения <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Укажите причину отклонения заявки..."
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleReviewRequest}
            >
              {reviewAction === 'approve' ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Одобрить
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Отклонить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
