'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Users,
  Calendar,
  FileText,
  Package,
  Settings,
  Wrench,
  BarChart3,
  Video,
  ExternalLink,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock данные категорий
const categories = [
  {
    id: 'getting-started',
    title: 'Начало работы',
    icon: BookOpen,
    description: 'Первые шаги в системе',
    articlesCount: 8,
  },
  {
    id: 'clients',
    title: 'Управление клиентами',
    icon: Users,
    description: 'Работа с базой клиентов',
    articlesCount: 12,
  },
  {
    id: 'bookings',
    title: 'Записи и расписание',
    icon: Calendar,
    description: 'Управление записями',
    articlesCount: 10,
  },
  {
    id: 'orders',
    title: 'Заказы-наряды',
    icon: FileText,
    description: 'Создание и управление заказами',
    articlesCount: 15,
  },
  {
    id: 'warehouse',
    title: 'Склад и запчасти',
    icon: Package,
    description: 'Учет товаров и материалов',
    articlesCount: 9,
  },
  {
    id: 'services',
    title: 'Услуги',
    icon: Wrench,
    description: 'Настройка прайс-листа',
    articlesCount: 7,
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    icon: BarChart3,
    description: 'Отчеты и статистика',
    articlesCount: 11,
  },
  {
    id: 'settings',
    title: 'Настройки',
    icon: Settings,
    description: 'Конфигурация системы',
    articlesCount: 14,
  },
]

// Mock данные популярных статей
const popularArticles = [
  {
    id: '1',
    title: 'Как создать первый заказ-наряд',
    category: 'Заказы-наряды',
    views: 1245,
    readTime: '5 мин',
    icon: FileText,
  },
  {
    id: '2',
    title: 'Добавление нового клиента в систему',
    category: 'Управление клиентами',
    views: 987,
    readTime: '3 мин',
    icon: Users,
  },
  {
    id: '3',
    title: 'Настройка онлайн-записи',
    category: 'Записи и расписание',
    views: 856,
    readTime: '7 мин',
    icon: Calendar,
  },
  {
    id: '4',
    title: 'Учет запчастей на складе',
    category: 'Склад и запчасти',
    views: 743,
    readTime: '6 мин',
    icon: Package,
  },
  {
    id: '5',
    title: 'Создание прайс-листа услуг',
    category: 'Услуги',
    views: 621,
    readTime: '4 мин',
    icon: Wrench,
  },
]

// Mock данные последних обновлений
const recentUpdates = [
  {
    id: '1',
    title: 'Новая функция экспорта данных',
    description: 'Добавлена возможность экспорта в Excel и PDF',
    date: new Date(2024, 10, 10),
  },
  {
    id: '2',
    title: 'Обновление интерфейса заказов',
    description: 'Улучшен дизайн и добавлены новые фильтры',
    date: new Date(2024, 10, 8),
  },
  {
    id: '3',
    title: 'Интеграция с SMS-сервисами',
    description: 'Автоматические уведомления клиентам',
    date: new Date(2024, 10, 5),
  },
]

// Mock данные видео-инструкций
const videoTutorials = [
  {
    id: '1',
    title: 'Обзор системы AutoCRM',
    duration: '12:34',
    thumbnail: '/placeholder-video.jpg',
  },
  {
    id: '2',
    title: 'Работа с заказами-нарядами',
    duration: '8:45',
    thumbnail: '/placeholder-video.jpg',
  },
  {
    id: '3',
    title: 'Настройка склада',
    duration: '15:20',
    thumbnail: '/placeholder-video.jpg',
  },
]

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const getRelativeDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
    return `${Math.floor(diffDays / 30)} месяцев назад`
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">База знаний</h2>
        <p className="text-muted-foreground">
          Инструкции и руководства по работе с AutoCRM
        </p>
      </div>

      {/* Поиск */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск статей, инструкций, видео..."
              className="pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все разделы</TabsTrigger>
          <TabsTrigger value="popular">Популярное</TabsTrigger>
          <TabsTrigger value="videos">Видео</TabsTrigger>
          <TabsTrigger value="updates">Обновления</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Категории */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{category.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {category.articlesCount} статей
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Быстрый старт */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрый старт</CardTitle>
              <CardDescription>
                Основные инструкции для начала работы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  { title: 'Регистрация и вход в систему', time: '2 мин' },
                  { title: 'Настройка профиля организации', time: '5 мин' },
                  { title: 'Добавление первого клиента', time: '3 мин' },
                  { title: 'Создание прайс-листа услуг', time: '7 мин' },
                  { title: 'Первый заказ-наряд', time: '5 мин' },
                ].map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {article.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Популярные статьи</CardTitle>
              <CardDescription>
                Самые просматриваемые инструкции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularArticles.map((article) => {
                  const Icon = article.icon
                  return (
                    <div
                      key={article.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {article.views} просмотров
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Видео-инструкции</CardTitle>
              <CardDescription>
                Обучающие видео по работе с системой
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videoTutorials.map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer overflow-hidden rounded-lg border hover:border-primary transition-colors"
                  >
                    <div className="relative aspect-video bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground group-hover:bg-primary transition-colors">
                          <Video className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние обновления</CardTitle>
              <CardDescription>
                Новые функции и улучшения системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold">{update.title}</h3>
                        <span className="text-sm text-muted-foreground shrink-0">
                          {getRelativeDate(update.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Нужна помощь? */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Не нашли ответ на свой вопрос?</CardTitle>
          <CardDescription>
            Наша служба поддержки всегда готова помочь
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Link href="/dashboard/support">
              <Button>
                Создать запрос в поддержку
              </Button>
            </Link>
            <Button variant="outline">
              Связаться с нами
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
