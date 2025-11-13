#!/bin/bash

# Остановить старый процесс
pkill -f "next start" || true
pkill -f "node.*next.*start" || true

# Подождать пару секунд
sleep 2

# Перейти в директорию проекта
cd /home/user/test/apps/web

# Запустить приложение в фоне
nohup pnpm start > /tmp/crm-autoshop.log 2>&1 &

echo "Приложение перезапущено. Логи: /tmp/crm-autoshop.log"
echo "PID: $!"
