import { NextRequest, NextResponse } from 'next/server'

// Mock database - в будущем заменить на Prisma
let mockClients = [
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
]

// GET /api/clients/[id] - Получить клиента по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = mockClients.find((c) => c.id === params.id)

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/[id] - Обновить клиента
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const clientIndex = mockClients.findIndex((c) => c.id === params.id)

    if (clientIndex === -1) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Обновление клиента
    mockClients[clientIndex] = {
      ...mockClients[clientIndex],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json(mockClients[clientIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Удалить клиента
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientIndex = mockClients.findIndex((c) => c.id === params.id)

    if (clientIndex === -1) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    mockClients.splice(clientIndex, 1)

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
