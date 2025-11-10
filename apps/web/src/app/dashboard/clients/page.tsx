'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientsTable } from './components/clients-table'
import { AddClientDialog } from './components/add-client-dialog'
import { Client, CreateClientInput } from '@/lib/types'

// Mock data for development
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    source: 'website',
    tags: ['VIP'],
    notes: 'Постоянный клиент',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    _count: {
      bookings: 12,
      orders: 12,
    },
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    phone: '+7 (999) 234-56-78',
    email: 'maria@example.com',
    source: 'recommendation',
    tags: [],
    notes: null,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    _count: {
      bookings: 3,
      orders: 3,
    },
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    phone: '+7 (999) 345-67-89',
    email: null,
    source: 'phone',
    tags: [],
    notes: null,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    _count: {
      bookings: 1,
      orders: 1,
    },
  },
  {
    id: '4',
    name: 'Елена Волкова',
    phone: '+7 (999) 456-78-90',
    email: 'elena@example.com',
    source: 'social',
    tags: ['VIP'],
    notes: 'Предпочитает мастера Дмитрия',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    _count: {
      bookings: 8,
      orders: 8,
    },
  },
  {
    id: '5',
    name: 'Дмитрий Козлов',
    phone: '+7 (999) 567-89-01',
    email: 'dmitry@example.com',
    source: 'advertising',
    tags: [],
    notes: null,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    _count: {
      bookings: 2,
      orders: 2,
    },
  },
]

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>(mockClients)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleAddClient = async (data: CreateClientInput) => {
    // TODO: Replace with actual API call
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      source: data.source || null,
      tags: data.tags || [],
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        bookings: 0,
        orders: 0,
      },
    }

    setClients([...clients, newClient])
  }

  const handleEditClient = (client: Client) => {
    console.log('Edit client:', client)
    // TODO: Implement edit dialog
  }

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Вы уверены, что хотите удалить клиента ${client.name}?`)) {
      setClients(clients.filter((c) => c.id !== client.id))
    }
  }

  const handleViewClient = (client: Client) => {
    console.log('View client:', client)
    // TODO: Navigate to client detail page
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
          <p className="text-muted-foreground">
            Управление базой клиентов автосервиса
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить клиента
        </Button>
      </div>

      <ClientsTable
        data={clients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onView={handleViewClient}
      />

      <AddClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddClient}
      />
    </div>
  )
}
