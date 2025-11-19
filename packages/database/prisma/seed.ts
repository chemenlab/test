import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Очистка данных (опционально)
  console.log('🧹 Cleaning up existing data...')
  await prisma.purchaseRequest.deleteMany()
  await prisma.message.deleteMany()
  await prisma.orderPart.deleteMany()
  await prisma.orderWork.deleteMany()
  await prisma.order.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.client.deleteMany()
  await prisma.part.deleteMany()
  await prisma.service.deleteMany()
  await prisma.workPost.deleteMany()
  await prisma.user.deleteMany()
  await prisma.landing.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.tenant.deleteMany()

  // Создание тенанта (автосервис)
  console.log('🏢 Creating tenant...')
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Автосервис "Профи"',
      slug: 'autoservice-profi',
      phone: '+7 (999) 123-45-67',
      email: 'info@autoservice.ru',
      address: 'г. Москва, ул. Автомобильная, д. 15',
      settings: {
        workingHours: {
          monday: { start: '09:00', end: '20:00' },
          tuesday: { start: '09:00', end: '20:00' },
          wednesday: { start: '09:00', end: '20:00' },
          thursday: { start: '09:00', end: '20:00' },
          friday: { start: '09:00', end: '20:00' },
          saturday: { start: '10:00', end: '18:00' },
          sunday: { start: '10:00', end: '18:00' },
        },
        timezone: 'Europe/Moscow',
      },
    },
  })

  // Создание подписки
  console.log('💳 Creating subscription...')
  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      plan: 'pro',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 год
    },
  })

  // Создание пользователей
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@autoservice.ru',
      password: hashedPassword,
      name: 'Иван Админов',
      role: 'admin',
      phone: '+7 (999) 111-11-11',
    },
  })

  const masterUser1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'master1@autoservice.ru',
      password: hashedPassword,
      name: 'Дмитрий Мастеров',
      role: 'master',
      phone: '+7 (999) 222-22-22',
    },
  })

  const masterUser2 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'master2@autoservice.ru',
      password: hashedPassword,
      name: 'Сергей Ремонтов',
      role: 'master',
      phone: '+7 (999) 333-33-33',
    },
  })

  const purchaser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'purchaser@autoservice.ru',
      password: hashedPassword,
      name: 'Анна Закупщик',
      role: 'purchaser',
      phone: '+7 (999) 444-44-44',
    },
  })

  // Создание рабочих постов
  console.log('🏗️ Creating work posts...')
  const post1 = await prisma.workPost.create({
    data: {
      tenantId: tenant.id,
      name: 'Пост 1',
      description: 'Основной пост для сложного ремонта',
    },
  })

  const post2 = await prisma.workPost.create({
    data: {
      tenantId: tenant.id,
      name: 'Пост 2',
      description: 'Пост для быстрого обслуживания',
    },
  })

  const post3 = await prisma.workPost.create({
    data: {
      tenantId: tenant.id,
      name: 'Пост 3',
      description: 'Пост для диагностики',
    },
  })

  // Создание услуг
  console.log('🔧 Creating services...')
  const serviceOilChange = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Замена масла',
      description: 'Замена моторного масла и масляного фильтра',
      price: 1500,
      duration: 30,
      category: 'Обслуживание',
    },
  })

  const serviceDiagnostics = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Компьютерная диагностика',
      description: 'Диагностика всех систем автомобиля',
      price: 800,
      duration: 30,
      category: 'Диагностика',
    },
  })

  const serviceBrakes = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Замена тормозных колодок',
      description: 'Замена передних или задних колодок',
      price: 2500,
      duration: 90,
      category: 'Тормозная система',
    },
  })

  const serviceTireChange = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Шиномонтаж (4 колеса)',
      description: 'Сезонная замена и балансировка',
      price: 2000,
      duration: 60,
      category: 'Шиномонтаж',
    },
  })

  const serviceAlignment = await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: 'Развал-схождение',
      description: 'Регулировка углов установки колес',
      price: 1800,
      duration: 60,
      category: 'Ходовая часть',
    },
  })

  // Создание клиентов
  console.log('🚗 Creating clients...')
  const client1 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      email: 'ivan@example.com',
      type: 'regular',
      discount: 0,
      source: 'website',
      tags: ['VIP'],
      notes: 'Постоянный клиент',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      email: 'maria@example.com',
      type: 'regular',
      discount: 5,
      source: 'recommendation',
      tags: [],
    },
  })

  const client3 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'ООО "Такси Плюс"',
      phone: '+7 (999) 345-67-89',
      email: 'taxi@example.com',
      type: 'corporate',
      discount: 15,
      source: 'cold_call',
      tags: ['Корпоративный', 'Такси'],
    },
  })

  const client4 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Алексей Смирнов',
      phone: '+7 (999) 456-78-90',
      email: 'alex@example.com',
      type: 'regular',
      discount: 0,
      source: 'website',
    },
  })

  // Создание автомобилей
  console.log('🚙 Creating vehicles...')
  const vehicle1 = await prisma.vehicle.create({
    data: {
      clientId: client1.id,
      brand: 'Toyota',
      model: 'Camry',
      year: 2020,
      plateNumber: 'А123БВ',
      vin: '1HGBH41JXMN109186',
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      clientId: client2.id,
      brand: 'BMW',
      model: 'X5',
      year: 2019,
      plateNumber: 'К456МН',
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      clientId: client3.id,
      brand: 'Volkswagen',
      model: 'Polo',
      year: 2021,
      plateNumber: 'В456ГД',
    },
  })

  const vehicle4 = await prisma.vehicle.create({
    data: {
      clientId: client4.id,
      brand: 'Mazda',
      model: 'CX-5',
      year: 2022,
      plateNumber: 'Т234УФ',
    },
  })

  // Создание записей
  console.log('📅 Creating bookings...')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  await prisma.booking.create({
    data: {
      tenantId: tenant.id,
      clientId: client1.id,
      vehicleId: vehicle1.id,
      serviceId: serviceOilChange.id,
      masterId: masterUser1.id,
      workPostId: post1.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 30 * 60 * 1000),
      status: 'confirmed',
      notes: 'Клиент приедет утром',
    },
  })

  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)
  dayAfter.setHours(14, 0, 0, 0)

  await prisma.booking.create({
    data: {
      tenantId: tenant.id,
      clientId: client2.id,
      vehicleId: vehicle2.id,
      serviceId: serviceDiagnostics.id,
      masterId: masterUser2.id,
      workPostId: post2.id,
      startTime: dayAfter,
      endTime: new Date(dayAfter.getTime() + 30 * 60 * 1000),
      status: 'pending',
    },
  })

  // Создание заказов
  console.log('📋 Creating orders...')
  const order1 = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      orderNumber: 'ORD-2024-001',
      clientId: client1.id,
      vehicleId: vehicle1.id,
      masterId: masterUser1.id,
      status: 'completed',
      subtotal: 3500,
      discount: 0,
      total: 3500,
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.orderWork.create({
    data: {
      orderId: order1.id,
      serviceId: serviceOilChange.id,
      name: 'Замена масла',
      price: 1500,
      quantity: 1,
      total: 1500,
    },
  })

  await prisma.orderPart.create({
    data: {
      orderId: order1.id,
      name: 'Масло моторное 5W-30',
      article: 'OIL-5W30-001',
      price: 2000,
      quantity: 1,
      total: 2000,
    },
  })

  // Создание запчастей на складе
  console.log('📦 Creating warehouse parts...')
  await prisma.part.create({
    data: {
      tenantId: tenant.id,
      name: 'Масло моторное 5W-30',
      article: 'OIL-5W30-001',
      brand: 'Mobil',
      category: 'Масла',
      price: 2000,
      stock: 25,
      minStock: 10,
    },
  })

  await prisma.part.create({
    data: {
      tenantId: tenant.id,
      name: 'Фильтр масляный',
      article: 'FILTER-OIL-002',
      brand: 'Mann',
      category: 'Фильтры',
      price: 500,
      stock: 8,
      minStock: 15,
    },
  })

  await prisma.part.create({
    data: {
      tenantId: tenant.id,
      name: 'Тормозные колодки передние',
      article: 'BRAKE-PAD-FRONT-003',
      brand: 'Brembo',
      category: 'Тормозная система',
      price: 4500,
      stock: 5,
      minStock: 5,
    },
  })

  // Создание сообщений
  console.log('💬 Creating messages...')
  await prisma.message.create({
    data: {
      tenantId: tenant.id,
      clientId: client1.id,
      text: 'Здравствуйте! Хочу записаться на замену масла',
      isFromClient: true,
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  })

  await prisma.message.create({
    data: {
      tenantId: tenant.id,
      clientId: client1.id,
      text: 'Добрый день! Конечно, есть свободное время завтра в 10:00. Вам подойдет?',
      isFromClient: false,
      read: true,
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
  })

  await prisma.message.create({
    data: {
      tenantId: tenant.id,
      clientId: client2.id,
      text: 'Можно ли сделать диагностику сегодня?',
      isFromClient: true,
      read: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
  })

  // Создание заявок на закупку
  console.log('🛒 Creating purchase requests...')
  await prisma.purchaseRequest.create({
    data: {
      tenantId: tenant.id,
      requestNumber: 'PR-2024-001',
      partName: 'Масло моторное 5W-30',
      partNumber: 'OIL-5W30-001',
      quantity: 20,
      priority: 'high',
      status: 'pending',
      notes: 'Срочно, заканчивается',
      createdById: purchaser.id,
    },
  })

  await prisma.purchaseRequest.create({
    data: {
      tenantId: tenant.id,
      requestNumber: 'PR-2024-002',
      partName: 'Фильтр масляный',
      partNumber: 'FILTER-OIL-002',
      quantity: 30,
      priority: 'normal',
      status: 'approved',
      supplier: 'Emex',
      estimatedPrice: 15000,
      createdById: purchaser.id,
      reviewedById: adminUser.id,
      reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Test credentials:')
  console.log('   Admin: admin@autoservice.ru / password123')
  console.log('   Master 1: master1@autoservice.ru / password123')
  console.log('   Master 2: master2@autoservice.ru / password123')
  console.log('   Purchaser: purchaser@autoservice.ru / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
