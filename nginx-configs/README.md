# Nginx конфигурации для vyborsto.ru

Готовые конфигурационные файлы Nginx для деплоя CRM-системы на домены:
- **vyborsto.ru** - основное веб-приложение
- **api.vyborsto.ru** - API эндпоинты

## 📋 Предварительные требования

1. **DNS записи должны быть настроены:**
   ```
   A     vyborsto.ru          -> IP вашего сервера
   A     www.vyborsto.ru      -> IP вашего сервера
   A     api.vyborsto.ru      -> IP вашего сервера
   ```

2. **Nginx установлен:**
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

3. **Certbot установлен** (для SSL сертификатов):
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

## 🚀 Установка конфигураций

### Шаг 1: Копируем конфигурации

```bash
# Находясь в корне проекта
sudo cp nginx-configs/vyborsto.ru.conf /etc/nginx/sites-available/
sudo cp nginx-configs/api.vyborsto.ru.conf /etc/nginx/sites-available/
```

### Шаг 2: Создаем директорию для certbot

```bash
sudo mkdir -p /var/www/certbot
sudo chown -R www-data:www-data /var/www/certbot
```

### Шаг 3: Активируем конфигурации (БЕЗ SSL)

Сначала активируем только HTTP версии для получения SSL:

```bash
# Временно комментируем SSL части
sudo nano /etc/nginx/sites-available/vyborsto.ru.conf
# Закомментируйте секцию server {} с listen 443

sudo nano /etc/nginx/sites-available/api.vyborsto.ru.conf
# Закомментируйте секцию server {} с listen 443
```

Или используйте упрощенную версию:

```bash
# Создаем симлинки
sudo ln -s /etc/nginx/sites-available/vyborsto.ru.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.vyborsto.ru.conf /etc/nginx/sites-enabled/

# Удаляем дефолтный конфиг
sudo rm /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### Шаг 4: Получаем SSL сертификаты

```bash
# Для основного домена
sudo certbot certonly --nginx -d vyborsto.ru -d www.vyborsto.ru

# Для API поддомена
sudo certbot certonly --nginx -d api.vyborsto.ru
```

### Шаг 5: Раскомментируем SSL секции

```bash
# Возвращаем полные конфигурации с SSL
sudo cp nginx-configs/vyborsto.ru.conf /etc/nginx/sites-available/
sudo cp nginx-configs/api.vyborsto.ru.conf /etc/nginx/sites-available/

# Проверяем
sudo nginx -t

# Перезапускаем
sudo systemctl restart nginx
```

### Шаг 6: Настраиваем автообновление сертификатов

```bash
# Тестируем обновление
sudo certbot renew --dry-run

# Certbot автоматически добавит cron задачу
# Проверить можно так:
sudo systemctl status certbot.timer
```

## ✅ Проверка работоспособности

```bash
# Проверяем статус Nginx
sudo systemctl status nginx

# Проверяем логи
sudo tail -f /var/log/nginx/vyborsto.ru.access.log
sudo tail -f /var/log/nginx/api.vyborsto.ru.access.log

# Проверяем ошибки
sudo tail -f /var/log/nginx/vyborsto.ru.error.log
sudo tail -f /var/log/nginx/api.vyborsto.ru.error.log
```

Тестируем в браузере:
- https://vyborsto.ru - должно открыться приложение
- https://api.vyborsto.ru/health - должен вернуть статус API

## 🔧 Быстрая установка (все команды одной пачкой)

**После того как получили SSL сертификаты:**

```bash
#!/bin/bash

# Копируем конфигурации
sudo cp nginx-configs/vyborsto.ru.conf /etc/nginx/sites-available/
sudo cp nginx-configs/api.vyborsto.ru.conf /etc/nginx/sites-available/

# Создаем симлинки
sudo ln -sf /etc/nginx/sites-available/vyborsto.ru.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api.vyborsto.ru.conf /etc/nginx/sites-enabled/

# Удаляем дефолтный конфиг
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем и перезапускаем
sudo nginx -t && sudo systemctl restart nginx

echo "✅ Nginx конфигурация установлена!"
```

## 📝 Важные замечания

1. **Next.js должен быть запущен на порту 3000:**
   ```bash
   # Проверьте что приложение работает
   pm2 list
   # Должно быть: crm-app-web running на порту 3000
   ```

2. **Файрвол должен разрешать порты 80 и 443:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw reload
   ```

3. **CORS настроен для api.vyborsto.ru:**
   - Разрешен только домен `https://vyborsto.ru`
   - Если нужны другие домены, отредактируйте `Access-Control-Allow-Origin`

4. **Логи ротируются автоматически:**
   - Nginx использует logrotate
   - Старые логи сжимаются и удаляются через 14 дней

## 🐛 Troubleshooting

### Nginx не стартует после добавления SSL

```bash
# Проверьте пути к сертификатам
sudo ls -la /etc/letsencrypt/live/vyborsto.ru/
sudo ls -la /etc/letsencrypt/live/api.vyborsto.ru/

# Проверьте права доступа
sudo chmod 644 /etc/letsencrypt/live/*/fullchain.pem
sudo chmod 600 /etc/letsencrypt/live/*/privkey.pem
```

### 502 Bad Gateway

```bash
# Проверьте что Next.js работает
curl http://localhost:3000

# Проверьте логи приложения
pm2 logs crm-app-web

# Проверьте логи Nginx
sudo tail -f /var/log/nginx/vyborsto.ru.error.log
```

### SSL сертификат не обновляется

```bash
# Проверьте cron/timer
sudo systemctl status certbot.timer

# Попробуйте обновить вручную
sudo certbot renew --force-renewal
```

## 📚 Дополнительная информация

Подробная инструкция по развертыванию всего проекта доступна в [DEPLOYMENT.md](../DEPLOYMENT.md)
