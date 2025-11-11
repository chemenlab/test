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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const workPostSchema = z.object({
  name: z.string().min(2, { message: 'Название должно содержать минимум 2 символа' }),
  description: z.string().optional(),
})

interface AddWorkPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: z.infer<typeof workPostSchema>) => Promise<void>
}

export function AddWorkPostDialog({
  open,
  onOpenChange,
  onAdd,
}: AddWorkPostDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof workPostSchema>>({
    resolver: zodResolver(workPostSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function handleSubmit(values: z.infer<typeof workPostSchema>) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить рабочий пост</DialogTitle>
          <DialogDescription>
            Создайте новый рабочий пост для автосервиса
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input placeholder="Пост 1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Например: Пост 1, Пост диагностики, Пост шиномонтажа
                  </FormDescription>
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
                      placeholder="Описание назначения поста..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Опциональное описание специализации поста
                  </FormDescription>
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
                {isLoading ? 'Создание...' : 'Создать пост'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
