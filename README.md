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

## 🚀 Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Сборка проекта
pnpm build
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
