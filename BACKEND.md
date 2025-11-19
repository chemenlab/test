# Инструкция по развертыванию бэкенда CRM Автосервиса

## Описание архитектуры

Проект использует:
- **Next.js 14** - Full-stack фреймворк с API Routes
- **Prisma ORM** - для работы с PostgreSQL
- **PostgreSQL** - реляционная база данных
- **TypeScript** - типизация
- **bcryptjs** - хэширование паролей
- **Монорепозиторий** (Turborepo) с пакетами:
  - `apps/web` - Next.js приложение (фронтенд + API)
  - `packages/database` - Prisma schema и миграции
  - `packages/api` - Общие API утилиты (опционально)

---

## 1. Системные требования

- **Node.js:** >= 18.x (рекомендуется 18.20.8 или 20.x)
- **PostgreSQL:** >= 14.x
- **pnpm:** >= 8.x (менеджер пакетов)
- **Git:** для клонирования репозитория

---

## 2. Установка зависимостей

### 2.1. Установка pnpm (если не установлен)

```bash
npm install -g pnpm
```

### 2.2. Клонирование репозитория

```bash
git clone <URL_РЕПОЗИТОРИЯ>
cd crm-autoshop
```

### 2.3. Установка зависимостей проекта

```bash
pnpm install
```

Это установит зависимости для всех пакетов в монорепозитории.

---

## 3. Настройка базы данных

### 3.1. Создание базы данных PostgreSQL

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте базу данных
CREATE DATABASE crm_autoshop;

# Создайте пользователя (опционально)
CREATE USER crm_user WITH ENCRYPTED PASSWORD 'strong_password';

# Выдайте права
GRANT ALL PRIVILEGES ON DATABASE crm_autoshop TO crm_user;

# Выйдите
\q
```

### 3.2. Настройка переменных окружения

#### Для разработки (`apps/web/.env`)

Создайте файл `.env` в директории `apps/web`:

```bash
# База данных
DATABASE_URL="postgresql://postgres:password@localhost:5432/crm_autoshop?schema=public"

# Next.js
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Режим
NODE_ENV="development"
```

#### Для production (`apps/web/.env.production`)

```bash
# База данных
DATABASE_URL="postgresql://crm_user:strong_password@localhost:5432/crm_autoshop?schema=public"

# Next.js
NEXTAUTH_SECRET="very-secure-random-string-for-production"
NEXTAUTH_URL="https://your-domain.com"

# Режим
NODE_ENV="production"
PORT=3000
```

### 3.3. Генерация Prisma Client

```bash
cd packages/database
pnpm db:generate
```

Это сгенерирует Prisma Client на основе `schema.prisma`.

### 3.4. Применение миграций

```bash
cd packages/database

# Создание и применение миграции
pnpm db:migrate

# Или для production (прямая синхронизация без миграций)
pnpm db:push
```

**Важно:** `db:push` - для быстрого прототипирования. Для production лучше использовать `db:migrate`.

### 3.5. Заполнение базы тестовыми данными (опционально)

```bash
# Установите bcryptjs для seed скрипта
cd packages/database
pnpm add -D bcryptjs @types/bcryptjs

# Запустите seed
pnpm db:seed
```

Это создаст:
- 1 тенант (автосервис)
- 4 пользователя (admin, 2 мастера, закупщик) с паролем `password123`
- 5 услуг
- 3 рабочих поста
- 4 клиента с автомобилями
- 2 записи
- 1 заказ
- 3 запчасти на складе
- Сообщения и заявки на закупку

**Тестовые учетные данные:**
- Admin: `admin@autoservice.ru` / `password123`
- Master 1: `master1@autoservice.ru` / `password123`
- Master 2: `master2@autoservice.ru` / `password123`
- Purchaser: `purchaser@autoservice.ru` / `password123`

---

## 4. Запуск приложения

### 4.1. Режим разработки

```bash
cd apps/web
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`.

### 4.2. Production build

```bash
# Из корня проекта
pnpm build

