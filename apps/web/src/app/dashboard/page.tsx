import { Users, Calendar, DollarSign, Wrench } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Обзор работы автосервиса за сегодня
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Всего клиентов"
          value="1,234"
          description="от прошлого месяца"
          icon={Users}
          trend={{ value: '12%', positive: true }}
        />
        <StatsCard
          title="Записи сегодня"
          value="8"
          description="5 завершено"
          icon={Calendar}
        />
        <StatsCard
          title="Выручка за месяц"
          value="₽342,500"
          description="от прошлого месяца"
          icon={DollarSign}
          trend={{ value: '8%', positive: true }}
        />
        <StatsCard
          title="Активные заказы"
          value="12"
          description="в работе"
          icon={Wrench}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Последние записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <div className="font-medium">Иван Петров</div>
                    <div className="text-sm text-muted-foreground">
                      Toyota Camry, замена масла
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">14:00</div>
                    <div className="text-sm text-muted-foreground">Пост 2</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Топ мастеров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Алексей С.', orders: 24, revenue: '₽125,000' },
                { name: 'Дмитрий М.', orders: 18, revenue: '₽98,000' },
                { name: 'Сергей К.', orders: 15, revenue: '₽87,500' },
              ].map((master, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{master.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {master.orders} заказов
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{master.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
