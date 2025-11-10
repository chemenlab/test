# 🚀 Следующие шаги разработки

Проект успешно настроен! Базовая структура готова, можно начинать разработку.

## ✅ Что уже сделано

1. **Monorepo структура** - настроен pnpm workspaces + Turborepo
2. **Next.js 14** - создано приложение с App Router и TypeScript
3. **shadcn/ui** - настроен, добавлены базовые компоненты
4. **Dashboard Layout** - боковое меню, хедер, страницы-заглушки
5. **Prisma Schema** - полная схема БД для CRM автосервиса
6. **TypeScript** - настроен в strict режиме с path aliases

## 📦 Установка зависимостей

Перед началом работы нужно установить зависимости:

```bash
# Установка pnpm (если не установлен)
npm install -g pnpm@8.15.0

# Установка всех зависимостей
pnpm install

# Генерация Prisma Client
cd packages/database
pnpm db:generate
```

## 🏃 Запуск проекта

```bash
# Запуск dev сервера (из корня проекта)
pnpm dev

# Или запуск только web приложения
cd apps/web
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 📋 План дальнейшей разработки

### Этап 2: Clients CRUD (Неделя 3 из плана)

**Приоритет: HIGH**

Следующий шаг - создание полноценной страницы управления клиентами.

#### Задачи:

1. **Установить дополнительные компоненты shadcn/ui:**
   ```bash
   cd apps/web
   npx shadcn@latest add data-table
   npx shadcn@latest add dialog
   npx shadcn@latest add form
   npx shadcn@latest add select
   npx shadcn@latest add combobox
   npx shadcn@latest add popover
   ```

2. **Создать DataTable для клиентов:**
   - Файл: `apps/web/src/app/dashboard/clients/page.tsx`
   - Использовать готовый блок DataTable из shadcn/ui
   - Колонки: Имя, Телефон, Email, Визиты, Общая сумма, Действия
   - Добавить сортировку, фильтрацию, пагинацию

3. **Форма добавления клиента:**
   - Использовать Dialog + Form из shadcn/ui
   - Поля: Имя, Телефон, Email, Источник, Теги
   - Валидация через zod
   - React Hook Form для управления формой

4. **API Routes:**
   - `app/api/clients/route.ts` - GET (список), POST (создание)
   - `app/api/clients/[id]/route.ts` - GET, PATCH, DELETE
   - Использовать Prisma для работы с БД

5. **Интеграция с БД:**
   - Настроить PostgreSQL (локально или Docker)
   - Создать `.env` с DATABASE_URL
   - Запустить миграции: `pnpm db:push`

#### Пример кода для DataTable:

```tsx
// apps/web/src/app/dashboard/clients/page.tsx
'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AddClientDialog } from './add-client-dialog'

export default function ClientsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Клиенты</h1>
          <p className="text-muted-foreground">
            Управление базой клиентов
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить клиента
        </Button>
      </div>

      {/* DataTable здесь */}

      <AddClientDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
```

### Этап 3: Booking Calendar (Неделя 4)

После клиентов переходим к календарю записей:

1. Установить Calendar компонент: `npx shadcn@latest add calendar`
2. Создать сетку временных слотов
3. Multi-step форма записи (из Origin UI)
4. Drag-and-drop для изменения времени

### Этап 4: Orders (Заказ-наряд) (Неделя 5-6)

Создание формы заказ-наряда с работами и запчастями.

---

## 🎨 Где брать готовые блоки

**ВАЖНО:** Не создавай компоненты с нуля! Используй готовые блоки.

### Основные источники:

1. **shadcn/ui Blocks** - https://ui.shadcn.com/blocks
   - Dashboard layouts
   - Authentication pages
   - Data tables with actions

2. **shadcn/ui Components** - https://ui.shadcn.com/docs/components
   - Все базовые компоненты
   - Examples использования

3. **Magic UI** - https://magicui.design
   - Анимации
   - Shimmer effects
   - Animated cards

4. **Aceternity UI** - https://ui.aceternity.com
   - Hero sections
   - Feature grids
   - 3D cards

5. **Origin UI** - https://originui.com
   - Multi-step forms
   - File upload
   - Phone input

### Алгоритм работы:

```
1. Определить что нужно сделать
   ↓
2. Найти готовый блок в Registry
   ↓
3. Скопировать код компонента
   ↓
4. Адаптировать под свои данные
   ↓
5. Добавить API интеграцию
```

---

## 🗄️ Настройка БД

### Локальная разработка с Docker:

```bash
# docker-compose.yml (создать в корне проекта)
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: crm_autoshop
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  postgres_data:
```

```bash
# Запуск БД
docker-compose up -d

# Создать .env в packages/database
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_autoshop?schema=public"' > packages/database/.env

# Создать .env в apps/web
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_autoshop?schema=public"' > apps/web/.env

# Применить схему к БД
cd packages/database
pnpm db:push

# Открыть Prisma Studio для просмотра данных
pnpm db:studio
```

---

## 📚 Полезные ресурсы

### Документация:

- **Next.js 14** - https://nextjs.org/docs
- **shadcn/ui** - https://ui.shadcn.com
- **Tailwind CSS** - https://tailwindcss.com/docs
- **Prisma** - https://www.prisma.io/docs
- **React Hook Form** - https://react-hook-form.com
- **Zod** - https://zod.dev

### Видео туториалы:

- YouTube: "shadcn ui tutorial"
- YouTube: "Next.js 14 tutorial"
- YouTube: "Prisma crash course"

---

## 🐛 Возможные проблемы

### 1. Ошибка при установке зависимостей

```bash
# Очистить кеш
pnpm store prune

# Удалить node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Переустановить
pnpm install
```

### 2. TypeScript ошибки в shadcn компонентах

Убедись что установлены все необходимые @radix-ui пакеты:

```bash
cd apps/web
pnpm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-popover @radix-ui/react-toast
```

### 3. Prisma не генерирует типы

```bash
cd packages/database
pnpm db:generate
```

Если не помогло:
```bash
rm -rf node_modules/.prisma
pnpm db:generate
```

---

## 📝 Чек-лист перед началом

- [ ] Установлен Node.js 18+
- [ ] Установлен pnpm 8+
- [ ] Клонирован репозиторий
- [ ] Выполнен `pnpm install`
- [ ] Запущен PostgreSQL (Docker или локально)
- [ ] Создан `.env` файл с DATABASE_URL
- [ ] Выполнен `pnpm db:push`
- [ ] Запущен `pnpm dev` - приложение работает
- [ ] Открыт http://localhost:3000 - виден Dashboard

---

## 🎯 Философия разработки

**Component-First Development**

```
❌ НЕ ДЕЛАТЬ:
- Создавать UI компоненты с нуля
- Писать CSS вручную
- Придумывать дизайн самостоятельно

✅ ДЕЛАТЬ:
- Искать готовые блоки в Registry
- Копировать и адаптировать
- Фокусироваться на бизнес-логике
- Использовать CSS variables для кастомизации
```

**Принцип:** `Copy-Paste → Customize → Implement Logic`

---

## 💡 Советы

1. **Начни с простого** - сначала статические данные, потом API
2. **Используй Prisma Studio** - удобно для просмотра данных
3. **Проверяй на мобильных** - shadcn компоненты адаптивны, но лучше проверить
4. **Не оптимизируй преждевременно** - сначала работающий код, потом оптимизация
5. **Добавляй анимации из Magic UI** - делает приложение живым

---

**Удачи в разработке! 🚀**

*Следуй плану, используй готовые блоки, фокусируйся на логике!*
