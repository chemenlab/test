# ⚡ Быстрый старт - CRM для автосервисов

Краткая инструкция для начала работы с проектом.

## 🚀 Локальная разработка

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/crm-autoshop.git
cd crm-autoshop
```

### 2. Установка зависимостей

```bash
# Установить pnpm если не установлен
npm install -g pnpm@8.15.0

# Установить зависимости проекта
pnpm install
```

### 3. Запуск базы данных (Docker)

```bash
# Запустить PostgreSQL и Redis
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 4. Настройка переменных окружения

```bash
# Создать .env для database
cp packages/database/.env.example packages/database/.env

# Создать .env для web
cp apps/web/.env.example apps/web/.env

# Файлы уже содержат правильные настройки для Docker
```

### 5. Применение схемы БД

```bash
cd packages/database
pnpm db:push
cd ../..
```

### 6. Запуск приложения

```bash
# Запуск dev сервера
pnpm dev

# Приложение будет доступно на http://localhost:3000
```

---

## 📦 Production деплой

Для развертывания на production сервере следуйте детальному руководству:

👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Полная инструкция по развертыванию на Ubuntu

---

## 🎯 Что уже реализовано

### ✅ Клиенты (Clients)
- Таблица с сортировкой, поиском, фильтрами
- Добавление/редактирование/удаление клиентов
- Просмотр деталей клиента
- История заказов и автомобилей

**Страница:** `/dashboard/clients`

### ✅ Записи (Bookings)
- Календарь с временными слотами (9:00-20:00)
- Создание записей с выбором клиента, авто, услуги
- Управление статусами (подтверждено, в работе, завершено)
- Фильтры по мастеру и посту

**Страница:** `/dashboard/bookings`

### ✅ Заказы (Orders)
- Список заказов с поиском
- Фильтрация по статусу
- Карточки с информацией о клиенте и авто

**Страница:** `/dashboard/orders`

### ✅ Склад (Warehouse)
- Таблица запчастей
- Алерты низких остатков
- Поиск по артикулу/названию

**Страница:** `/dashboard/warehouse`

### ✅ Аналитика (Analytics)
- KPI карточки (выручка, заказы, клиенты)
- Популярные услуги
- Эффективность мастеров

**Страница:** `/dashboard/analytics`

---

## 🔧 Технологии

- **Frontend:** Next.js 14, TypeScript, shadcn/ui, Tailwind CSS
- **Backend:** Next.js API Routes (готовы для Prisma)
- **Database:** PostgreSQL, Prisma ORM
- **Cache:** Redis
- **UI Components:** @tanstack/react-table, react-day-picker, date-fns
- **Forms:** React Hook Form + Zod
- **Deployment:** PM2, Nginx, Let's Encrypt

---

## 📁 Структура проекта

```
crm-autoshop/
├── apps/
│   ├── web/                    # Main CRM app (Next.js)
│   ├── landing-builder/        # (Planned)
│   └── booking-widget/         # (Planned)
├── packages/
│   ├── database/               # Prisma schema
│   ├── ui/                     # Shared components
│   └── api/                    # API types
├── docker-compose.yml          # PostgreSQL + Redis
├── DEPLOYMENT.md               # Full deployment guide
└── README.md                   # Project overview
```

---

## 🛠️ Полезные команды

### Разработка

```bash
# Запуск dev сервера
pnpm dev

# Сборка проекта
pnpm build

# Lint
pnpm lint

# Форматирование
pnpm format
```

### База данных

```bash
cd packages/database

# Применить схему
pnpm db:push

# Создать миграцию
pnpm db:migrate

# Открыть Prisma Studio
pnpm db:studio
```

### Docker

```bash
# Запуск контейнеров
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart
```

---

## 📚 Документация

- **[README.md](./README.md)** - Обзор проекта
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Деплой на Ubuntu (ПОЛНАЯ ИНСТРУКЦИЯ)
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - План развития
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Руководство для разработчиков
- **[PROGRESS.md](./PROGRESS.md)** - Текущий прогресс разработки

---

## 🐛 Troubleshooting

### Проблема: Ошибки при установке зависимостей

```bash
# Очистить кеш
pnpm store prune
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Переустановить
pnpm install
```

### Проблема: База данных не подключается

```bash
# Проверить что Docker контейнеры запущены
docker-compose ps

# Перезапустить контейнеры
docker-compose restart

# Проверить логи PostgreSQL
docker-compose logs postgres
```

### Проблема: Prisma ошибки

```bash
cd packages/database

# Очистить и пересоздать
rm -rf node_modules/.prisma
pnpm db:generate
pnpm db:push
```

---

## 🎨 Кастомизация

### Изменение цветовой схемы

Редактируйте `apps/web/src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;  /* Ваш основной цвет */
  --secondary: 210 40% 96.1%;    /* Дополнительный цвет */
  /* ... */
}
```

### Добавление новых страниц

```bash
# Создать новую страницу
mkdir -p apps/web/src/app/dashboard/my-page

# Создать page.tsx
touch apps/web/src/app/dashboard/my-page/page.tsx
```

### Добавление компонентов shadcn/ui

```bash
cd apps/web

# Установить новый компонент
npx shadcn@latest add [component-name]

# Пример
npx shadcn@latest add toast
npx shadcn@latest add accordion
```

---

## 💡 Советы

1. **Используйте готовые компоненты** - не создавайте UI с нуля
2. **Следуйте Component-First Development** - Copy → Customize → Implement
3. **Проверяйте на мобильных** - все компоненты адаптивны
4. **Используйте TypeScript** - типизация помогает избежать ошибок
5. **Тестируйте в Docker** - перед деплоем проверьте в Docker окружении

---

## 📞 Поддержка

- **Issues:** [GitHub Issues](https://github.com/yourusername/crm-autoshop/issues)
- **Документация:** См. файлы в корне проекта
- **Email:** support@example.com

---

**Готово к использованию!** 🎉

Следуйте [DEPLOYMENT.md](./DEPLOYMENT.md) для развертывания на production сервере.
