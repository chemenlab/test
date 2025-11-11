'use client'

import * as React from 'react'
import Link from 'next/link'
import { Calendar, Clock, Phone, Mail, User, Car, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfDay, setHours, setMinutes, isSameDay, isAfter, isBefore } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Mock данные доступных услуг
const mockServices = [
  { id: '1', name: 'Замена масла', duration: 30, price: 1500 },
  { id: '2', name: 'Диагностика подвески', duration: 60, price: 1000 },
  { id: '3', name: 'Замена тормозных колодок', duration: 90, price: 2500 },
  { id: '4', name: 'Компьютерная диагностика', duration: 30, price: 800 },
  { id: '5', name: 'Шиномонтаж (4 колеса)', duration: 60, price: 2000 },
  { id: '6', name: 'Замена масла + фильтры', duration: 45, price: 2000 },
  { id: '7', name: 'Развал-схождение', duration: 60, price: 1800 },
  { id: '8', name: 'Замена свечей зажигания', duration: 45, price: 1200 },
]

// Генерация доступных временных слотов
const generateTimeSlots = (date: Date) => {
  const slots = []
  const workStart = 9 // 9:00
  const workEnd = 18 // 18:00
  const slotDuration = 30 // минут

  for (let hour = workStart; hour < workEnd; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTime = setMinutes(setHours(startOfDay(date), hour), minute)
      slots.push({
        time: slotTime,
        label: format(slotTime, 'HH:mm'),
        available: Math.random() > 0.3, // Случайная доступность для демо
      })
    }
  }

  return slots
}

