'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Save, Upload, Key } from 'lucide-react'

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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Введите текущий пароль' }),
  newPassword: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
  confirmPassword: z.string().min(6, { message: 'Подтвердите новый пароль' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

// Mock данные профиля
const mockProfileData = {
  name: 'Иван Петров',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  role: 'Администратор',
}

export function ProfileSettings() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockProfileData,
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Профиль обновлен', {
        description: 'Ваши данные успешно сохранены',
      })
    } catch (error) {
      toast.error('Ошибка при сохранении профиля')
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsPasswordLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Пароль изменен', {
        description: 'Ваш пароль успешно обновлен',
      })
      passwordForm.reset()
    } catch (error) {
      toast.error('Ошибка при изменении пароля')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('Фото загружено', {
        description: 'Не забудьте сохранить изменения',
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
          <CardDescription>
            Управление вашим профилем и контактными данными
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <FormLabel>Фото профиля</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-muted overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-2xl font-semibold">
                        {mockProfileData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Изменить фото
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG до 2MB
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя *</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ivan@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Используется для входа в систему
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон *</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Роль в системе</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockProfileData.role}
                </p>
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

      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
          <CardDescription>
            Изменение пароля для доступа к системе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текущий пароль *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Введите текущий пароль"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый пароль *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Минимум 6 символов"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтверждение пароля *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Повторите новый пароль"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordLoading}>
                  <Key className="mr-2 h-4 w-4" />
                  {isPasswordLoading ? 'Изменение...' : 'Изменить пароль'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
