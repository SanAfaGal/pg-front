export type DurationType = 'day' | 'week' | 'month' | 'year'

export interface Plan {
  id: string // UUID
  name: string
  slug?: string
  description?: string
  price: string
  currency: string
  duration_unit: DurationType
  duration_count: number
  is_active: boolean
  created_at: string // DateTime
  updated_at: string // DateTime
  meta_info?: Record<string, unknown>
}
