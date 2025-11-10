// Client types
export interface Client {
  id: string
  name: string
  phone: string
  email: string | null
  source: string | null
  tags: string[]
  notes: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    bookings: number
    orders: number
  }
}

export interface CreateClientInput {
  name: string
  phone: string
  email?: string
  source?: string
  tags?: string[]
  notes?: string
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string
}

// Booking types
export interface Booking {
  id: string
  clientId: string
  client?: Client
  vehicleId: string
  vehicle?: Vehicle
  serviceId: string
  service?: Service
  masterId: string | null
  master?: User | null
  workPostId: string | null
  workPost?: WorkPost | null
  startTime: Date
  endTime: Date
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'canceled'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateBookingInput {
  clientId: string
  vehicleId: string
  serviceId: string
  masterId?: string
  workPostId?: string
  startTime: Date
  endTime: Date
  notes?: string
  status?: string
}

// Vehicle types
export interface Vehicle {
  id: string
  clientId: string
  brand: string
  model: string
  year: number | null
  vin: string | null
  plateNumber: string | null
  createdAt: Date
  updatedAt: Date
}

// Service types
export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number // в минутах
  category: string | null
  createdAt: Date
  updatedAt: Date
}

// User types (Masters)
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'master' | 'manager'
  avatar: string | null
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

// WorkPost types
export interface WorkPost {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// Time slot type for calendar
export interface TimeSlot {
  time: string
  isAvailable: boolean
  booking?: Booking
}
