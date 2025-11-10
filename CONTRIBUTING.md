# Руководство по разработке

## 🎯 Философия проекта

Этот проект следует принципу **Component-First Development** - используем готовые блоки из shadcn/ui Registry вместо создания дизайна с нуля.

### Принцип работы

```
Copy-Paste → Customize → Implement Logic
```

## 📋 Правила разработки

### ✅ DO (Делать)

1. **Искать готовые блоки ПЕРЕД написанием кода**
   - Нужна таблица? → shadcn DataTable
   - Нужна форма? → Origin UI Multi-step Form
   - Нужна анимация? → Magic UI

2. **Использовать TypeScript строго**
   - Все компоненты должны быть типизированы
   - Использовать интерфейсы для пропсов
   - Использовать Prisma типы для данных БД

3. **Следовать структуре проекта**
   ```
   apps/web/src/
   ├── app/              # Next.js pages (App Router)
   ├── components/
   │   ├── ui/           # shadcn/ui компоненты
   │   ├── layout/       # Layout компоненты (Sidebar, Header)
   │   └── dashboard/    # Специфичные компоненты dashboard
   ├── lib/              # Утилиты
   └── styles/           # Глобальные стили
   ```

4. **Коммиты должны быть информативными**
   ```
   feat: add client management page with DataTable
   fix: resolve sidebar navigation active state
   refactor: extract stats card into reusable component
   ```

### ❌ DON'T (Не делать)

1. **Не создавать UI компоненты с нуля**
   - 99% уже есть в Registry
   - Потеря времени и несоответствие дизайн-системе

2. **Не переписывать shadcn компоненты**
   - Они оптимизированы
   - Можно сломать accessibility

3. **Не смешивать UI библиотеки**
   - Только shadcn/ui экосистема
   - Не добавлять MUI, Ant Design и т.д.

4. **Не коммитить без проверки**
   - Запустить `pnpm lint`
   - Проверить на ошибки TypeScript
   - Протестировать на мобильных

## 🔧 Настройка окружения

### 1. Установка зависимостей

```bash
# Установить pnpm
npm install -g pnpm@8.15.0

# Установить зависимости
pnpm install
```

### 2. Настройка БД

```bash
# Запустить PostgreSQL и Redis
docker-compose up -d

# Создать .env файл
cp .env.example .env

# Применить схему Prisma
cd packages/database
pnpm db:push

# Открыть Prisma Studio
pnpm db:studio
```

### 3. Запуск проекта

```bash
# Из корня проекта
pnpm dev

# Или только web
cd apps/web
pnpm dev
```

## 📦 Добавление новых компонентов

### Из shadcn/ui

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

### Пример: добавление DataTable

```bash
npx shadcn@latest add data-table
```

Компонент будет добавлен в `apps/web/src/components/ui/`

## 🗄️ Работа с БД

### Создание новой модели

1. Добавить модель в `packages/database/prisma/schema.prisma`
2. Сгенерировать Prisma Client:
   ```bash
   cd packages/database
   pnpm db:generate
   ```
3. Применить изменения к БД:
   ```bash
   pnpm db:push
   ```

### Создание миграции

```bash
cd packages/database
pnpm db:migrate
```

## 🎨 Кастомизация дизайна

### Изменение цветов

Редактировать CSS переменные в `apps/web/src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* и т.д. */
}
```

### Изменение шрифта

Редактировать в `apps/web/src/app/layout.tsx`:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
```

## 🧪 Тестирование

```bash
# Линтинг
pnpm lint

# TypeScript проверка
pnpm type-check

# Форматирование
pnpm format
```

## 📝 Структура коммитов

### Типы коммитов

- `feat:` - новая функциональность
- `fix:` - исправление бага
- `refactor:` - рефакторинг кода
- `style:` - изменения стилей
- `docs:` - документация
- `test:` - тесты
- `chore:` - обновление зависимостей и т.д.

### Примеры

```
feat: add client CRUD with DataTable and filters
fix: resolve sidebar mobile menu close on navigation
refactor: extract stats card into reusable component
style: update dashboard card spacing
docs: add API endpoints documentation
```

## 🚀 Деплой

### Vercel (рекомендуется для Next.js)

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel
```

### Docker

```bash
# Билд
docker build -t crm-autoshop .

# Запуск
docker run -p 3000:3000 crm-autoshop
```

## 📚 Ресурсы

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## ❓ FAQ

### Как добавить новую страницу?

1. Создать папку в `apps/web/src/app/dashboard/[page-name]`
2. Добавить `page.tsx` с компонентом
3. Добавить роут в sidebar (`apps/web/src/components/layout/sidebar.tsx`)

### Как работать с формами?

Использовать React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

### Как добавить API endpoint?

Создать Route Handler в `apps/web/src/app/api/[route]/route.ts`:

```tsx
import { NextResponse } from 'next/server'
import { prisma } from '@crm-autoshop/database'

export async function GET() {
  const clients = await prisma.client.findMany()
  return NextResponse.json(clients)
}
```

---

**Следуй этим правилам и разработка будет быстрой и приятной! 🚀**
