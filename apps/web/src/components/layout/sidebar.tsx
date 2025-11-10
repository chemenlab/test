'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Package,
  BarChart3,
  Settings,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Клиенты',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'Записи',
    href: '/dashboard/bookings',
    icon: Calendar,
  },
  {
    title: 'Заказы',
    href: '/dashboard/orders',
    icon: FileText,
  },
  {
    title: 'Склад',
    href: '/dashboard/warehouse',
    icon: Package,
  },
  {
    title: 'Аналитика',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Настройки',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-6 w-6" />
          <span className="text-lg">AutoCRM</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">АС</span>
          </div>
          <div className="flex-1 text-sm">
            <div className="font-medium">Автосервис №1</div>
            <div className="text-xs text-muted-foreground">Базовый тариф</div>
          </div>
        </div>
      </div>
    </div>
  )
}
