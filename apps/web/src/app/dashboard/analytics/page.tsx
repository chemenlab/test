'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DollarSign, ShoppingCart, Users, TrendingUp, Wrench, Package } from 'lucide-react'

// Mock данные для графиков
const revenueData = [
  { name: 'Янв', revenue: 185000, orders: 45 },
  { name: 'Фев', revenue: 220000, orders: 52 },
  { name: 'Мар', revenue: 275000, orders: 68 },
  { name: 'Апр', revenue: 305000, orders: 72 },
  { name: 'Май', revenue: 340000, orders: 85 },
  { name: 'Июн', revenue: 390000, orders: 95 },
  { name: 'Июл', revenue: 420000, orders: 105 },
  { name: 'Авг', revenue: 385000, orders: 92 },
  { name: 'Сен', revenue: 355000, orders: 88 },
  { name: 'Окт', revenue: 375000, orders: 90 },
  { name: 'Ноя', revenue: 410000, orders: 98 },
  { name: 'Дек', revenue: 450000, orders: 110 },
]

const servicesData = [
  { name: 'Замена масла', value: 450 },
  { name: 'Диагностика', value: 320 },
  { name: 'Шиномонтаж', value: 280 },
  { name: 'Тормоза', value: 180 },
  { name: 'Подвеска', value: 150 },
  { name: 'Прочее', value: 220 },
]

const mastersData = [
  { name: 'Иванов И.', orders: 125, revenue: 285000, rating: 4.8 },
  { name: 'Петров П.', orders: 98, revenue: 245000, rating: 4.6 },
  { name: 'Сидоров С.', orders: 112, revenue: 268000, rating: 4.7 },
  { name: 'Козлов К.', orders: 87, revenue: 198000, rating: 4.5 },
]

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">
          Отчеты и статистика работы автосервиса
        </p>
      </div>

      {/* KPI Карточки */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽450,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> к прошлому месяцу
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказов</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">110</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> к прошлому месяцу
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новых клиентов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.7%</span> к прошлому месяцу
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽4,091</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.8%</span> к прошлому месяцу
            </p>
          </CardContent>
        </Card>
      </div>

      {/* График выручки */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Выручка по месяцам</CardTitle>
            <CardDescription>Динамика выручки за последние 12 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₽${value.toLocaleString()}`, 'Выручка']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Популярные услуги */}
        <Card>
          <CardHeader>
            <CardTitle>Популярные услуги</CardTitle>
            <CardDescription>Распределение заказов по типам услуг</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Эффективность мастеров */}
        <Card>
          <CardHeader>
            <CardTitle>Эффективность мастеров</CardTitle>
            <CardDescription>Количество выполненных заказов</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mastersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" name="Заказов" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Топ мастера */}
      <Card>
        <CardHeader>
          <CardTitle>Топ мастера по выручке</CardTitle>
          <CardDescription>Рейтинг мастеров за текущий месяц</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mastersData.map((master, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium leading-none">{master.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {master.orders} заказов • ₽{master.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{master.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
