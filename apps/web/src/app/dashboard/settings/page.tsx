'use client'

import * as React from 'react'
import { Building2, Users, LayoutGrid, Bell, User } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TenantSettings } from './components/tenant-settings'
import { UsersManagement } from './components/users-management'
import { WorkPostsManagement } from './components/work-posts-management'
import { NotificationSettings } from './components/notification-settings'
import { ProfileSettings } from './components/profile-settings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управление автосервисом, пользователями и настройками системы
        </p>
      </div>

      <Tabs defaultValue="tenant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="tenant" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Организация</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Пользователи</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Посты</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenant">
          <TenantSettings />
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="posts">
          <WorkPostsManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
