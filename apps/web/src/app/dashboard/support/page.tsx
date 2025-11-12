'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Mock данные тикетов
const mockTickets = [
  {
    id: 'TICKET-001',
    title: 'Не работает экспорт данных в Excel',
    description: 'При попытке экспортировать список клиентов в Excel, система выдает ошибку',
    status: 'open',
    priority: 'high',
    category: 'bug',
    createdAt: new Date(2024, 10, 10),
    updatedAt: new Date(2024, 10, 11),
    createdBy: 'Иван Петров',
    assignedTo: null,
    responses: 2,
  },
  {
    id: 'TICKET-002',
    title: 'Добавить возможность массовой рассылки SMS',
    description: 'Нужна функция для отправки SMS уведомлений всем клиентам',
    status: 'in_progress',
    priority: 'medium',
    category: 'feature',
    createdAt: new Date(2024, 10, 9),
    updatedAt: new Date(2024, 10, 11),
    createdBy: 'Мария Сидорова',
    assignedTo: 'Техподдержка',
    responses: 5,
  },
  {
    id: 'TICKET-003',
    title: 'Как настроить автоматические напоминания?',
    description: 'Не могу найти настройки для автоматических напоминаний клиентам',
    status: 'resolved',
    priority: 'low',
    category: 'question',
    createdAt: new Date(2024, 10, 8),
    updatedAt: new Date(2024, 10, 10),
    createdBy: 'Алексей Смирнов',
    assignedTo: 'Техподдержка',
    responses: 3,
  },
  {
    id: 'TICKET-004',
    title: 'Ошибка при создании заказ-наряда',
    description: 'При добавлении более 10 услуг в заказ-наряд, страница зависает',
    status: 'open',
    priority: 'high',
    category: 'bug',
    createdAt: new Date(2024, 10, 11),
    updatedAt: new Date(2024, 10, 11),
    createdBy: 'Дмитрий Козлов',
    assignedTo: null,
    responses: 1,
  },
  {
    id: 'TICKET-005',
    title: 'Интеграция с 1С',
    description: 'Нужна интеграция с 1С для синхронизации данных о клиентах и заказах',
    status: 'closed',
    priority: 'medium',
    category: 'feature',
    createdAt: new Date(2024, 10, 5),
    updatedAt: new Date(2024, 10, 9),
    createdBy: 'Елена Волкова',
    assignedTo: 'Техподдержка',
    responses: 8,
  },
]

export default function SupportPage() {
  const [filterStatus, setFilterStatus] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4" />
      case 'closed':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыт'
      case 'in_progress':
        return 'В работе'
      case 'resolved':
        return 'Решен'
      case 'closed':
        return 'Закрыт'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'resolved':
        return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300'
      case 'closed':
        return 'bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-300'
      default:
        return ''
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Низкий'
      case 'medium':
        return 'Средний'
      case 'high':
        return 'Высокий'
      default:
        return priority
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-gray-600 dark:text-gray-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'high':
        return 'text-red-600 dark:text-red-400'
      default:
        return ''
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bug':
        return 'Ошибка'
      case 'feature':
        return 'Новая функция'
      case 'question':
        return 'Вопрос'
      default:
        return category
    }
  }

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesSearch =
      searchQuery === '' ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Тикет создан', {
      description: 'Ваш запрос принят в работу. Мы свяжемся с вами в ближайшее время.',
    })
    setIsCreateDialogOpen(false)
  }

  const openTickets = mockTickets.filter((t) => t.status === 'open').length
  const inProgressTickets = mockTickets.filter((t) => t.status === 'in_progress').length
  const resolvedTickets = mockTickets.filter((t) => t.status === 'resolved').length

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Поддержка</h2>
          <p className="text-muted-foreground">
            Управляйте запросами в службу поддержки
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать тикет
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleCreateTicket}>
              <DialogHeader>
                <DialogTitle>Новый тикет</DialogTitle>
                <DialogDescription>
                  Опишите вашу проблему или вопрос. Мы постараемся помочь как можно скорее.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Тема</Label>
                  <Input
                    id="title"
                    placeholder="Краткое описание проблемы"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Ошибка</SelectItem>
                      <SelectItem value="feature">Новая функция</SelectItem>
                      <SelectItem value="question">Вопрос</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select required defaultValue="medium">
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Подробно опишите проблему..."
                    rows={5}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Создать</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Открыто</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">
              тикетов ожидают ответа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTickets}</div>
            <p className="text-xs text-muted-foreground">
              тикетов в обработке
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Решено</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              тикетов решено
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Список тикетов */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Тикеты</CardTitle>
              <CardDescription>
                Все запросы в службу поддержки
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или номеру тикета..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="open">Открыт</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="resolved">Решен</SelectItem>
                <SelectItem value="closed">Закрыт</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Тема</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Приоритет</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Ответы</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Тикеты не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.createdBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                      <TableCell>
                        <span className={getPriorityColor(ticket.priority)}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            {getStatusLabel(ticket.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          {ticket.responses}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(ticket.createdAt, 'd MMM yyyy', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Просмотр
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
