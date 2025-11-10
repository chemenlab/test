# 🔄 Миграция на Prisma: от Mock данных к реальной БД

Данный гайд поможет перейти от использования mock данных к реальной PostgreSQL базе данных через Prisma ORM.

## 📋 Содержание

1. [Подготовка](#подготовка)
2. [Настройка PostgreSQL](#настройка-postgresql)
3. [Генерация Prisma Client](#генерация-prisma-client)
4. [Заполнение тестовыми данными](#заполнение-тестовыми-данными)
5. [Обновление API Routes](#обновление-api-routes)
6. [Тестирование](#тестирование)

---

## Подготовка

### Что уже готово:

✅ **Prisma схема** - полностью готова в `packages/database/prisma/schema.prisma`
✅ **Seed файл** - готов в `packages/database/prisma/seed.ts`
✅ **Prisma Client wrapper** - готов в `apps/web/src/lib/prisma.ts`
✅ **11 моделей**: Tenant, Subscription, User, Client, Vehicle, Service, WorkPost, Booking, Order, OrderWork, OrderPart, Part, Landing

### Что нужно сделать:

1. Настроить подключение к PostgreSQL
2. Применить схему к базе данных
3. Заполнить тестовыми данными
4. Обновить API routes для использования Prisma

---

## Настройка PostgreSQL

### Локальная разработка (Docker)

Если у вас уже запущен Docker Compose:

```bash
# База данных уже должна быть запущена
docker-compose ps

# Если нет, запустите:
docker-compose up -d postgres
```

### Production (Ubuntu Server)

PostgreSQL уже должен быть установлен согласно DEPLOYMENT.md. Убедитесь что база создана:

```bash
# Подключение к PostgreSQL
sudo -u postgres psql

# Создание базы данных (если еще не создана)
CREATE DATABASE crm_autoshop;

# Создание пользователя
CREATE USER crm_user WITH PASSWORD 'your_strong_password';

# Выдача прав
GRANT ALL PRIVILEGES ON DATABASE crm_autoshop TO crm_user;

\q
```

---

## Генерация Prisma Client

### Шаг 1: Настройка .env файлов

**packages/database/.env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_autoshop?schema=public"
```

**Production:**
```env
DATABASE_URL="postgresql://crm_user:your_strong_password@localhost:5432/crm_autoshop?schema=public"
```

**apps/web/.env:**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_autoshop?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-chars"
NEXTAUTH_URL="http://localhost:3000"  # или https://vyborsto.ru для production

# App
NODE_ENV="development"  # или "production"
PORT=3000

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"  # или https://api.vyborsto.ru
```

### Шаг 2: Генерация Prisma Client

```bash
# Переход в packages/database
cd packages/database

# Установка зависимостей (если еще не установлены)
pnpm install

# Генерация Prisma Client
pnpm db:generate

# Применение схемы к базе данных (без миграций)
pnpm db:push
```

**Альтернатива с миграциями:**

```bash
# Создание первой миграции
pnpm db:migrate
# Введите название миграции, например: init
```

---

## Заполнение тестовыми данными

Seed файл уже готов и содержит:
- 1 тенант (автосервис Выборсто)
- 1 подписка (Pro план)
- 4 пользователя (3 мастера + 1 админ)
- 5 услуг
- 3 рабочих поста
- 5 клиентов
- 5 автомобилей
- 2 записи на сервис
- 5 запчастей

### Запуск seed:

```bash
# Из packages/database
pnpm db:seed

# Или из корня проекта
pnpm --filter @crm-autoshop/database db:seed
```

Вы должны увидеть:

```
🌱 Начинаем заполнение базы данных тестовыми данными...
✅ Тенант создан: Выборсто Автосервис
✅ Подписка создана: pro
✅ Пользователи созданы: 4
✅ Услуги созданы: 5
✅ Рабочие посты созданы: 3
✅ Клиенты созданы: 5
✅ Автомобили созданы: 5
✅ Записи созданы: 2
✅ Запчасти созданы: 5
🎉 База данных успешно заполнена тестовыми данными!
```

---

## Обновление API Routes

Теперь нужно заменить mock данные на реальные запросы через Prisma.

### Пример: Clients API

**До (Mock данные):**

```typescript
// apps/web/src/app/api/clients/route.ts
const mockClients = [
  { id: '1', name: 'Иван Петров', ... },
  // ...
]

export async function GET() {
  return Response.json(mockClients)
}
```

**После (Prisma):**

```typescript
// apps/web/src/app/api/clients/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// ВАЖНО: Получаем tenantId из сессии пользователя или контекста
// Для упрощения используем фиксированный ID первого тенанта
const TENANT_ID = 'YOUR_TENANT_ID'  // Получите его из базы или сессии

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const clients = await prisma.client.findMany({
      where: {
        tenantId: TENANT_ID,
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        _count: {
          select: {
            bookings: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return Response.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return Response.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = await prisma.client.create({
      data: {
        tenantId: TENANT_ID,
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        source: body.source || null,
        notes: body.notes || null,
        tags: body.tags || [],
      },
    })

    return Response.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return Response.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
```

### Получение TENANT_ID

Есть несколько подходов:

**1. Из базы данных (самый простой для начала):**

```typescript
// apps/web/src/lib/tenant.ts
import { prisma } from './prisma'

export async function getTenantId() {
  const tenant = await prisma.tenant.findFirst({
    where: { slug: 'vyborsto' },
    select: { id: true },
  })

  if (!tenant) {
    throw new Error('Tenant not found')
  }

  return tenant.id
}
```

Затем в API routes:

```typescript
import { getTenantId } from '@/lib/tenant'

export async function GET() {
  const tenantId = await getTenantId()

  const clients = await prisma.client.findMany({
    where: { tenantId },
    // ...
  })
  // ...
}
```

**2. Из переменной окружения:**

```env
# .env
TENANT_ID="clxxxxxxxxxxxxxx"
```

```typescript
const TENANT_ID = process.env.TENANT_ID!
```

**3. Из сессии пользователя (для multi-tenant):**

Когда добавите аутентификацию, можно получать из сессии:

```typescript
import { getServerSession } from 'next-auth'

export async function GET() {
  const session = await getServerSession()
  const tenantId = session?.user?.tenantId
  // ...
}
```

---

## Тестирование

### Шаг 1: Проверка подключения

```bash
# Запуск Prisma Studio для просмотра данных
cd packages/database
pnpm db:studio

# Откроется http://localhost:5555
```

### Шаг 2: Тестирование API

```bash
# Запуск dev сервера
pnpm dev

# В другом терминале тестируем API
curl http://localhost:3000/api/clients

# Должен вернуться список клиентов из базы данных
```

### Шаг 3: Тестирование в браузере

1. Откройте http://localhost:3000/dashboard/clients
2. Должна загрузиться таблица клиентов из базы данных
3. Попробуйте добавить нового клиента
4. Проверьте что данные сохранились в БД через Prisma Studio

---

## Файлы для обновления

Вот список всех API routes которые нужно обновить:

### Clients

- ✅ `apps/web/src/app/api/clients/route.ts`
- ✅ `apps/web/src/app/api/clients/[id]/route.ts`

### Bookings

- ⏳ `apps/web/src/app/api/bookings/route.ts`
- ⏳ `apps/web/src/app/api/bookings/[id]/route.ts`

### Orders

- ⏳ `apps/web/src/app/api/orders/route.ts`
- ⏳ `apps/web/src/app/api/orders/[id]/route.ts`

### Services

- ⏳ `apps/web/src/app/api/services/route.ts`

### Users (Masters)

- ⏳ `apps/web/src/app/api/users/route.ts`

### Work Posts

- ⏳ `apps/web/src/app/api/work-posts/route.ts`

### Parts (Warehouse)

- ⏳ `apps/web/src/app/api/parts/route.ts`
- ⏳ `apps/web/src/app/api/parts/[id]/route.ts`

---

## Пример миграции: Bookings API

### До (Mock):

```typescript
const mockBookings = [...]

export async function GET() {
  return Response.json(mockBookings)
}
```

### После (Prisma):

```typescript
import { prisma } from '@/lib/prisma'
import { getTenantId } from '@/lib/tenant'

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getTenantId()
    const searchParams = request.nextUrl.searchParams

    const date = searchParams.get('date')
    const masterId = searchParams.get('masterId')
    const workPostId = searchParams.get('workPostId')

    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        ...(date && {
          startTime: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
        ...(masterId && { userId: masterId }),
        ...(workPostId && { workPostId }),
      },
      include: {
        client: true,
        vehicle: true,
        service: true,
        user: true,
        workPost: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return Response.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getTenantId()
    const body = await request.json()

    // Проверка конфликтов времени
    const conflicts = await prisma.booking.findMany({
      where: {
        tenantId,
        workPostId: body.workPostId,
        status: { notIn: ['canceled'] },
        OR: [
          {
            startTime: {
              lte: new Date(body.startTime),
            },
            endTime: {
              gt: new Date(body.startTime),
            },
          },
          {
            startTime: {
              lt: new Date(body.endTime),
            },
            endTime: {
              gte: new Date(body.endTime),
            },
          },
        ],
      },
    })

    if (conflicts.length > 0) {
      return Response.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        tenantId,
        clientId: body.clientId,
        vehicleId: body.vehicleId,
        serviceId: body.serviceId,
        userId: body.userId,
        workPostId: body.workPostId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        status: 'confirmed',
        notes: body.notes || null,
      },
      include: {
        client: true,
        vehicle: true,
        service: true,
        user: true,
        workPost: true,
      },
    })

    return Response.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
```

---

## Типы TypeScript

Prisma автоматически генерирует типы. Вместо ручных типов из `@/lib/types`, можно использовать типы Prisma:

```typescript
import { Client, Booking, Prisma } from '@prisma/client'

// Тип клиента с количеством записей и заказов
type ClientWithCounts = Prisma.ClientGetPayload<{
  include: {
    _count: {
      select: {
        bookings: true
        orders: true
      }
    }
  }
}>

// Тип записи со всеми связями
type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    client: true
    vehicle: true
    service: true
    user: true
    workPost: true
  }
}>
```

---

## Troubleshooting

### Ошибка: "Prisma Client not generated"

```bash
cd packages/database
pnpm db:generate
```

### Ошибка: "Can't reach database server"

Проверьте:
1. PostgreSQL запущен: `docker-compose ps` или `sudo systemctl status postgresql`
2. DATABASE_URL правильный в .env файлах
3. Можете подключиться: `psql $DATABASE_URL`

### Ошибка: "P2002: Unique constraint failed"

Seed уже был запущен. Либо:
1. Удалите данные: `pnpm prisma db push --force-reset`
2. Или измените seed для использования `upsert` вместо `create`

### Slow queries

Добавьте индексы в schema.prisma:

```prisma
model Client {
  // ...

  @@index([tenantId])
  @@index([phone])
  @@index([email])
}
```

Затем:
```bash
pnpm db:push
```

---

## Полезные команды Prisma

```bash
# Генерация Prisma Client
pnpm db:generate

# Применение схемы (без миграций)
pnpm db:push

# Создание миграции
pnpm db:migrate

# Открыть Prisma Studio
pnpm db:studio

# Сброс базы данных
pnpm prisma db push --force-reset

# Форматирование schema.prisma
pnpm prisma format

# Валидация schema.prisma
pnpm prisma validate
```

---

## Следующие шаги

После успешной миграции на Prisma:

1. ✅ Удалите mock данные из API routes
2. ✅ Обновите все API endpoints
3. ✅ Добавьте тесты для API
4. ✅ Настройте CI/CD с автоматическими миграциями
5. ✅ Добавьте логирование запросов в production
6. ✅ Настройте connection pooling для production

---

## Полезные ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Next.js with Prisma](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

**Удачи с миграцией! 🚀**

Если возникнут вопросы - обращайтесь к документации Prisma или создайте issue в репозитории.
