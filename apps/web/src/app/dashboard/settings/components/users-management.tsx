'use client'

import * as React from 'react'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { AddUserDialog } from './add-user-dialog'
import { EditUserDialog } from './edit-user-dialog'

// Mock данные пользователей
const mockUsers = [
  {
    id: '1',
    name: 'Дмитрий Иванов',
    email: 'dmitry@example.com',
    phone: '+7 (999) 111-11-11',
    role: 'mechanic',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Алексей Петров',
    email: 'alexey@example.com',
    phone: '+7 (999) 222-22-22',
    role: 'mechanic',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 333-33-33',
    role: 'manager',
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Сергей Козлов',
    email: 'sergey@example.com',
    phone: '+7 (999) 444-44-44',
    role: 'mechanic',
    status: 'inactive',
    createdAt: new Date('2023-12-01'),
  },
]

export function UsersManagement() {
  const [users, setUsers] = React.useState(mockUsers)
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<typeof mockUsers[0] | null>(null)

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'mechanic':
        return 'Мастер'
      case 'manager':
        return 'Менеджер'
      case 'admin':
        return 'Администратор'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-900'
      case 'manager':
        return 'bg-blue-100 text-blue-900'
      case 'mechanic':
        return 'bg-green-100 text-green-900'
      default:
        return ''
    }
  }

  const filteredUsers = users.filter((user) => {
    return roleFilter === 'all' || user.role === roleFilter
  })

  const activeUsers = users.filter(u => u.status === 'active')
  const mechanicsCount = users.filter(u => u.role === 'mechanic' && u.status === 'active').length
  const managersCount = users.filter(u => u.role === 'manager' && u.status === 'active').length

  const handleAddUser = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newUser = {
      id: String(users.length + 1),
      ...data,
      status: 'active',
      createdAt: new Date(),
    }

    setUsers([...users, newUser])
    toast.success('Пользователь добавлен', {
      description: `${data.name} успешно добавлен в систему`,
    })
  }

  const handleEditUser = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setUsers(users.map(u =>
      u.id === selectedUser?.id ? { ...u, ...data } : u
    ))

    toast.success('Пользователь обновлен', {
      description: `Данные ${data.name} успешно обновлены`,
    })
  }

  const handleToggleStatus = async (user: typeof mockUsers[0]) => {
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ))

      toast.success(
        newStatus === 'active' ? 'Пользователь активирован' : 'Пользователь деактивирован'
      )
    } catch (error) {
      toast.error('Ошибка при изменении статуса')
    }
  }

  const handleDeleteUser = async (user: typeof mockUsers[0]) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) {
      return
    }

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUsers(users.filter(u => u.id !== user.id))
      toast.success('Пользователь удален')
    } catch (error) {
      toast.error('Ошибка при удалении пользователя')
    }
  }

  const handleEditClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего активных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Мастеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mechanicsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Менеджеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managersCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Пользователи</CardTitle>
              <CardDescription>
                Управление мастерами и менеджерами автосервиса
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить пользователя
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Фильтр по роли" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="mechanic">Мастера</SelectItem>
                <SelectItem value="manager">Менеджеры</SelectItem>
                <SelectItem value="admin">Администраторы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-mono text-sm">{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(user)}
                          title={
                            user.status === 'active'
                              ? 'Деактивировать'
                              : 'Активировать'
                          }
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user)}
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
      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddUser}
      />

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleEditUser}
        />
      )}
    </div>
  )
}
