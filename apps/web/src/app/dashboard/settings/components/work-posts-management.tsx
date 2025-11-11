'use client'

import * as React from 'react'
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
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
import { AddWorkPostDialog } from './add-work-post-dialog'
import { EditWorkPostDialog } from './edit-work-post-dialog'

// Mock данные рабочих постов
const mockWorkPosts = [
  {
    id: '1',
    name: 'Пост 1',
    description: 'Общий ремонт',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Пост 2',
    description: 'Диагностика и электрика',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Пост 3',
    description: 'Кузовные работы',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Пост 4',
    description: 'Шиномонтаж',
    status: 'inactive',
    createdAt: new Date('2024-01-15'),
  },
]

export function WorkPostsManagement() {
  const [workPosts, setWorkPosts] = React.useState(mockWorkPosts)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedPost, setSelectedPost] = React.useState<typeof mockWorkPosts[0] | null>(null)

  const activePostsCount = workPosts.filter(p => p.status === 'active').length

  const handleAddPost = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPost = {
      id: String(workPosts.length + 1),
      ...data,
      status: 'active',
      createdAt: new Date(),
    }

    setWorkPosts([...workPosts, newPost])
    toast.success('Рабочий пост добавлен', {
      description: `${data.name} успешно добавлен`,
    })
  }

  const handleEditPost = async (data: any) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setWorkPosts(workPosts.map(p =>
      p.id === selectedPost?.id ? { ...p, ...data } : p
    ))

    toast.success('Рабочий пост обновлен', {
      description: `${data.name} успешно обновлен`,
    })
  }

  const handleToggleStatus = async (post: typeof mockWorkPosts[0]) => {
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newStatus = post.status === 'active' ? 'inactive' : 'active'
      setWorkPosts(workPosts.map(p =>
        p.id === post.id ? { ...p, status: newStatus } : p
      ))

      toast.success(
        newStatus === 'active' ? 'Пост активирован' : 'Пост деактивирован'
      )
    } catch (error) {
      toast.error('Ошибка при изменении статуса')
    }
  }

  const handleDeletePost = async (post: typeof mockWorkPosts[0]) => {
    if (!confirm(`Вы уверены, что хотите удалить "${post.name}"?`)) {
      return
    }

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setWorkPosts(workPosts.filter(p => p.id !== post.id))
      toast.success('Рабочий пост удален')
    } catch (error) {
      toast.error('Ошибка при удалении поста')
    }
  }

  const handleEditClick = (post: typeof mockWorkPosts[0]) => {
    setSelectedPost(post)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего постов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workPosts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Активных постов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePostsCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Рабочие посты</CardTitle>
              <CardDescription>
                Управление рабочими постами автосервиса
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить пост
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Рабочие посты не найдены
                  </TableCell>
                </TableRow>
              ) : (
                workPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.description || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'active' ? 'default' : 'secondary'}>
                        {post.status === 'active' ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(post)}
                          title={
                            post.status === 'active'
                              ? 'Деактивировать'
                              : 'Активировать'
                          }
                        >
                          {post.status === 'active' ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePost(post)}
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
      <AddWorkPostDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddPost}
      />

      {selectedPost && (
        <EditWorkPostDialog
          post={selectedPost}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleEditPost}
        />
      )}
    </div>
  )
}
