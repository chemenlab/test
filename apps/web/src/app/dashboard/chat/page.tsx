'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCheck,
  Search,
  Phone,
  Mail,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'

interface Message {
  id: string
  text: string
  isFromClient: boolean
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  clientEmail: string | null
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    clientId: 'client-1',
    clientName: 'Иван Петров',
    clientPhone: '+7 (999) 123-45-67',
    clientEmail: 'ivan@example.com',
    lastMessage: 'Спасибо, приеду завтра!',
    lastMessageTime: new Date(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        text: 'Здравствуйте! Хочу записаться на замену масла',
        isFromClient: true,
        timestamp: new Date(Date.now() - 3600000 * 2),
        read: true,
      },
      {
        id: 'msg-2',
        text: 'Добрый день! Конечно, есть свободное время завтра в 14:00. Вам подойдет?',
        isFromClient: false,
        timestamp: new Date(Date.now() - 3600000 * 1.5),
        read: true,
      },
      {
        id: 'msg-3',
        text: 'Да, отлично! А сколько будет стоить?',
        isFromClient: true,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 'msg-4',
        text: 'Замена масла с фильтром будет стоить 2500 рублей. Займет около 30 минут.',
        isFromClient: false,
        timestamp: new Date(Date.now() - 1800000),
        read: true,
      },
      {
        id: 'msg-5',
        text: 'Спасибо, приеду завтра!',
        isFromClient: true,
        timestamp: new Date(),
        read: true,
      },
    ],
  },
  {
    id: 'conv-2',
    clientId: 'client-2',
    clientName: 'Мария Сидорова',
    clientPhone: '+7 (999) 234-56-78',
    clientEmail: 'maria@example.com',
    lastMessage: 'Можно ли сделать раньше?',
    lastMessageTime: new Date(Date.now() - 900000),
    unreadCount: 2,
    messages: [
      {
        id: 'msg-6',
        text: 'Здравствуйте! Слышала у вас хороший сервис',
        isFromClient: true,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 'msg-7',
        text: 'Спасибо за обращение! Чем можем помочь?',
        isFromClient: false,
        timestamp: new Date(Date.now() - 3000000),
        read: true,
      },
      {
        id: 'msg-8',
        text: 'Нужно сделать диагностику подвески. Когда можно приехать?',
        isFromClient: true,
        timestamp: new Date(Date.now() - 1800000),
        read: true,
      },
      {
        id: 'msg-9',
        text: 'Ближайшее свободное время послезавтра в 10:00',
        isFromClient: false,
        timestamp: new Date(Date.now() - 1200000),
        read: true,
      },
      {
        id: 'msg-10',
        text: 'Можно ли сделать раньше?',
        isFromClient: true,
        timestamp: new Date(Date.now() - 900000),
        read: false,
      },
    ],
  },
  {
    id: 'conv-3',
    clientId: 'client-3',
    clientName: 'Алексей Смирнов',
    clientPhone: '+7 (999) 345-67-89',
    clientEmail: null,
    lastMessage: 'Добрый день! Хотел узнать про шиномонтаж',
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 1,
    messages: [
      {
        id: 'msg-11',
        text: 'Добрый день! Хотел узнать про шиномонтаж',
        isFromClient: true,
        timestamp: new Date(Date.now() - 7200000),
        read: false,
      },
    ],
  },
  {
    id: 'conv-4',
    clientId: 'client-4',
    clientName: 'Елена Волкова',
    clientPhone: '+7 (999) 456-78-90',
    clientEmail: 'elena@example.com',
    lastMessage: 'Отлично, спасибо!',
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-12',
        text: 'Здравствуйте! Заказ готов?',
        isFromClient: true,
        timestamp: new Date(Date.now() - 90000000),
        read: true,
      },
      {
        id: 'msg-13',
        text: 'Да, можете забирать. Работаем до 18:00',
        isFromClient: false,
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: 'msg-14',
        text: 'Отлично, спасибо!',
        isFromClient: true,
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
    ],
  },
]

export default function ChatPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(
    mockConversations[0]
  )
  const [messageText, setMessageText] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')

  // Auto-scroll to bottom of messages
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  // Filter conversations by search query
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery) return conversations

    return conversations.filter(
      (conv) =>
        conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.clientPhone.includes(searchQuery) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversations, searchQuery])

  // Mark conversation as read when selected
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)

    // Mark messages as read
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversation.id) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true })),
          }
        }
        return conv
      })
    )
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageText,
      isFromClient: false,
      timestamp: new Date(),
      read: true,
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            lastMessageTime: new Date(),
          }
        }
        return conv
      })
    )

    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: messageText,
            lastMessageTime: new Date(),
          }
        : null
    )

    setMessageText('')
    toast.success('Сообщение отправлено')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Чат с клиентами</h1>
        <p className="text-muted-foreground">
          Общение с клиентами в режиме реального времени
          {totalUnread > 0 && (
            <span className="ml-2">
              ({totalUnread} {totalUnread === 1 ? 'новое сообщение' : 'новых сообщений'})
            </span>
          )}
        </p>
      </div>

      {/* Chat Interface */}
      <div className="grid gap-4 md:grid-cols-[350px_1fr]">
        {/* Conversations List */}
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Диалоги
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {totalUnread}
                </Badge>
              )}
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или сообщению..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-18rem)] overflow-y-auto">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/10 border-primary/50 border'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {conversation.clientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {conversation.clientName}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(conversation.lastMessageTime, 'HH:mm', { locale: ru })}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    {searchQuery ? 'Диалоги не найдены' : 'Нет активных диалогов'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        {selectedConversation ? (
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.clientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedConversation.clientName}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedConversation.clientPhone}
                    </span>
                    {selectedConversation.clientEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedConversation.clientEmail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromClient ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isFromClient
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${
                          message.isFromClient
                            ? 'text-muted-foreground'
                            : 'text-primary-foreground/70'
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {format(message.timestamp, 'HH:mm', { locale: ru })}
                        {!message.isFromClient && message.read && (
                          <CheckCheck className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <Separator />

            {/* Message Input */}
            <div className="p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={2}
                  className="resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Нажмите Enter для отправки, Shift+Enter для новой строки
              </p>
            </div>
          </Card>
        ) : (
          <Card className="h-[calc(100vh-12rem)] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Выберите диалог для начала общения</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
