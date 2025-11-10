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
