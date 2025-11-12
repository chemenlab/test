'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock данные заказа
const mockOrder = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  status: 'in_progress',
  createdAt: new Date(),
  completedAt: null,
  client: {
    id: '1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
  },
  vehicle: {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    plateNumber: 'А123БВ',
    vin: 'JT2BG22K123456789',
  },
  works: [
    {
      id: '1',
      name: 'Замена масла',
      price: 1500,
      quantity: 1,
      total: 1500,
    },
    {
      id: '2',
      name: 'Замена масляного фильтра',
      price: 500,
      quantity: 1,
      total: 500,
    },
    {
      id: '3',
      name: 'Диагностика двигателя',
      price: 1000,
      quantity: 1,
      total: 1000,
    },
  ],
  parts: [
    {
      id: '1',
      name: 'Моторное масло 5W-40',
      article: 'OIL-5W40-4L',
      price: 2500,
      quantity: 4,
      total: 10000,
    },
    {
      id: '2',
      name: 'Масляный фильтр',
      article: 'FILT-OIL-STD',
      price: 450,
      quantity: 1,
      total: 450,
    },
  ],
  discount: 5,
  notes: 'Клиент просил использовать оригинальные запчасти. Позвонить после завершения работ.',
}

// Mock данные организации
const mockTenant = {
  name: 'СТО АвтоСервис',
  inn: '7701234567',
  address: 'г. Москва, ул. Примерная, д. 123',
  phone: '+7 (495) 123-45-67',
  email: 'info@autoservice.ru',
}

export default function OrderPrintPage() {
  const params = useParams()
  const [order] = React.useState(mockOrder)

  const worksTotal = order.works.reduce((sum, work) => sum + work.total, 0)
  const partsTotal = order.parts.reduce((sum, part) => sum + part.total, 0)
  const subtotal = worksTotal + partsTotal
  const discountAmount = (subtotal * order.discount) / 100
  // For print, we don't apply discount (per requirements)
  const total = subtotal

  const handlePrint = () => {
    window.print()
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Черновик'
      case 'in_progress':
        return 'В работе'
      case 'completed':
        return 'Завершен'
      case 'paid':
        return 'Оплачен'
      case 'canceled':
        return 'Отменен'
      default:
        return status
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            max-width: 100%;
            padding: 20px;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          h1, h2, h3 {
            page-break-after: avoid;
          }
        }

        @media screen {
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <div className="no-print fixed top-4 right-4 z-10">
          <Button onClick={handlePrint} size="lg">
            <Printer className="mr-2 h-5 w-5" />
            Печать
          </Button>
        </div>

        <div className="print-container">
          {/* Заголовок документа */}
          <div className="mb-8 border-b-2 border-gray-800 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{mockTenant.name}</h1>
                <p className="text-sm text-gray-600">ИНН: {mockTenant.inn}</p>
                <p className="text-sm text-gray-600">{mockTenant.address}</p>
                <p className="text-sm text-gray-600">Тел: {mockTenant.phone}</p>
                <p className="text-sm text-gray-600">Email: {mockTenant.email}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">ЗАКАЗ-НАРЯД</h2>
                <p className="text-lg font-semibold mt-1">{order.orderNumber}</p>
                <p className="text-sm text-gray-600 mt-1">
                  от {format(order.createdAt, 'd MMMM yyyy г.', { locale: ru })}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Статус:</span> {getStatusLabel(order.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Информация о клиенте и автомобиле */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-bold mb-3 text-lg border-b border-gray-300 pb-2">Клиент</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-600 w-24">ФИО:</td>
                    <td className="py-1 font-medium">{order.client.name}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">Телефон:</td>
                    <td className="py-1 font-mono">{order.client.phone}</td>
                  </tr>
                  {order.client.email && (
                    <tr>
                      <td className="py-1 text-gray-600">Email:</td>
                      <td className="py-1">{order.client.email}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-bold mb-3 text-lg border-b border-gray-300 pb-2">Автомобиль</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-600 w-24">Марка:</td>
                    <td className="py-1 font-medium">
                      {order.vehicle.brand} {order.vehicle.model}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">Год:</td>
                    <td className="py-1">{order.vehicle.year}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">Гос. номер:</td>
                    <td className="py-1 font-mono font-semibold">{order.vehicle.plateNumber}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">VIN:</td>
                    <td className="py-1 font-mono text-xs">{order.vehicle.vin}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Работы */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-lg">Выполняемые работы</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">№</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Наименование работы</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Цена</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Кол-во</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {order.works.map((work, index) => (
                  <tr key={work.id}>
                    <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{work.name}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {work.price.toLocaleString()} ₽
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{work.quantity}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      {work.total.toLocaleString()} ₽
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">
                    Итого работы:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {worksTotal.toLocaleString()} ₽
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Запчасти */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-lg">Запчасти и материалы</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">№</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Наименование</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Артикул</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Цена</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Кол-во</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {order.parts.map((part, index) => (
                  <tr key={part.id}>
                    <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{part.name}</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-sm">
                      {part.article}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {part.price.toLocaleString()} ₽
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{part.quantity}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      {part.total.toLocaleString()} ₽
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={5} className="border border-gray-300 px-3 py-2 text-right">
                    Итого запчасти:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {partsTotal.toLocaleString()} ₽
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Примечания */}
          {order.notes && (
            <div className="mb-6 border border-gray-300 p-4 rounded">
              <h3 className="font-bold mb-2 text-lg">Примечания</h3>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Итоги */}
          <div className="mb-8 flex justify-end">
            <div className="w-96 border-2 border-gray-800 p-4 rounded">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Работы:</span>
                  <span className="font-medium">{worksTotal.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Запчасти:</span>
                  <span className="font-medium">{partsTotal.toLocaleString()} ₽</span>
                </div>
                <div className="border-t border-gray-400 my-2"></div>
                <div className="flex justify-between text-sm">
                  <span>Промежуточный итог:</span>
                  <span className="font-medium">{subtotal.toLocaleString()} ₽</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-700 no-print">
                    <span>Скидка ({order.discount}%):</span>
                    <span>-{discountAmount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-800 my-2"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>ИТОГО К ОПЛАТЕ:</span>
                  <span>{total.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          </div>

          {/* Подписи */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="mb-8 text-sm">Мастер-приемщик:</p>
                <div className="border-b border-gray-800 mb-1"></div>
                <p className="text-xs text-gray-600 text-center">(подпись, ФИО)</p>
              </div>
              <div>
                <p className="mb-8 text-sm">Клиент:</p>
                <div className="border-b border-gray-800 mb-1"></div>
                <p className="text-xs text-gray-600 text-center">(подпись, ФИО)</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Документ создан {format(new Date(), 'd MMMM yyyy г. в HH:mm', { locale: ru })}</p>
          </div>
        </div>
      </div>
    </>
  )
}
