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
]

// GET /api/clients - Получить всех клиентов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const source = searchParams.get('source')

    let filteredClients = [...mockClients]

    // Фильтрация по поиску
    if (search) {
      filteredClients = filteredClients.filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.phone.includes(search)
      )
    }

    // Фильтрация по источнику
    if (source) {
      filteredClients = filteredClients.filter((client) => client.source === source)
    }

    return NextResponse.json(filteredClients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Создать нового клиента
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, source, tags, notes } = body

    // Валидация
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Создание нового клиента
    const newClient = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      email: email || null,
      source: source || null,
      tags: tags || [],
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        bookings: 0,
        orders: 0,
      },
    }

    mockClients.push(newClient)

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
