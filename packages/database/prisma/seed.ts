import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...')

  // Создаем тенант (автосервис)
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'vyborsto' },
    update: {},
    create: {
      name: 'Выборсто Автосервис',
      slug: 'vyborsto',
      phone: '+7 (999) 123-45-67',
      email: 'info@vyborsto.ru',
      address: 'г. Москва, ул. Примерная, д. 1',
    },
  })

  console.log('✅ Тенант создан:', tenant.name)

  // Создаем подписку
  const subscription = await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      plan: 'pro',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 год
    },
  })

  console.log('✅ Подписка создана:', subscription.plan)

  // Создаем пользователей (мастеров)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ivanov@vyborsto.ru' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'ivanov@vyborsto.ru',
        name: 'Иван Иванов',
        role: 'master',
        phone: '+7 (999) 111-11-11',
      },
    }),
    prisma.user.upsert({
      where: { email: 'petrov@vyborsto.ru' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'petrov@vyborsto.ru',
        name: 'Петр Петров',
        role: 'master',
        phone: '+7 (999) 222-22-22',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sidorov@vyborsto.ru' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'sidorov@vyborsto.ru',
        name: 'Сергей Сидоров',
        role: 'master',
        phone: '+7 (999) 333-33-33',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@vyborsto.ru' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'admin@vyborsto.ru',
        name: 'Администратор',
        role: 'admin',
        phone: '+7 (999) 000-00-00',
      },
    }),
  ])

  console.log('✅ Пользователи созданы:', users.length)

  // Создаем услуги
  const services = await Promise.all([
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Замена масла',
        description: 'Замена моторного масла и масляного фильтра',
        price: 1500,
        duration: 30,
        category: 'Техническое обслуживание',
      },
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Диагностика подвески',
        description: 'Полная диагностика ходовой части автомобиля',
        price: 1000,
        duration: 60,
        category: 'Диагностика',
      },
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Замена тормозных колодок',
        description: 'Замена передних тормозных колодок',
        price: 2500,
        duration: 90,
        category: 'Ремонт тормозной системы',
      },
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Компьютерная диагностика',
        description: 'Диагностика с помощью сканера OBD-II',
        price: 800,
        duration: 30,
        category: 'Диагностика',
      },
    }),
    prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: 'Шиномонтаж',
        description: 'Шиномонтаж 4 колес с балансировкой',
        price: 2000,
        duration: 60,
        category: 'Шиномонтаж',
      },
    }),
  ])

  console.log('✅ Услуги созданы:', services.length)

  // Создаем рабочие посты
  const workPosts = await Promise.all([
    prisma.workPost.create({
      data: {
        tenantId: tenant.id,
        name: 'Пост №1',
        description: 'Основной пост для ремонта',
      },
    }),
    prisma.workPost.create({
      data: {
        tenantId: tenant.id,
        name: 'Пост №2',
        description: 'Диагностический пост',
      },
    }),
    prisma.workPost.create({
      data: {
        tenantId: tenant.id,
        name: 'Пост №3',
        description: 'Шиномонтаж',
      },
    }),
  ])

  console.log('✅ Рабочие посты созданы:', workPosts.length)

  // Создаем клиентов
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        tenantId: tenant.id,
        name: 'Александр Петров',
        phone: '+7 (999) 123-45-67',
        email: 'petrov@example.com',
        source: 'Сайт',
        tags: ['VIP', 'Постоянный'],
      },
    }),
    prisma.client.create({
      data: {
        tenantId: tenant.id,
        name: 'Мария Сидорова',
        phone: '+7 (999) 234-56-78',
        email: 'sidorova@example.com',
        source: 'Рекомендация',
        tags: ['Новый'],
      },
    }),
    prisma.client.create({
      data: {
        tenantId: tenant.id,
        name: 'Дмитрий Иванов',
        phone: '+7 (999) 345-67-89',
        source: 'Яндекс',
        tags: ['Постоянный'],
      },
    }),
    prisma.client.create({
      data: {
        tenantId: tenant.id,
        name: 'Елена Кузнецова',
        phone: '+7 (999) 456-78-90',
        email: 'kuznetsova@example.com',
        source: 'Instagram',
        tags: ['Новый'],
      },
    }),
    prisma.client.create({
      data: {
        tenantId: tenant.id,
        name: 'Сергей Новиков',
        phone: '+7 (999) 567-89-01',
        source: 'Проезжал мимо',
        tags: ['Разовый'],
      },
    }),
  ])

  console.log('✅ Клиенты созданы:', clients.length)

  // Создаем автомобили для клиентов
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        clientId: clients[0].id,
        brand: 'Toyota',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'А123БВ777',
        vin: 'JT2BG22K123456789',
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[1].id,
        brand: 'Volkswagen',
        make: 'Volkswagen',
        model: 'Polo',
        year: 2019,
        licensePlate: 'В456ГД777',
        vin: 'WV1ZZZ6RZCH123456',
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[2].id,
        brand: 'Kia',
        make: 'Kia',
        model: 'Rio',
        year: 2021,
        licensePlate: 'С789ЕЖ777',
        vin: 'KNADH4A39K6123456',
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[3].id,
        brand: 'Hyundai',
        make: 'Hyundai',
        model: 'Solaris',
        year: 2018,
        licensePlate: 'Д012ЗИ777',
        vin: 'Z94C251BBJR123456',
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[4].id,
        brand: 'Lada',
        make: 'Lada',
        model: 'Vesta',
        year: 2022,
        licensePlate: 'Е345КЛ777',
        vin: 'XTAGFK330J2123456',
      },
    }),
  ])

  console.log('✅ Автомобили созданы:', vehicles.length)

  // Создаем записи на сервис
  const now = new Date()
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[0].id,
        vehicleId: vehicles[0].id,
        serviceId: services[0].id,
        userId: users[0].id,
        workPostId: workPosts[0].id,
        startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // +1 день
        endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 мин
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[1].id,
        vehicleId: vehicles[1].id,
        serviceId: services[1].id,
        userId: users[1].id,
        workPostId: workPosts[1].id,
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 дня
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 час
        status: 'confirmed',
      },
    }),
  ])

  console.log('✅ Записи созданы:', bookings.length)

  // Создаем запчасти
  const parts = await Promise.all([
    prisma.part.create({
      data: {
        tenantId: tenant.id,
        name: 'Моторное масло 5W-40',
        article: 'OIL-5W40-4L',
        brand: 'Shell',
        category: 'Масла',
        price: 2500,
        purchasePrice: 1800,
        quantity: 25,
        minQuantity: 10,
        unit: 'л',
      },
    }),
    prisma.part.create({
      data: {
        tenantId: tenant.id,
        name: 'Тормозные колодки передние',
        article: 'BRP-FR-TOYOT',
        brand: 'Brembo',
        category: 'Тормозная система',
        price: 3500,
        purchasePrice: 2800,
        quantity: 8,
        minQuantity: 5,
        unit: 'компл',
      },
    }),
    prisma.part.create({
      data: {
        tenantId: tenant.id,
        name: 'Масляный фильтр',
        article: 'FILT-OIL-STD',
        brand: 'Mann',
        category: 'Фильтры',
        price: 450,
        purchasePrice: 320,
        quantity: 3,
        minQuantity: 10,
        unit: 'шт',
      },
    }),
    prisma.part.create({
      data: {
        tenantId: tenant.id,
        name: 'Воздушный фильтр',
        article: 'FILT-AIR-STD',
        brand: 'Filtron',
        category: 'Фильтры',
        price: 650,
        purchasePrice: 450,
        quantity: 15,
        minQuantity: 8,
        unit: 'шт',
      },
    }),
    prisma.part.create({
      data: {
        tenantId: tenant.id,
        name: 'Свечи зажигания',
        article: 'SPARK-NGK-4PCS',
        brand: 'NGK',
        category: 'Зажигание',
        price: 1200,
        purchasePrice: 900,
        quantity: 2,
        minQuantity: 6,
        unit: 'компл',
      },
    }),
  ])

  console.log('✅ Запчасти созданы:', parts.length)

  console.log('🎉 База данных успешно заполнена тестовыми данными!')
  console.log('')
  console.log('📊 Статистика:')
  console.log(`   - Тенантов: 1`)
  console.log(`   - Пользователей: ${users.length}`)
  console.log(`   - Услуг: ${services.length}`)
  console.log(`   - Рабочих постов: ${workPosts.length}`)
  console.log(`   - Клиентов: ${clients.length}`)
  console.log(`   - Автомобилей: ${vehicles.length}`)
  console.log(`   - Записей: ${bookings.length}`)
  console.log(`   - Запчастей: ${parts.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
