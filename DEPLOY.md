# Инструкция по развертыванию на продакшн-сервере

## Требования
- Node.js версии **18.x** или **20.x** (НЕ используйте 22.x для Next.js 14)
- pnpm

## Шаги для развертывания

### 1. Переключиться на Node.js 18 или 20

```bash
# Проверить текущую версию
node --version

# Если используете nvm, переключитесь на Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Проверить версию снова
node --version  # Должно быть v20.x.x
```

### 2. Обновить код с Git

```bash
cd /home/user/test  # или ваш путь к проекту
git pull origin claude/crm-autoshop-shadcn-setup-011CUyFhmv8dBKReHK4g841H
```

### 3. Переустановить зависимости

```bash
pnpm install
```

### 4. Собрать проект

```bash
pnpm build
```

### 5. Запустить приложение

#### Вариант А: С PM2 (рекомендуется)

```bash
# Установить PM2 глобально (если еще не установлен)
npm install -g pm2

# Остановить старый процесс (если запущен)
pm2 stop crm-autoshop || true
pm2 delete crm-autoshop || true

# Запустить новый процесс
pm2 start ecosystem.config.js

# Проверить статус
pm2 status

# Посмотреть логи
pm2 logs crm-autoshop

# Настроить автозапуск при перезагрузке сервера
pm2 startup
pm2 save
```

#### Вариант Б: Простой скрипт (без PM2)

```bash
# Сделать скрипт исполняемым (если еще не сделано)
chmod +x restart.sh

# Запустить приложение
./restart.sh

# Посмотреть логи
tail -f /tmp/crm-autoshop.log
```

### 6. Проверить работу

```bash
# Проверить, что процесс запущен
ps aux | grep next

# Проверить, что порт 3000 прослушивается
lsof -i :3000

# Проверить через curl
curl http://localhost:3000
```

## Управление приложением

### С PM2:
```bash
pm2 restart crm-autoshop   # Перезапустить
pm2 stop crm-autoshop      # Остановить
pm2 start crm-autoshop     # Запустить
pm2 logs crm-autoshop      # Логи
pm2 status                 # Статус всех процессов
```

### Без PM2:
```bash
./restart.sh               # Перезапустить
tail -f /tmp/crm-autoshop.log  # Логи
pkill -f "next start"      # Остановить
```

## Текущие версии

- **Node.js**: 18.x или 20.x
- **Next.js**: 14.2.33
- **React**: 18.3.0
- **Port**: 3000

## Nginx настройка

Убедитесь, что в вашем nginx конфиге есть проксирование на порт 3000:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

После изменения конфига перезапустите nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### 502 Bad Gateway
- Проверьте, что Next.js процесс запущен: `ps aux | grep next`
- Проверьте логи PM2: `pm2 logs crm-autoshop`
- Перезапустите приложение: `pm2 restart crm-autoshop` или `./restart.sh`

### Port already in use
```bash
# Найти процесс на порту 3000
lsof -i :3000

# Убить процесс
kill -9 <PID>

# Или убить все процессы next
pkill -f "next start"
```

### После git pull ничего не работает
```bash
pnpm install  # Переустановить зависимости
pnpm build    # Пересобрать проект
pm2 restart crm-autoshop  # Перезапустить
```
