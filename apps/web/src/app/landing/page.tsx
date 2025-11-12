'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Wrench,
  Car,
  Shield,
  Award,
  MessageCircle,
  X,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'

// Mock tenant data (would come from API based on subdomain/slug)
const mockTenant = {
  name: 'Автосервис "Профи"',
  description: 'Профессиональный ремонт и обслуживание автомобилей с 2010 года',
  phone: '+7 (999) 123-45-67',
  email: 'info@autoservice.ru',
  address: 'г. Москва, ул. Автомобильная, д. 15',
  workingHours: 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00',
  services: [
    {
      id: '1',
      name: 'Техническое обслуживание',
      description: 'Полное ТО по регламенту производителя',
      price: 'от 3 500 ₽',
      icon: Wrench,
    },
    {
      id: '2',
      name: 'Диагностика',
      description: 'Компьютерная диагностика всех систем',
      price: 'от 1 500 ₽',
      icon: Car,
    },
    {
      id: '3',
      name: 'Ремонт подвески',
      description: 'Замена амортизаторов, пружин, сайлентблоков',
      price: 'от 5 000 ₽',
      icon: Shield,
    },
    {
      id: '4',
      name: 'Шиномонтаж',
      description: 'Сезонная замена и балансировка колес',
      price: 'от 2 000 ₽',
      icon: Award,
    },
  ],
}

interface ChatMessage {
  id: string
  text: string
  isFromClient: boolean
  timestamp: Date
}

export default function LandingPage() {
  const [chatOpen, setChatOpen] = React.useState(false)
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Здравствуйте! Чем могу помочь?',
      isFromClient: false,
      timestamp: new Date(),
    },
  ])
  const [messageText, setMessageText] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isFromClient: true,
      timestamp: new Date(),
    }

    setChatMessages([...chatMessages, newMessage])
    setMessageText('')

    // Simulate auto-reply
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за сообщение! Наш менеджер свяжется с вами в ближайшее время.',
        isFromClient: false,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, autoReply])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">{mockTenant.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${mockTenant.phone.replace(/\s/g, '')}`}
                className="hidden md:flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {mockTenant.phone}
              </a>
              <Link href="/booking">
                <Button>Записаться онлайн</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Работаем с 2010 года
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {mockTenant.description}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Качественный ремонт и обслуживание вашего автомобиля.
            Опытные мастера, современное оборудование, гарантия на все работы.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Записаться на сервис
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setChatOpen(true)}>
              <MessageCircle className="h-5 w-5" />
              Задать вопрос
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Наши услуги</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Полный спектр услуг по ремонту и обслуживанию автомобилей
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockTenant.services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-primary">{service.price}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Почему выбирают нас</h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Гарантия качества</h4>
              <p className="text-muted-foreground">
                Официальная гарантия на все выполненные работы и запчасти
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Опытные мастера</h4>
              <p className="text-muted-foreground">
                Сертифицированные специалисты с опытом работы более 10 лет
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Удобный график</h4>
              <p className="text-muted-foreground">
                Работаем без выходных, онлайн-запись в удобное время
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Контакты</h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Адрес</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{mockTenant.address}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Телефон</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <a
                  href={`tel:${mockTenant.phone.replace(/\s/g, '')}`}
                  className="text-sm text-primary hover:underline"
                >
                  {mockTenant.phone}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Режим работы</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{mockTenant.workingHours}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {mockTenant.name}. Все права защищены.</p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
          aria-label="Открыть чат"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Онлайн-чат
            </DialogTitle>
            <DialogDescription>
              Задайте вопрос, и мы ответим в ближайшее время
            </DialogDescription>
          </DialogHeader>

          {/* Messages */}
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isFromClient
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Введите сообщение..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Нажмите Enter для отправки
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
