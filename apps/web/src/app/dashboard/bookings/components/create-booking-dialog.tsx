'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreateBookingInput, Client, Vehicle, Service, User, WorkPost } from '@/lib/types'

const bookingSchema = z.object({
  clientId: z.string().min(1, { message: 'Выберите клиента' }),
  vehicleId: z.string().min(1, { message: 'Выберите автомобиль' }),
  serviceId: z.string().min(1, { message: 'Выберите услугу' }),
  masterId: z.string().optional(),
  workPostId: z.string().optional(),
  notes: z.string().optional(),
})

interface CreateBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  selectedTime: string
  clients: Client[]
  vehicles: Vehicle[]
  services: Service[]
  masters: User[]
  workPosts: WorkPost[]
  onSubmit: (data: CreateBookingInput) => Promise<void>
}

export function CreateBookingDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  clients,
  vehicles,
  services,
  masters,
  workPosts,
  onSubmit,
}: CreateBookingDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedClientVehicles, setSelectedClientVehicles] = React.useState<Vehicle[]>([])

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientId: '',
      vehicleId: '',
      serviceId: '',
      masterId: '',
      workPostId: '',
      notes: '',
    },
  })

  // Фильтруем автомобили выбранного клиента
  const clientId = form.watch('clientId')
  React.useEffect(() => {
    if (clientId) {
      const clientVehicles = vehicles.filter((v) => v.clientId === clientId)
      setSelectedClientVehicles(clientVehicles)
      // Сбрасываем выбранный автомобиль если он не принадлежит новому клиенту
      const currentVehicle = form.getValues('vehicleId')
      if (currentVehicle && !clientVehicles.find((v) => v.id === currentVehicle)) {
        form.setValue('vehicleId', '')
      }
    }
  }, [clientId, vehicles, form])

  // Вычисляем endTime на основе длительности услуги
  const serviceId = form.watch('serviceId')
  const selectedService = services.find((s) => s.id === serviceId)
  const serviceDuration = selectedService?.duration || 60

  async function handleSubmit(values: z.infer<typeof bookingSchema>) {
    setIsLoading(true)
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const startTime = new Date(selectedDate)
      startTime.setHours(hours, minutes, 0, 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + serviceDuration)

      await onSubmit({
        ...values,
        startTime,
        endTime,
        masterId: values.masterId || undefined,
        workPostId: values.workPostId || undefined,
        notes: values.notes || undefined,
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Создать запись</DialogTitle>
          <DialogDescription>
            {format(selectedDate, 'd MMMM yyyy', { locale: ru })} в {selectedTime}
            {selectedService && ` (${serviceDuration} мин)`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Клиент *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите клиента" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Автомобиль *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!clientId || selectedClientVehicles.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите автомобиль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedClientVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} ({vehicle.plateNumber || 'Без номера'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Услуга *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ₽{service.price} ({service.duration} мин)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="masterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мастер</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Любой мастер" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {masters.map((master) => (
                          <SelectItem key={master.id} value={master.id}>
                            {master.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workPostId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Рабочий пост</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Любой пост" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workPosts.map((post) => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заметки</FormLabel>
                  <FormControl>
                    <Input placeholder="Дополнительная информация" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Создание...' : 'Создать запись'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
