import { DurationType } from '../api/types'

// Formatear precio en pesos colombianos
export const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(num)
}

// Mostrar duración de forma legible
export const formatDuration = (
  count: number,
  unit: DurationType
): string => {
  const units: Record<DurationType, { singular: string; plural: string }> = {
    day: { singular: 'día', plural: 'días' },
    week: { singular: 'semana', plural: 'semanas' },
    month: { singular: 'mes', plural: 'meses' },
    year: { singular: 'año', plural: 'años' },
  }
  
  const { singular, plural } = units[unit]
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}
