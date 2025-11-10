# 🚗 CRM для автосервисов

Современная CRM-система для автосервисов, построенная на готовых компонентах shadcn/ui.

## 📐 Архитектура

Monorepo структура с использованием pnpm workspaces и Turborepo.

### Apps

- **web** - Основное CRM приложение (Next.js 14 + shadcn/ui)
- **landing-builder** - Генератор лендингов для автосервисов
- **booking-widget** - Встраиваемый виджет онлайн-записи

### Packages

- **database** - Prisma схема и миграции
- **ui** - Общие UI компоненты (shadcn/ui)
- **api** - Backend API

## 🎨 Технологический стек

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- shadcn/ui + Registry компоненты
- Tailwind CSS
- React Query
- Zustand

### Backend
- NestJS / FastAPI
- PostgreSQL
- Prisma ORM
- Redis
- JWT Auth

## ✨ Ключевые возможности

- ✅ **Управление клиентами** - полный CRUD с DataTable, поиском и фильтрацией
- ✅ **Календарь записей** - визуальный календарь с временными слотами
- ✅ **Управление заказами** - отслеживание заказ-нарядов
- ✅ **Склад запчастей** - учет запчастей с алертами остатков
- ✅ **Аналитика** - графики выручки, популярных услуг, эффективности мастеров
- ✅ **Toast уведомления** - красивые уведомления об успехе/ошибках
- ✅ **Готовность к Prisma** - seed данные и миграция на реальную БД
- ✅ **Production ready** - полный deployment гайд для Ubuntu + Nginx

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонирование репозитория
git clone <repo-url>
cd crm-autoshop

# Установка зависимостей
pnpm install

# Копирование .env файла
cp .env.example .env

# Запуск PostgreSQL и Redis через Docker (опционально)
docker-compose up -d

# Запуск dev сервера
pnpm dev

# Приложение будет доступно на http://localhost:3000
```

### Production деплой

Полная инструкция по развертыванию на Ubuntu: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Быстрый деплой Nginx:**
```bash
# Автоматическая установка Nginx конфигураций
sudo bash nginx-configs/setup.sh

# Получение SSL сертификатов
sudo certbot --nginx -d vyborsto.ru -d www.vyborsto.ru
sudo certbot --nginx -d api.vyborsto.ru
```

### Миграция на Prisma

Если хотите использовать реальную PostgreSQL базу данных вместо mock данных:

См. подробную инструкцию: [PRISMA_MIGRATION.md](./PRISMA_MIGRATION.md)

```bash
# Быстрый старт с Prisma
cd packages/database
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## 🎯 Философия разработки

**Component-First Development** - используем готовые блоки из shadcn/ui Registry вместо создания дизайна с нуля.

Принцип: `Copy-Paste → Customize → Implement Logic`

## 📚 Registry компонентов

- [shadcn/ui](https://ui.shadcn.com) - Базовые компоненты
- [Magic UI](https://magicui.design) - Анимации и эффекты
- [Aceternity UI](https://ui.aceternity.com) - Современные блоки
- [Origin UI](https://originui.com) - Формы и паттерны
- [Cult UI](https://www.cult-ui.com) - Продвинутые таблицы

## 📄 Лицензия

MIT
