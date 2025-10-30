/**
 * Utility functions for formatting data in the inventory module
 * Centralizes all formatting logic to avoid duplication
 */

/**
 * Formats a currency amount with proper locale and currency symbol
 * @param amount - The amount to format (string or number)
 * @param currency - Currency code (COP, USD, EUR)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (
  amount: string | number,
  currency: string = 'COP'
): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return amount.toString();
  }
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(num);
};

/**
 * Formats a quantity with optional unit
 * @param quantity - The quantity to format (string or number)
 * @param unit - Optional unit to append (kg, ml, etc.)
 * @returns Formatted quantity string
 */
export const formatQuantity = (
  quantity: string | number,
  unit?: string
): string => {
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  
  if (isNaN(num)) {
    return quantity.toString();
  }
  
  const formatted = num.toFixed(0);
  return unit ? `${formatted} ${unit}` : formatted;
};

/**
 * Formats a date string to a localized readable format
 * @param date - Date string or Date object
 * @param formatStr - Optional format string (default: 'dd MMM yyyy, HH:mm')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  formatStr: 'short' | 'long' | 'time' = 'long'
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      ...(formatStr === 'short' && {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      ...(formatStr === 'long' && {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ...(formatStr === 'time' && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    
    return new Intl.DateTimeFormat('es-CO', options).format(dateObj);
  } catch {
    return date.toString();
  }
};

/**
 * Parses a quantity string to a number
 * @param quantity - The quantity string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseQuantity = (quantity: string | number): number => {
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  return isNaN(num) ? 0 : num;
};

/**
 * Formats a phone number with country code
 * @param phone - Phone number string
 * @param countryCode - Country code (e.g., '+57')
 * @returns Formatted phone number
 */
export const formatPhone = (phone: string, countryCode: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\s+/g, '');
  return `${countryCode}${cleaned}`;
};

