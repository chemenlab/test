'use client'

import * as React from 'react'
import { Package, Database, Search, Mail, Save, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

// Mock данные API интеграций
const mockIntegrations = {
  emex: {
    enabled: false,
    apiKey: '',
    endpoint: 'https://api.emex.ru',
  },
  exist: {
    enabled: false,
    login: '',
    password: '',
    endpoint: 'https://api.exist.ru',
  },
  avtotek: {
    enabled: false,
    apiKey: '',
    endpoint: 'https://api.avtoteka.com',
  },
}

// Mock данные нормо-часов
const mockLaborRates = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: '2018-2024',
    operation: 'Замена масла двигателя',
    hours: 0.5,
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Camry',
    year: '2018-2024',
    operation: 'Замена тормозных колодок передних',
    hours: 1.2,
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'X5',
    year: '2019-2024',
    operation: 'Замена масла двигателя',
    hours: 0.7,
  },
]

// Mock шаблоны уведомлений
const mockNotificationTemplates = [
  {
    id: '1',
    type: 'sms',
    name: 'Заказ принят',
    trigger: 'order_created',
    template: 'Добрый день, {client_name}! Ваш заказ №{order_number} принят. Ожидаемая дата готовности: {completion_date}',
    enabled: true,
  },
  {
    id: '2',
    type: 'sms',
    name: 'Заказ готов',
    trigger: 'order_completed',
    template: 'Ваш {vehicle} готов к выдаче. Сумма к оплате: {total} руб. Ждем Вас!',
    enabled: true,
  },
  {
    id: '3',
    type: 'email',
    name: 'Заказ принят (Email)',
    trigger: 'order_created',
    template: 'Здравствуйте, {client_name}!\n\nВаш заказ-наряд №{order_number} принят в работу.\nАвтомобиль: {vehicle}\nОжидаемая дата: {completion_date}\n\nС уважением,\nАвтосервис',
    enabled: false,
  },
]

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = React.useState(mockIntegrations)
  const [laborRates, setLaborRates] = React.useState(mockLaborRates)
  const [templates, setTemplates] = React.useState(mockNotificationTemplates)
  const [addLaborDialogOpen, setAddLaborDialogOpen] = React.useState(false)
  const [editTemplateDialogOpen, setEditTemplateDialogOpen] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null)

  // Сохранение настроек API
  const handleSaveIntegration = async (provider: string) => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Интеграция сохранена', {
      description: `Настройки ${provider.toUpperCase()} успешно сохранены`,
    })
  }

  // Переключение статуса интеграции
  const handleToggleIntegration = (provider: keyof typeof integrations) => {
    setIntegrations({
      ...integrations,
      [provider]: {
        ...integrations[provider],
        enabled: !integrations[provider].enabled,
      },
    })
  }

  // Удаление нормо-часа
  const handleDeleteLaborRate = (id: string) => {
    setLaborRates(laborRates.filter(r => r.id !== id))
    toast.success('Запись удалена')
  }

  // Сохранение шаблона
  const handleSaveTemplate = async () => {
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setEditTemplateDialogOpen(false)
    toast.success('Шаблон сохранен')
  }

  // Переключение статуса шаблона
  const handleToggleTemplate = (id: string) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ))
  }

  return (
    <div className="space-y-6">
      {/* API поставщиков */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <div>
              <CardTitle>API поставщиков запчастей</CardTitle>
              <CardDescription>
                Интеграция с системами поиска и заказа автозапчастей
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emex */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Emex.ru</h3>
                <Badge variant={integrations.emex.enabled ? 'default' : 'secondary'}>
                  {integrations.emex.enabled ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              <Switch
                checked={integrations.emex.enabled}
                onCheckedChange={() => handleToggleIntegration('emex')}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emex-key">API ключ</Label>
                <Input
                  id="emex-key"
                  type="password"
                  placeholder="Введите API ключ"
                  value={integrations.emex.apiKey}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      emex: { ...integrations.emex, apiKey: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emex-endpoint">Endpoint</Label>
                <Input
                  id="emex-endpoint"
                  placeholder="https://api.emex.ru"
                  value={integrations.emex.endpoint}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      emex: { ...integrations.emex, endpoint: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={() => handleSaveIntegration('emex')} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>

          {/* Exist.ru */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Exist.ru</h3>
                <Badge variant={integrations.exist.enabled ? 'default' : 'secondary'}>
                  {integrations.exist.enabled ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              <Switch
                checked={integrations.exist.enabled}
                onCheckedChange={() => handleToggleIntegration('exist')}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exist-login">Логин</Label>
                <Input
                  id="exist-login"
                  placeholder="Логин"
                  value={integrations.exist.login}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      exist: { ...integrations.exist, login: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exist-password">Пароль</Label>
                <Input
                  id="exist-password"
                  type="password"
                  placeholder="Пароль"
                  value={integrations.exist.password}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      exist: { ...integrations.exist, password: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={() => handleSaveIntegration('exist')} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>

          {/* Автотека */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Автотека (VIN)</h3>
                <Badge variant={integrations.avtotek.enabled ? 'default' : 'secondary'}>
                  {integrations.avtotek.enabled ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              <Switch
                checked={integrations.avtotek.enabled}
                onCheckedChange={() => handleToggleIntegration('avtotek')}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avtotek-key">API ключ</Label>
                <Input
                  id="avtotek-key"
                  type="password"
                  placeholder="Введите API ключ"
                  value={integrations.avtotek.apiKey}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      avtotek: { ...integrations.avtotek, apiKey: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avtotek-endpoint">Endpoint</Label>
                <Input
                  id="avtotek-endpoint"
                  placeholder="https://api.avtoteka.com"
                  value={integrations.avtotek.endpoint}
                  onChange={(e) =>
                    setIntegrations({
                      ...integrations,
                      avtotek: { ...integrations.avtotek, endpoint: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={() => handleSaveIntegration('avtotek')} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Справочник нормо-часов */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <div>
                <CardTitle>Справочник нормо-часов</CardTitle>
                <CardDescription>
                  Нормативы времени на выполнение работ
                </CardDescription>
              </div>
            </div>
            <Dialog open={addLaborDialogOpen} onOpenChange={setAddLaborDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить нормо-час</DialogTitle>
                  <DialogDescription>
                    Укажите марку, модель и тип работы
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Марка</Label>
                    <Input placeholder="Toyota" />
                  </div>
                  <div className="space-y-2">
                    <Label>Модель</Label>
                    <Input placeholder="Camry" />
                  </div>
                  <div className="space-y-2">
                    <Label>Годы</Label>
                    <Input placeholder="2018-2024" />
                  </div>
                  <div className="space-y-2">
                    <Label>Операция</Label>
                    <Input placeholder="Замена масла" />
                  </div>
                  <div className="space-y-2">
                    <Label>Нормо-часы</Label>
                    <Input type="number" step="0.1" placeholder="0.5" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddLaborDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => {
                    setAddLaborDialogOpen(false)
                    toast.success('Нормо-час добавлен')
                  }}>
                    Добавить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Марка</TableHead>
                <TableHead>Модель</TableHead>
                <TableHead>Годы</TableHead>
                <TableHead>Операция</TableHead>
                <TableHead className="text-right">Часы</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laborRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.brand}</TableCell>
                  <TableCell>{rate.model}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rate.year}
                  </TableCell>
                  <TableCell>{rate.operation}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {rate.hours} ч
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLaborRate(rate.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Шаблоны уведомлений */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <div>
              <CardTitle>Шаблоны уведомлений</CardTitle>
              <CardDescription>
                SMS и Email шаблоны для автоматической отправки клиентам
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.type.toUpperCase()}
                      </Badge>
                      {template.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Триггер: {template.trigger}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.enabled}
                      onCheckedChange={() => handleToggleTemplate(template.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setEditTemplateDialogOpen(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap">
                  {template.template}
                </div>
                <p className="text-xs text-muted-foreground">
                  Доступные переменные: {'{client_name}'}, {'{order_number}'}, {'{vehicle}'}, {'{total}'}, {'{completion_date}'}
                </p>
              </div>
            ))}
          </div>

          {/* Диалог редактирования шаблона */}
          <Dialog open={editTemplateDialogOpen} onOpenChange={setEditTemplateDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать шаблон</DialogTitle>
                <DialogDescription>
                  Измените текст шаблона уведомления
                </DialogDescription>
              </DialogHeader>
              {selectedTemplate && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input defaultValue={selectedTemplate.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Шаблон сообщения</Label>
                    <Textarea
                      rows={6}
                      defaultValue={selectedTemplate.template}
                      className="font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Используйте переменные: {'{client_name}'}, {'{order_number}'}, {'{vehicle}'}, {'{total}'}, {'{completion_date}'}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditTemplateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Сохранить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
