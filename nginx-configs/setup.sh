#!/bin/bash

# Скрипт быстрой настройки Nginx для vyborsto.ru
# Использование: sudo bash nginx-configs/setup.sh

set -e

echo "🚀 Установка Nginx конфигураций для vyborsto.ru"
echo "================================================"

# Проверка прав sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Пожалуйста, запустите скрипт с sudo"
    exit 1
fi

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Получаем текущую директорию скрипта
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
echo "Шаг 1: Проверка установки Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "${YELLOW}Nginx не установлен. Устанавливаем...${NC}"
    apt update
    apt install -y nginx
    echo "${GREEN}✓ Nginx установлен${NC}"
else
    echo "${GREEN}✓ Nginx уже установлен${NC}"
fi

echo ""
echo "Шаг 2: Создание директории для certbot..."
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot
echo "${GREEN}✓ Директория создана${NC}"

echo ""
echo "Шаг 3: Копирование конфигураций..."
cp "$SCRIPT_DIR/vyborsto.ru.conf" /etc/nginx/sites-available/
cp "$SCRIPT_DIR/api.vyborsto.ru.conf" /etc/nginx/sites-available/
echo "${GREEN}✓ Конфигурации скопированы${NC}"

echo ""
echo "Шаг 4: Создание симлинков..."
ln -sf /etc/nginx/sites-available/vyborsto.ru.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/api.vyborsto.ru.conf /etc/nginx/sites-enabled/
echo "${GREEN}✓ Симлинки созданы${NC}"

echo ""
echo "Шаг 5: Удаление дефолтной конфигурации..."
rm -f /etc/nginx/sites-enabled/default
echo "${GREEN}✓ Дефолтная конфигурация удалена${NC}"

echo ""
echo "Шаг 6: Тестирование конфигурации Nginx..."
if nginx -t; then
    echo "${GREEN}✓ Конфигурация Nginx валидна${NC}"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

echo ""
echo "Шаг 7: Перезапуск Nginx..."
systemctl restart nginx
echo "${GREEN}✓ Nginx перезапущен${NC}"

echo ""
echo "${GREEN}✅ Установка завершена успешно!${NC}"
echo ""
echo "📝 Следующие шаги:"
echo ""
echo "1. Убедитесь что DNS записи настроены:"
echo "   A     vyborsto.ru          -> $(curl -s ifconfig.me)"
echo "   A     www.vyborsto.ru      -> $(curl -s ifconfig.me)"
echo "   A     api.vyborsto.ru      -> $(curl -s ifconfig.me)"
echo ""
echo "2. Проверьте DNS командами:"
echo "   dig vyborsto.ru +short"
echo "   dig api.vyborsto.ru +short"
echo ""
echo "3. Установите SSL сертификаты:"
echo "   sudo apt install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d vyborsto.ru -d www.vyborsto.ru"
echo "   sudo certbot --nginx -d api.vyborsto.ru"
echo ""
echo "4. Убедитесь что Next.js приложение запущено на порту 3000:"
echo "   pm2 list"
echo ""
echo "5. Откройте в браузере:"
echo "   https://vyborsto.ru"
echo "   https://api.vyborsto.ru/health"
echo ""
