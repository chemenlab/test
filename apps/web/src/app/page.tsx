import Link from 'next/link'
import { ArrowRight, CheckCircle2, Calendar, Users, Wrench, BarChart3, Package, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">CRM Автосервис</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Возможности
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Тарифы
              </a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </a>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Войти</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              CRM система для автосервисов
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Управляйте клиентами, записями, заказами и складом в одном месте.
              Автоматизируйте работу вашего автосервиса и увеличьте прибыль.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Смотреть демо
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Бесплатный период 14 дней. Кредитная карта не требуется.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Все для эффективной работы автосервиса
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Полный набор инструментов для управления современным автосервисом
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Управление клиентами</CardTitle>
                <CardDescription>
                  База клиентов с историей обращений, автомобилями и заметками
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Детальные профили клиентов
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    История всех обращений
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Учет автомобилей клиентов
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Онлайн-запись</CardTitle>
                <CardDescription>
                  Удобная система бронирования с календарем и уведомлениями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Интерактивный календарь
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    SMS и email уведомления
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Распределение по мастерам
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Заказ-наряды</CardTitle>
                <CardDescription>
                  Создание и управление заказ-нарядами с расчетом стоимости
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Автоматический расчет
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Печать документов
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Статусы выполнения
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Склад запчастей</CardTitle>
                <CardDescription>
                  Учет запчастей с контролем остатков и автозаказом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Контроль остатков
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Уведомления о дефиците
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    История движения
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Аналитика и отчеты</CardTitle>
                <CardDescription>
                  Подробная статистика по выручке, заказам и эффективности
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Графики выручки
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Анализ популярных услуг
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Рейтинг мастеров
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Wrench className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Услуги и прайс</CardTitle>
                <CardDescription>
                  Каталог услуг с ценами и возможностью быстрого поиска
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Категории услуг
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Гибкое ценообразование
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Быстрый поиск
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Прозрачные цены для любого бизнеса
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите тариф, который подходит вашему автосервису
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Стартовый</CardTitle>
                <CardDescription>Для небольших автосервисов</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₽2,990</span>
                  <span className="text-muted-foreground">/мес</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">До 100 клиентов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">1 рабочий пост</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Базовая аналитика</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Email поддержка</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Начать</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <div className="inline-block px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full mb-2">
                  Популярный
                </div>
                <CardTitle>Профессиональный</CardTitle>
                <CardDescription>Для растущего бизнеса</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₽5,990</span>
                  <span className="text-muted-foreground">/мес</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">До 500 клиентов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">5 рабочих постов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Полная аналитика</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">SMS уведомления</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Приоритетная поддержка</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Начать</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Корпоративный</CardTitle>
                <CardDescription>Для сетей автосервисов</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₽14,990</span>
                  <span className="text-muted-foreground">/мес</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Неограниченно клиентов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Неограниченно постов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Мультитенантность</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">API доступ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Персональный менеджер</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Связаться с нами</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Часто задаваемые вопросы
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Как долго длится пробный период?
              </h3>
              <p className="text-muted-foreground">
                Пробный период длится 14 дней. За это время вы получите полный доступ ко всем функциям
                профессионального тарифа без необходимости вводить данные кредитной карты.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Можно ли изменить тариф позже?
              </h3>
              <p className="text-muted-foreground">
                Да, вы можете изменить тариф в любое время. При повышении тарифа новые функции станут
                доступны сразу. При понижении тарифа изменения вступят в силу с начала следующего
                расчетного периода.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Безопасны ли мои данные?
              </h3>
              <p className="text-muted-foreground">
                Безопасность данных — наш приоритет. Мы используем шифрование SSL/TLS для всех соединений,
                регулярно создаем резервные копии и храним данные в защищенных дата-центрах с сертификацией.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Нужно ли устанавливать программное обеспечение?
              </h3>
              <p className="text-muted-foreground">
                Нет, CRM Автосервис работает полностью в облаке. Вам нужен только браузер и подключение
                к интернету. Система доступна с любого устройства: компьютера, планшета или смартфона.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Какая поддержка предоставляется?
              </h3>
              <p className="text-muted-foreground">
                Мы предлагаем поддержку по email для всех тарифов. Клиенты профессионального и
                корпоративного тарифов получают приоритетную поддержку. Корпоративные клиенты также
                получают персонального менеджера.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Можно ли перенести данные из другой системы?
              </h3>
              <p className="text-muted-foreground">
                Да, мы поможем вам перенести данные из вашей текущей системы. На корпоративном тарифе
                доступна помощь персонального менеджера по миграции данных.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к сотням автосервисов, которые уже автоматизировали свою работу
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="ml-2 font-bold">CRM Автосервис</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Современная CRM система для управления автосервисом
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Продукт</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Возможности</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Демо</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Компания</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Связаться</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CRM Автосервис. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
