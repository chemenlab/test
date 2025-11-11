'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Package,
  BarChart3,
  Settings,
  Wrench,
  ChevronUp,
  User2,
  LogOut,
  UserCog,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

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
    title: 'Услуги',
    href: '/dashboard/services',
    icon: Wrench,
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

// Mock данные текущего пользователя
const currentUser = {
  name: 'Иван Петров',
  email: 'ivan@autoservice.ru',
  role: 'admin', // 'admin' или 'mechanic'
  avatar: null,
}

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [userRole, setUserRole] = React.useState(currentUser.role)

  const getRoleName = (role: string) => {
    return role === 'admin' ? 'Администратор' : 'Мастер'
  }

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100' : 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
  }

  const handleSwitchRole = () => {
    const newRole = userRole === 'admin' ? 'mechanic' : 'admin'
    setUserRole(newRole)
    // TODO: API call to switch role
    toast.success('Роль изменена', {
      description: `Вы переключились на роль: ${getRoleName(newRole)}`,
    })
  }

  const handleLogout = () => {
    // TODO: API call to logout
    toast.success('Выход выполнен', {
      description: 'До скорой встречи!',
    })
    // После логаута можно редиректить на страницу логина
    // router.push('/login')
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="mr-2 h-4 w-4" />
      case 'dark':
        return <Moon className="mr-2 h-4 w-4" />
      default:
        return <Monitor className="mr-2 h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Светлая'
      case 'dark':
        return 'Темная'
      default:
        return 'Системная'
    }
  }

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

      {/* User Menu Footer */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 h-auto py-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col items-start text-left text-sm">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser.email}</div>
              </div>
              <ChevronUp className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings?tab=profile" className="cursor-pointer">
                <User2 className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Theme Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {getThemeIcon()}
                <span>Тема: {getThemeLabel()}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Светлая</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Темная</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>Системная</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={handleSwitchRole}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Переключить роль</span>
              <Badge className={cn("ml-auto text-xs", getRoleColor(userRole))}>
                {getRoleName(userRole)}
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выход</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
