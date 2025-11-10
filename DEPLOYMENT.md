# 🚀 Руководство по развертыванию на Ubuntu Server

Полная инструкция по развертыванию CRM для автосервисов на Ubuntu 20.04/22.04 LTS.

## 📋 Содержание

1. [Требования](#требования)
2. [Подготовка сервера](#подготовка-сервера)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка PostgreSQL](#настройка-postgresql)
5. [Настройка Redis](#настройка-redis)
6. [Клонирование и настройка проекта](#клонирование-и-настройка-проекта)
7. [Настройка Nginx](#настройка-nginx)
8. [Настройка SSL (Let's Encrypt)](#настройка-ssl-lets-encrypt)
9. [Настройка PM2 для автозапуска](#настройка-pm2-для-автозапуска)
10. [Мониторинг и логи](#мониторинг-и-логи)
11. [Резервное копирование](#резервное-копирование)
12. [Troubleshooting](#troubleshooting)

---

## Требования

### Минимальные требования сервера

- **OS:** Ubuntu 20.04 или 22.04 LTS
- **RAM:** 2GB минимум (рекомендуется 4GB)
- **CPU:** 2 ядра минимум
- **Disk:** 20GB SSD минимум (рекомендуется 50GB)
- **Доступ:** SSH с root или sudo правами

### Доменное имя

- Зарегистрированный домен (например, `crm.yourdomain.com`)
- DNS записи настроены на IP вашего сервера

---

## Подготовка сервера

### Шаг 1: Подключение к серверу

```bash
ssh root@your_server_ip
# или
ssh username@your_server_ip
```

### Шаг 2: Обновление системы

```bash
# Обновление списка пакетов
sudo apt update

# Обновление установленных пакетов
sudo apt upgrade -y

# Установка необходимых утилит
sudo apt install -y curl wget git build-essential
```

### Шаг 3: Создание пользователя для приложения (опционально, но рекомендуется)

```bash
# Создание пользователя
sudo adduser crm

# Добавление в sudo группу
sudo usermod -aG sudo crm

# Переключение на нового пользователя
su - crm
```

### Шаг 4: Настройка firewall (UFW)

```bash
# Установка UFW если не установлен
sudo apt install -y ufw

# Разрешить SSH
sudo ufw allow OpenSSH

# Разрешить HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

---

## Установка зависимостей

### Шаг 1: Установка Node.js 18.x

```bash
# Добавление NodeSource репозитория
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установка Node.js
sudo apt install -y nodejs

# Проверка установки
node --version  # должно быть v18.x.x
npm --version
```

### Шаг 2: Установка pnpm

```bash
# Установка pnpm глобально
sudo npm install -g pnpm@8.15.0

# Проверка установки
pnpm --version  # должно быть 8.15.0
```

### Шаг 3: Установка PM2 (Process Manager)

```bash
# Установка PM2 глобально
sudo npm install -g pm2

# Проверка установки
pm2 --version
```

---

## Настройка PostgreSQL

### Шаг 1: Установка PostgreSQL 15

```bash
# Добавление PostgreSQL репозитория
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Добавление ключа
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null

# Обновление и установка
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15

# Проверка статуса
sudo systemctl status postgresql
```

### Шаг 2: Создание базы данных и пользователя

```bash
# Переключение на postgres пользователя
sudo -u postgres psql

# В psql консоли выполнить:
```

```sql
-- Создание базы данных
CREATE DATABASE crm_autoshop;

-- Создание пользователя
CREATE USER crm_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';

-- Выдача прав
GRANT ALL PRIVILEGES ON DATABASE crm_autoshop TO crm_user;

-- Дополнительно для PostgreSQL 15+
\c crm_autoshop
GRANT ALL ON SCHEMA public TO crm_user;

-- Выход
\q
```

### Шаг 3: Настройка PostgreSQL для удаленного доступа (если нужно)

```bash
# Редактирование конфига
sudo nano /etc/postgresql/15/main/postgresql.conf

# Найти и изменить строку:
listen_addresses = 'localhost'  # или '*' для всех интерфейсов

# Редактирование pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Добавить строку (если нужен удаленный доступ):
host    all             all             0.0.0.0/0               md5

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### Шаг 4: Проверка подключения

```bash
# Проверка подключения
psql -h localhost -U crm_user -d crm_autoshop

# Должен запроситься пароль, затем откроется psql консоль
# Введите \q для выхода
```

---

## Настройка Redis

### Шаг 1: Установка Redis

```bash
# Установка Redis
sudo apt install -y redis-server

# Проверка статуса
sudo systemctl status redis-server
```

### Шаг 2: Настройка Redis

```bash
# Редактирование конфига
sudo nano /etc/redis/redis.conf

# Найти и изменить (для безопасности):
supervised systemd
maxmemory 256mb
maxmemory-policy allkeys-lru

# Установка пароля (рекомендуется)
requirepass your_redis_password_here

# Перезапуск Redis
sudo systemctl restart redis-server

# Включить автозапуск
sudo systemctl enable redis-server
```

### Шаг 3: Проверка Redis

```bash
# Тест подключения
redis-cli

# В redis-cli:
AUTH your_redis_password_here
PING
# Должно вернуть PONG

# Выход
exit
```

---

## Клонирование и настройка проекта

### Шаг 1: Клонирование репозитория

```bash
# Переход в home директорию
cd ~

# Клонирование проекта
git clone https://github.com/yourusername/crm-autoshop.git

# Переход в директорию проекта
cd crm-autoshop

# Переключение на production ветку (если есть)
git checkout main  # или production
```

### Шаг 2: Установка зависимостей

```bash
# Установка всех зависимостей
pnpm install

# Это может занять несколько минут
```

### Шаг 3: Настройка переменных окружения

```bash
# Создание .env файлов

# 1. Для packages/database
cp packages/database/.env.example packages/database/.env
nano packages/database/.env
```

Содержимое `packages/database/.env`:

```env
DATABASE_URL="postgresql://crm_user:your_strong_password_here@localhost:5432/crm_autoshop?schema=public"
```

```bash
# 2. Для apps/web
cp apps/web/.env.example apps/web/.env
nano apps/web/.env
```

Содержимое `apps/web/.env`:

```env
# Database
DATABASE_URL="postgresql://crm_user:your_strong_password_here@localhost:5432/crm_autoshop?schema=public"

# Redis
REDIS_URL="redis://:your_redis_password_here@localhost:6379"

# NextAuth (сгенерировать секрет)
NEXTAUTH_SECRET="ваш_секретный_ключ_минимум_32_символа"
NEXTAUTH_URL="https://yourdomain.com"

# App
NODE_ENV="production"
PORT=3000
```

**Генерация NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### Шаг 4: Применение Prisma миграций

```bash
# Переход в packages/database
cd ~/crm-autoshop/packages/database

# Генерация Prisma Client
pnpm db:generate

# Применение схемы к базе данных
pnpm db:push

# Возврат в корень проекта
cd ~/crm-autoshop
```

### Шаг 5: Сборка проекта

```bash
# Сборка всех приложений
pnpm build

# Это создаст production билды для всех apps
# Процесс может занять 5-10 минут
```

### Шаг 6: Тестовый запуск

```bash
# Запуск в production режиме
cd ~/crm-autoshop/apps/web
pnpm start

# Приложение должно запуститься на порту 3000
# Ctrl+C для остановки
```

---

## Настройка Nginx

### Шаг 1: Установка Nginx

```bash
# Установка Nginx
sudo apt install -y nginx

# Проверка статуса
sudo systemctl status nginx
```

### Шаг 2: Создание конфигурации для сайта

```bash
# Создание конфига
sudo nano /etc/nginx/sites-available/crm-autoshop
```

Содержимое файла:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Для Let's Encrypt проверки
    location /.well-known/acertme-challenge/ {
        root /var/www/html;
    }

    # Редирект на HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL сертификаты (будут добавлены после установки Let's Encrypt)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Логи
    access_log /var/log/nginx/crm-autoshop-access.log;
    error_log /var/log/nginx/crm-autoshop-error.log;

    # Проксирование на Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Статические файлы Next.js
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Размер загружаемых файлов
    client_max_body_size 20M;
}
```

### Шаг 3: Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/crm-autoshop /etc/nginx/sites-enabled/

# Удаление дефолтного сайта (опционально)
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Должно вывести: syntax is ok, test is successful

# Перезапуск Nginx
sudo systemctl restart nginx

# Включить автозапуск
sudo systemctl enable nginx
```

---

## Настройка SSL (Let's Encrypt)

### Шаг 1: Установка Certbot

```bash
# Установка Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Шаг 2: Получение SSL сертификата

```bash
# Получение сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Следуйте инструкциям:
# 1. Введите email для уведомлений
# 2. Согласитесь с условиями (Y)
# 3. Выберите опцию redirect (2)
```

### Шаг 3: Проверка автообновления

```bash
# Тест автообновления
sudo certbot renew --dry-run

# Если успешно, certbot автоматически обновит сертификаты
```

### Шаг 4: Проверка SSL

Откройте в браузере:
- `https://yourdomain.com`
- Должна появиться зеленая иконка замка в адресной строке

---

## Настройка PM2 для автозапуска

### Шаг 1: Создание PM2 конфигурации

```bash
# Создание файла конфигурации
nano ~/crm-autoshop/ecosystem.config.js
```

Содержимое файла:

```javascript
module.exports = {
  apps: [
    {
      name: 'crm-autoshop-web',
      cwd: '/home/crm/crm-autoshop/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/home/crm/logs/crm-web-error.log',
      out_file: '/home/crm/logs/crm-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',
    },
  ],
}
```

### Шаг 2: Создание директории для логов

```bash
# Создание директории
mkdir -p ~/logs
```

### Шаг 3: Запуск приложения через PM2

```bash
# Переход в корень проекта
cd ~/crm-autoshop

# Запуск PM2
pm2 start ecosystem.config.js

# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs crm-autoshop-web

# Остановка логов: Ctrl+C
```

### Шаг 4: Настройка автозапуска PM2

```bash
# Сохранение текущего списка процессов
pm2 save

# Генерация startup скрипта
pm2 startup systemd

# Скопируйте и выполните команду, которую выведет PM2
# Например:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u crm --hp /home/crm

# Проверка автозапуска (перезагрузка сервера)
sudo reboot

# После перезагрузки подключитесь снова и проверьте:
pm2 status  # приложение должно быть запущено
```

### Шаг 5: Полезные команды PM2

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs crm-autoshop-web

# Перезапуск приложения
pm2 restart crm-autoshop-web

# Остановка приложения
pm2 stop crm-autoshop-web

# Удаление из PM2
pm2 delete crm-autoshop-web

# Мониторинг ресурсов
pm2 monit
```

---

## Мониторинг и логи

### Просмотр логов Nginx

```bash
# Access logs
sudo tail -f /var/log/nginx/crm-autoshop-access.log

# Error logs
sudo tail -f /var/log/nginx/crm-autoshop-error.log
```

### Просмотр логов PostgreSQL

```bash
# Логи PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Просмотр логов приложения

```bash
# Логи PM2
pm2 logs crm-autoshop-web

# Или из файлов
tail -f ~/logs/crm-web-out.log
tail -f ~/logs/crm-web-error.log
```

### Мониторинг системных ресурсов

```bash
# Использование CPU и RAM
htop

# Использование диска
df -h

# PM2 мониторинг
pm2 monit
```

---

## Резервное копирование

### Шаг 1: Скрипт резервного копирования БД

```bash
# Создание директории для бэкапов
mkdir -p ~/backups

# Создание скрипта
nano ~/backup-db.sh
```

Содержимое скрипта:

```bash
#!/bin/bash

# Настройки
DB_NAME="crm_autoshop"
DB_USER="crm_user"
BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/crm_db_$DATE.sql.gz"

# Создание бэкапа
PGPASSWORD="your_strong_password_here" pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "crm_db_*.sql.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE"
```

```bash
# Сделать скрипт исполняемым
chmod +x ~/backup-db.sh

# Тестовый запуск
~/backup-db.sh
```

### Шаг 2: Автоматизация бэкапов через cron

```bash
# Открыть crontab
crontab -e

# Добавить строку (бэкап каждый день в 3 ночи):
0 3 * * * /home/crm/backup-db.sh >> /home/crm/logs/backup.log 2>&1
```

### Шаг 3: Восстановление из бэкапа

```bash
# Восстановление БД из бэкапа
gunzip -c ~/backups/crm_db_2024-11-10_03-00-00.sql.gz | PGPASSWORD="your_strong_password_here" psql -h localhost -U crm_user crm_autoshop
```

---

## Обновление приложения

Когда нужно обновить код на сервере:

```bash
# 1. Перейти в директорию проекта
cd ~/crm-autoshop

# 2. Сохранить изменения (если есть)
git stash

# 3. Получить последние изменения
git pull origin main

# 4. Установить новые зависимости (если есть)
pnpm install

# 5. Применить миграции БД (если есть)
cd packages/database
pnpm db:push
cd ~/crm-autoshop

# 6. Пересобрать проект
pnpm build

# 7. Перезапустить PM2
pm2 restart crm-autoshop-web

# 8. Проверить статус
pm2 status
pm2 logs crm-autoshop-web --lines 50
```

---

## Troubleshooting

### Проблема: Приложение не запускается

```bash
# Проверить логи
pm2 logs crm-autoshop-web

# Проверить порт 3000
sudo netstat -tulpn | grep 3000

# Проверить .env файл
cat ~/crm-autoshop/apps/web/.env
```

### Проблема: Ошибки подключения к БД

```bash
# Проверить PostgreSQL
sudo systemctl status postgresql

# Проверить подключение
psql -h localhost -U crm_user -d crm_autoshop

# Проверить DATABASE_URL в .env
```

### Проблема: Nginx показывает 502 Bad Gateway

```bash
# Проверить что приложение запущено
pm2 status

# Проверить логи Nginx
sudo tail -f /var/log/nginx/crm-autoshop-error.log

# Проверить конфиг Nginx
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

### Проблема: SSL сертификат не работает

```bash
# Проверить сертификат
sudo certbot certificates

# Обновить сертификат
sudo certbot renew

# Проверить конфиг Nginx
sudo nano /etc/nginx/sites-available/crm-autoshop
```

### Проблема: Высокое использование ресурсов

```bash
# Проверить использование
htop

# Проверить PM2 процессы
pm2 monit

# Перезапустить с меньшим количеством инстансов
pm2 delete crm-autoshop-web
# Изменить instances в ecosystem.config.js на 2
pm2 start ecosystem.config.js
```

---

## Финальная проверка

После завершения установки проверьте:

- [ ] `https://yourdomain.com` открывается
- [ ] SSL сертификат валидный (зеленый замок)
- [ ] `pm2 status` показывает приложение как online
- [ ] Логи не содержат критических ошибок
- [ ] База данных подключена (попробуйте создать клиента)
- [ ] Автозапуск работает (перезагрузите сервер)

---

## Контакты и поддержка

При возникновении проблем:

1. Проверьте логи: `pm2 logs`
2. Проверьте Nginx логи: `sudo tail -f /var/log/nginx/crm-autoshop-error.log`
3. Проверьте PostgreSQL: `sudo systemctl status postgresql`

---

**Поздравляем! Ваш CRM для автосервисов развернут на production сервере!** 🎉
