'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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
  FormDescription,
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

const partSchema = z.object({
  name: z.string().min(2, {
    message: 'Название должно содержать минимум 2 символа',
  }),
  article: z.string().min(1, {
    message: 'Артикул обязателен',
  }),
  brand: z.string().min(1, {
    message: 'Бренд обязателен',
  }),
  category: z.string().min(1, {
    message: 'Выберите категорию',
  }),
  price: z.number().min(0, {
    message: 'Розничная цена должна быть положительной',
  }),
  purchasePrice: z.number().min(0, {
    message: 'Закупочная цена должна быть положительной',
  }),
  quantity: z.number().min(0, {
    message: 'Количество не может быть отрицательным',
  }),
  minQuantity: z.number().min(0, {
    message: 'Минимальное количество не может быть отрицательным',
  }),
  unit: z.string().min(1, {
    message: 'Выберите единицу измерения',
  }),
})

interface AddPartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: z.infer<typeof partSchema>) => Promise<void>
}

export function AddPartDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPartDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof partSchema>>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: '',
      article: '',
      brand: '',
      category: '',
      price: 0,
      purchasePrice: 0,
      quantity: 0,
      minQuantity: 0,
      unit: '',
    },
  })

  async function handleSubmit(values: z.infer<typeof partSchema>) {
    setIsLoading(true)
    try {
      await onAdd(values)
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить запчасть</DialogTitle>
          <DialogDescription>
            Заполните информацию о новой запчасти на складе
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название *</FormLabel>
                    <FormControl>
                      <Input placeholder="Моторное масло 5W-40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="article"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Артикул *</FormLabel>
                    <FormControl>
                      <Input placeholder="OIL-5W40-4L" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бренд *</FormLabel>
                    <FormControl>
                      <Input placeholder="Shell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Масла">Масла</SelectItem>
                        <SelectItem value="Фильтры">Фильтры</SelectItem>
                        <SelectItem value="Тормозная система">Тормозная система</SelectItem>
                        <SelectItem value="Зажигание">Зажигание</SelectItem>
                        <SelectItem value="Охлаждающие жидкости">Охлаждающие жидкости</SelectItem>
                        <SelectItem value="Подвеска">Подвеска</SelectItem>
                        <SelectItem value="Трансмиссия">Трансмиссия</SelectItem>
                        <SelectItem value="Электрика">Электрика</SelectItem>
                        <SelectItem value="Кузовные детали">Кузовные детали</SelectItem>
                        <SelectItem value="Расходники">Расходники</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Закупочная цена *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1500"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Цена закупки</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Розничная цена *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2500"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Цена продажи</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. остаток *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Для уведомлений</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ед. изм." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="шт">шт</SelectItem>
                        <SelectItem value="компл">компл</SelectItem>
                        <SelectItem value="л">л</SelectItem>
                        <SelectItem value="кг">кг</SelectItem>
                        <SelectItem value="м">м</SelectItem>
                        <SelectItem value="упак">упак</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isLoading ? 'Сохранение...' : 'Добавить запчасть'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
