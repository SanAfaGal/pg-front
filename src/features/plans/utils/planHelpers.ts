import { DurationType } from '../api/types'

/**
 * Formats a currency amount with proper locale and currency symbol
 * Supports multiple currencies (COP, USD, EUR)
 * @param price - The price to format (string or number)
 * @param currency - Currency code (default: 'COP')
 * @returns Formatted currency string (e.g., "$50.000" for COP, "$50.00" for USD)
 */
export const formatPrice = (
  price: string | number,
  currency: string = 'COP'
): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(num)) {
    return typeof price === 'string' ? price : '0';
  }
  
  // For COP, don't show decimals. For other currencies, show 2 decimals
  const minimumFractionDigits = currency === 'COP' ? 0 : 2;
  const maximumFractionDigits = currency === 'COP' ? 0 : 2;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
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
