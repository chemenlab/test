'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar, Clock, User, Car, Wrench, MapPin, FileText, X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Booking } from '@/lib/types'

interface BookingDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: Booking | null
  onEdit: (booking: Booking) => void
  onCancel: (booking: Booking) => void
  onComplete: (booking: Booking) => void
}

export function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
  onEdit,
  onCancel,
  onComplete,
}: BookingDetailsDialogProps) {
  if (!booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'canceled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает подтверждения'
      case 'confirmed':
        return 'Подтверждено'
      case 'in_progress':
        return 'В работе'
      case 'completed':
        return 'Завершено'
      case 'canceled':
        return 'Отменено'
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Детали записи</DialogTitle>
              <DialogDescription>
                Запись №{booking.id.slice(0, 8)}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(new Date(booking.startTime), 'd MMMM yyyy', { locale: ru })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.startTime), 'EEEE', { locale: ru })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                  {format(new Date(booking.endTime), 'HH:mm')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (new Date(booking.endTime).getTime() -
                      new Date(booking.startTime).getTime()) /
                      60000
                  )}{' '}
                  минут
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Client Info */}
          {booking.client && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Клиент</h4>
              </div>
              <div className="ml-6">
                <p className="font-medium">{booking.client.name}</p>
                <p className="text-sm text-muted-foreground">{booking.client.phone}</p>
                {booking.client.email && (
                  <p className="text-sm text-muted-foreground">{booking.client.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Info */}
          {booking.vehicle && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Автомобиль</h4>
              </div>
              <div className="ml-6">
                <p className="font-medium">
                  {booking.vehicle.brand} {booking.vehicle.model}
                </p>
                {booking.vehicle.plateNumber && (
                  <p className="text-sm text-muted-foreground font-mono">
                    {booking.vehicle.plateNumber}
                  </p>
                )}
                {booking.vehicle.year && (
                  <p className="text-sm text-muted-foreground">{booking.vehicle.year} год</p>
                )}
              </div>
            </div>
          )}

          {/* Service Info */}
          {booking.service && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Услуга</h4>
              </div>
              <div className="ml-6">
                <p className="font-medium">{booking.service.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₽{booking.service.price.toLocaleString('ru-RU')} • {booking.service.duration}{' '}
                  минут
                </p>
              </div>
            </div>
          )}

          {/* Master Info */}
          {booking.master && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Мастер</h4>
              </div>
              <div className="ml-6">
                <p className="font-medium">{booking.master.name}</p>
              </div>
            </div>
          )}

          {/* Work Post Info */}
          {booking.workPost && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Рабочий пост</h4>
              </div>
              <div className="ml-6">
                <p className="font-medium">{booking.workPost.name}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Заметки</h4>
              </div>
              <div className="ml-6">
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {booking.status !== 'canceled' && booking.status !== 'completed' && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onEdit(booking)
                  onOpenChange(false)
                }}
              >
                Редактировать
              </Button>
              {booking.status === 'confirmed' && (
                <Button
                  type="button"
                  onClick={() => {
                    onComplete(booking)
                    onOpenChange(false)
                  }}
                >
                  Начать работу
                </Button>
              )}
              {booking.status === 'in_progress' && (
                <Button
                  type="button"
                  onClick={() => {
                    onComplete(booking)
                    onOpenChange(false)
                  }}
                >
                  Завершить
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onCancel(booking)
                  onOpenChange(false)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Отменить запись
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