# Или только web приложение
cd apps/web
pnpm build
```

### 4.3. Запуск production сервера

#### Вариант 1: Простой запуск

```bash
cd apps/web
pnpm start
```

#### Вариант 2: PM2 (рекомендуется)

```bash
# Установка PM2 глобально
npm install -g pm2

# Запуск с использованием ecosystem.config.js из корня проекта
pm2 start ecosystem.config.js

# Просмотр логов
pm2 logs crm-autoshop

# Перезапуск
pm2 restart crm-autoshop

# Остановка
pm2 stop crm-autoshop
```

**Файл `ecosystem.config.js` (корень проекта):**

```javascript
module.exports = {
  apps: [
    {
      name: 'crm-autoshop',
      cwd: '/home/user/test/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

#### Вариант 3: Systemd service (Linux)

Создайте файл `/etc/systemd/system/crm-autoshop.service`:

```ini
[Unit]
Description=CRM AutoShop Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/crm-autoshop/apps/web
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node /var/www/crm-autoshop/apps/web/node_modules/.bin/next start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Затем:

```bash
sudo systemctl daemon-reload
sudo systemctl enable crm-autoshop
sudo systemctl start crm-autoshop
sudo systemctl status crm-autoshop
```

---

## 5. Настройка Nginx (опционально, для production)

### 5.1. Конфигурация Nginx

Создайте файл `/etc/nginx/sites-available/crm-autoshop`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (после установки SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2. Активация конфигурации

```bash
sudo ln -s /etc/nginx/sites-available/crm-autoshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.3. SSL с Let's Encrypt (рекомендуется)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 6. Prisma Studio (GUI для базы данных)

Для визуального просмотра и редактирования данных:

```bash
cd packages/database
pnpm db:studio
```

Откроется браузер на `http://localhost:5555` с интерфейсом для работы с БД.

---

## 7. Полезные команды

### База данных

```bash
cd packages/database

# Сгенерировать Prisma Client
pnpm db:generate

# Создать миграцию
pnpm db:migrate

# Применить схему напрямую (dev)
pnpm db:push

# Заполнить базу тестовыми данными
pnpm db:seed

# Открыть Prisma Studio
pnpm db:studio
```

### Приложение

```bash
cd apps/web

# Разработка
pnpm dev

# Build
pnpm build

# Production start
pnpm start

# Линтинг
pnpm lint
```

### Весь проект (из корня)

```bash
# Установка зависимостей
pnpm install

# Build всех пакетов
pnpm build

# Lint
pnpm lint
```

---

## 8. Структура API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Текущий пользователь

### Клиенты
- `GET /api/clients` - Список клиентов
- `GET /api/clients/[id]` - Детали клиента
- `POST /api/clients` - Создать клиента
- `PUT /api/clients/[id]` - Обновить клиента
- `DELETE /api/clients/[id]` - Удалить клиента

### Записи (Bookings)
- `GET /api/bookings` - Список записей
- `GET /api/bookings/[id]` - Детали записи
- `POST /api/bookings` - Создать запись
- `PUT /api/bookings/[id]` - Обновить запись
- `DELETE /api/bookings/[id]` - Удалить запись

### Услуги
- `GET /api/services` - Список услуг
- `POST /api/services` - Создать услугу
- `PUT /api/services/[id]` - Обновить услугу
- `DELETE /api/services/[id]` - Удалить услугу

### Заказы
- `GET /api/orders` - Список заказов
- `GET /api/orders/[id]` - Детали заказа
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/[id]` - Обновить заказ

### Склад
- `GET /api/warehouse` - Список запчастей
- `POST /api/warehouse` - Добавить запчасть
- `PUT /api/warehouse/[id]` - Обновить запчасть
- `DELETE /api/warehouse/[id]` - Удалить запчасть

### Чат
- `GET /api/messages` - Список сообщений
- `POST /api/messages` - Отправить сообщение

### Заявки на закупку
- `GET /api/purchase-requests` - Список заявок
- `POST /api/purchase-requests` - Создать заявку
- `PUT /api/purchase-requests/[id]` - Обновить/рассмотреть заявку

---

## 9. Переменные окружения

### Обязательные

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `DATABASE_URL` | URL подключения к PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Секретный ключ для NextAuth | `random-64-char-string` |
| `NEXTAUTH_URL` | URL приложения | `http://localhost:3000` |

### Опциональные

| Переменная | Описание | Значение по умолчанию |
|-----------|----------|----------------------|
| `NODE_ENV` | Режим работы | `development` |
| `PORT` | Порт сервера | `3000` |

---

## 10. Troubleshooting

### Проблема: Cannot find module '@prisma/client'

**Решение:**
```bash
cd packages/database
pnpm db:generate
```

### Проблема: Database connection error

**Решение:**
1. Проверьте, что PostgreSQL запущен: `sudo systemctl status postgresql`
2. Проверьте `DATABASE_URL` в `.env`
3. Убедитесь, что база данных создана

### Проблема: Build fails with TypeScript errors

**Решение:**
```bash
# Очистите кэш и пересоберите
rm -rf .next node_modules
pnpm install
pnpm build
```

### Проблема: 502 Bad Gateway (Nginx)

**Решение:**
1. Проверьте, что Next.js запущен: `pm2 status` или `systemctl status crm-autoshop`
2. Проверьте логи: `pm2 logs` или `journalctl -u crm-autoshop`
3. Проверьте порт в Nginx конфиге совпадает с портом Next.js

### Проблема: Seed script fails

**Решение:**
```bash
cd packages/database
pnpm add -D bcryptjs @types/bcryptjs
pnpm db:seed
```

---

## 11. Безопасность

### Production чеклист

- [ ] Смените `NEXTAUTH_SECRET` на случайную строку (64+ символов)
- [ ] Используйте сильные пароли для PostgreSQL
- [ ] Настройте файрволл (только 80, 443, SSH)
- [ ] Настройте SSL/TLS (Let's Encrypt)
- [ ] Ограничьте доступ к PostgreSQL (только localhost)
- [ ] Регулярно обновляйте зависимости
- [ ] Настройте автоматические бэкапы БД
- [ ] Не коммитьте `.env` файлы в Git
- [ ] Используйте rate limiting для API
- [ ] Включите CORS защиту

### Генерация секретного ключа

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 12. Бэкапы базы данных

### Создание бэкапа

```bash
pg_dump -U postgres crm_autoshop > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из бэкапа

```bash
psql -U postgres -d crm_autoshop < backup_20241119_120000.sql
```

### Автоматические бэкапы (cron)

```bash
# Добавьте в crontab (crontab -e):
0 2 * * * pg_dump -U postgres crm_autoshop > /backups/crm_$(date +\%Y\%m\%d).sql
```

---

## 13. Мониторинг

### PM2 мониторинг

```bash
pm2 monit
```

### Логи

```bash
# PM2
pm2 logs crm-autoshop

# Systemd
journalctl -u crm-autoshop -f

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 14. Обновление приложения

```bash
# 1. Стопнуть приложение
pm2 stop crm-autoshop

# 2. Получить изменения
git pull origin main

# 3. Установить зависимости
pnpm install

# 4. Применить миграции БД
cd packages/database
pnpm db:migrate

# 5. Собрать приложение
cd ../../apps/web
pnpm build

# 6. Запустить
pm2 restart crm-autoshop
```

---

## 15. Контакты и поддержка

При возникновении проблем:
- Проверьте логи: `pm2 logs` или `journalctl`
- Проверьте документацию Next.js: https://nextjs.org/docs
- Проверьте документацию Prisma: https://www.prisma.io/docs

---

## Приложение: Пример .env файла

```bash
# .env.example

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/crm_autoshop?schema=public"

# NextAuth
NEXTAUTH_SECRET="change-this-to-random-64-char-string-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
PORT=3000

# Optional: Email (для уведомлений)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASSWORD="your-app-password"

# Optional: S3/Storage (для загрузки файлов)
# S3_BUCKET="crm-autoshop-files"
# S3_REGION="us-east-1"
# S3_ACCESS_KEY=""
# S3_SECRET_KEY=""
```

---

**Готово!** Следуйте инструкциям по порядку, и ваш бэкенд будет развернут и готов к работе.
