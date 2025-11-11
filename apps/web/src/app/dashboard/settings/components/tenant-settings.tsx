'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Upload, Save } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const tenantSchema = z.object({
  name: z.string().min(2, { message: 'Название должно содержать минимум 2 символа' }),
  legalName: z.string().optional(),
  inn: z.string().optional(),
  phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  address: z.string().optional(),
  description: z.string().optional(),
  workingHoursWeekday: z.string().optional(),
  workingHoursWeekend: z.string().optional(),
})

// Mock данные
const mockTenantData = {
  name: 'Автосервис №1',
  legalName: 'ООО "Автосервис Номер Один"',
  inn: '7707123456',
  phone: '+7 (499) 123-45-67',
  email: 'info@autoservice1.ru',
  address: 'г. Москва, ул. Автомобильная, д. 1',
  description: 'Профессиональный автосервис с опытом работы более 10 лет',
  workingHoursWeekday: '09:00 - 20:00',
  workingHoursWeekend: '10:00 - 18:00',
}

export function TenantSettings() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: mockTenantData,
  })

  async function onSubmit(values: z.infer<typeof tenantSchema>) {
    setIsLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Настройки сохранены', {
        description: 'Информация об организации успешно обновлена',
      })
    } catch (error) {
      toast.error('Ошибка при сохранении настроек')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('Логотип загружен', {
        description: 'Не забудьте сохранить изменения',
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>
            Настройки организации и контактная информация
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <FormLabel>Логотип</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Загрузить логотип
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG до 2MB
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название *</FormLabel>
                      <FormControl>
                        <Input placeholder="Автосервис №1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Отображается в интерфейсе
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Юридическое название</FormLabel>
                      <FormControl>
                        <Input placeholder="ООО &quot;Автосервис&quot;" {...field} />
                      </FormControl>
                      <FormDescription>
                        Для документов
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ИНН</FormLabel>
                    <FormControl>
                      <Input placeholder="7707123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон *</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 (499) 123-45-67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="info@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="г. Москва, ул. Автомобильная, д. 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Краткое описание автосервиса..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Краткая информация о вашем автосервисе
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Режим работы</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="workingHoursWeekday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Будние дни (ПН-ПТ)</FormLabel>
                        <FormControl>
                          <Input placeholder="09:00 - 20:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingHoursWeekend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Выходные (СБ-ВС)</FormLabel>
                        <FormControl>
                          <Input placeholder="10:00 - 18:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