export default function PublicBookingPage() {
  const [step, setStep] = React.useState<number>(1)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)
  const [selectedServices, setSelectedServices] = React.useState<string[]>([])

  // Форма клиента
  const [clientName, setClientName] = React.useState('')
  const [clientPhone, setClientPhone] = React.useState('')
  const [clientEmail, setClientEmail] = React.useState('')

  // Данные автомобиля
  const [vehicleBrand, setVehicleBrand] = React.useState('')
  const [vehicleModel, setVehicleModel] = React.useState('')
  const [vehicleYear, setVehicleYear] = React.useState('')
  const [vehiclePlate, setVehiclePlate] = React.useState('')

  const [notes, setNotes] = React.useState('')

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Генерация календаря на неделю вперед
  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
  }, [])

  const timeSlots = React.useMemo(() => {
    return generateTimeSlots(selectedDate)
  }, [selectedDate])

  // Выбранные услуги с деталями
  const selectedServicesDetails = React.useMemo(() => {
    return mockServices.filter(s => selectedServices.includes(s.id))
  }, [selectedServices])

  // Общая стоимость и длительность
  const totalPrice = selectedServicesDetails.reduce((sum, s) => sum + s.price, 0)
  const totalDuration = selectedServicesDetails.reduce((sum, s) => sum + s.duration, 0)

  // Переключение выбора услуги
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  // Переход к следующему шагу
  const handleNextStep = () => {
    if (step === 1 && selectedServices.length === 0) {
      toast.error('Выберите хотя бы одну услугу')
      return
    }
    if (step === 2 && !selectedTime) {
      toast.error('Выберите время записи')
      return
    }
    setStep(step + 1)
  }

  // Отправка заявки
  const handleSubmit = async () => {
    if (!clientName || !clientPhone || !vehicleBrand || !vehicleModel) {
      toast.error('Заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Запись создана!', {
        description: 'Мы свяжемся с вами для подтверждения',
      })

      // Сброс формы
      setStep(1)
      setSelectedServices([])
      setSelectedDate(new Date())
      setSelectedTime(null)
      setClientName('')
      setClientPhone('')
      setClientEmail('')
      setVehicleBrand('')
      setVehicleModel('')
      setVehicleYear('')
      setVehiclePlate('')
      setNotes('')
    } catch (error) {
      toast.error('Ошибка при создании записи')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AutoCRM</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Онлайн запись</h2>
          <p className="text-muted-foreground">
            Выберите услугу и удобное время для посещения нашего автосервиса
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Услуги</span>
            </div>
            <div className="h-px w-12 bg-muted"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Дата и время</span>
            </div>
            <div className="h-px w-12 bg-muted"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Контакты</span>
            </div>
          </div>
        </div>

        {/* Step 1: Выбор услуг */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Выберите услуги</CardTitle>
              <CardDescription>
                Отметьте все необходимые услуги
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {mockServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedServices.includes(service.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration} мин
                          </span>
                          <span className="font-semibold text-foreground">
                            ₽{service.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                        selectedServices.includes(service.id)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedServices.includes(service.id) && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Всего:</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₽{totalPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Примерно {totalDuration} мин
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleNextStep} disabled={selectedServices.length === 0} size="lg">
                  Далее
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Выбор даты и времени */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Выберите дату и время</CardTitle>
              <CardDescription>
                Выберите удобные дату и время посещения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Выбор даты */}
              <div>
                <Label className="mb-3 block">Дата</Label>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const isSelected = isSameDay(day, selectedDate)
                    const isPast = isBefore(day, startOfDay(new Date()))

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => !isPast && setSelectedDate(day)}
                        disabled={isPast}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : isPast
                            ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <div className="text-xs">{format(day, 'EEE', { locale: ru })}</div>
                        <div className="text-lg font-bold">{format(day, 'd')}</div>
                        <div className="text-xs">{format(day, 'MMM', { locale: ru })}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Выбор времени */}
              <div>
                <Label className="mb-3 block">Время</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime && isSameDay(slot.time, selectedTime) && format(slot.time, 'HH:mm') === format(selectedTime, 'HH:mm')

                    return (
                      <button
                        key={slot.label}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : !slot.available
                            ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {slot.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedTime && (
                <div className="p-4 bg-primary/5 border-2 border-primary rounded-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">
                      {format(selectedDate, 'd MMMM yyyy', { locale: ru })} в {format(selectedTime, 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>
                <Button onClick={handleNextStep} disabled={!selectedTime} size="lg">
                  Далее
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Контактная информация */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Ваши контактные данные</CardTitle>
              <CardDescription>
                Заполните информацию о себе и автомобиле
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Клиент */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Контактная информация
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      placeholder="Ваше имя"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email (необязательно)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Автомобиль */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Информация об автомобиле
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Марка *</Label>
                    <Input
                      id="brand"
                      placeholder="Toyota"
                      value={vehicleBrand}
                      onChange={(e) => setVehicleBrand(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Модель *</Label>
                    <Input
                      id="model"
                      placeholder="Camry"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Год выпуска</Label>
                    <Input
                      id="year"
                      placeholder="2020"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">Гос. номер</Label>
                    <Input
                      id="plate"
                      placeholder="А123БВ"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Примечания</Label>
                    <Textarea
                      id="notes"
                      placeholder="Дополнительная информация или пожелания..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Сводка */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-semibold">Сводка записи</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата и время:</span>
                    <span className="font-medium">
                      {selectedTime && format(selectedTime, 'd MMM yyyy, HH:mm', { locale: ru })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Услуги:</span>
                    <span className="font-medium">{selectedServices.length} шт.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Длительность:</span>
                    <span className="font-medium">{totalDuration} мин</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Стоимость:</span>
                    <span className="font-bold">₽{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                  {isSubmitting ? 'Отправка...' : 'Записаться'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Свяжитесь с нами:</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="tel:+74951234567" className="flex items-center gap-1 hover:text-primary">
              <Phone className="h-4 w-4" />
              +7 (495) 123-45-67
            </a>
            <a href="mailto:info@autocrm.ru" className="flex items-center gap-1 hover:text-primary">
              <Mail className="h-4 w-4" />
              info@autocrm.ru
            </a>
          </div>
          <p className="mt-4">
            <Link href="/dashboard" className="text-primary hover:underline">
              Вход для сотрудников
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
