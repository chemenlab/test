'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface NotificationSettings {
  newBooking: boolean
  bookingReminder: boolean
  newOrder: boolean
  orderCompleted: boolean
  lowStock: boolean
  newClient: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

const defaultSettings: NotificationSettings = {
  newBooking: true,
  bookingReminder: true,
  newOrder: true,
  orderCompleted: true,
  lowStock: true,
  newClient: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
}

export function NotificationSettings() {
  const [settings, setSettings] = React.useState<NotificationSettings>(defaultSettings)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Настройки уведомлений сохранены')
    } catch (error) {
      toast.error('Ошибка при сохранении настроек')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Уведомления о событиях</CardTitle>
          <CardDescription>
            Выберите события, о которых вы хотите получать уведомления
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-booking">Новая запись</Label>
              <p className="text-sm text-muted-foreground">
                Уведомление при создании новой записи
              </p>
            </div>
            <Switch
              id="new-booking"
              checked={settings.newBooking}
              onCheckedChange={() => handleToggle('newBooking')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="booking-reminder">Напоминание о записи</Label>
              <p className="text-sm text-muted-foreground">
                Напоминание за 1 час до записи
              </p>
            </div>
            <Switch
              id="booking-reminder"
              checked={settings.bookingReminder}
              onCheckedChange={() => handleToggle('bookingReminder')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-order">Новый заказ</Label>
              <p className="text-sm text-muted-foreground">
                Уведомление при создании нового заказа-наряда
              </p>
            </div>
            <Switch
              id="new-order"
              checked={settings.newOrder}
              onCheckedChange={() => handleToggle('newOrder')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-completed">Заказ завершен</Label>
              <p className="text-sm text-muted-foreground">
                Уведомление при завершении заказа-наряда
              </p>
            </div>
            <Switch
              id="order-completed"
              checked={settings.orderCompleted}
              onCheckedChange={() => handleToggle('orderCompleted')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-stock">Низкий остаток на складе</Label>
              <p className="text-sm text-muted-foreground">
                Предупреждение когда запчасти заканчиваются
              </p>
            </div>
            <Switch
              id="low-stock"
              checked={settings.lowStock}
              onCheckedChange={() => handleToggle('lowStock')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-client">Новый клиент</Label>
              <p className="text-sm text-muted-foreground">
                Уведомление при регистрации нового клиента
              </p>
            </div>
            <Switch
              id="new-client"
              checked={settings.newClient}
              onCheckedChange={() => handleToggle('newClient')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Каналы уведомлений</CardTitle>
          <CardDescription>
            Выберите способы получения уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления на электронную почту
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления по SMS
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления в браузере
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </div>
    </div>
  )
}
