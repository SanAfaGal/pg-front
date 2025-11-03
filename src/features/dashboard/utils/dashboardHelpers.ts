/**
 * Utility functions for formatting data in the dashboard module
 * Centralizes all formatting logic to avoid duplication
 */

import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { RecentActivity } from '../types';

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Fecha inválida';
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Format a datetime string for display
 */
export const formatDateTime = (dateString: string): { date: string; time: string } => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return { date: 'Fecha inválida', time: 'Hora inválida' };
    }
    return {
      date: format(date, 'dd/MM/yyyy', { locale: es }),
      time: format(date, 'HH:mm', { locale: es }),
    };
  } catch {
    return { date: 'Fecha inválida', time: 'Hora inválida' };
  }
};

/**
 * Format a datetime string as relative time (e.g., "hace 2 horas")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Fecha inválida';
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Format activity description with context
 */
export const formatActivityDescription = (activity: RecentActivity): string => {
  // The backend already provides formatted descriptions
  // but we can enhance them if needed
  return activity.description;
};

/**
 * Get activity icon name based on type
 */
export const getActivityIcon = (type: RecentActivity['type']): string => {
  const iconMap: Record<RecentActivity['type'], string> = {
    client_registration: 'UserPlus',
    subscription_created: 'Calendar',
    payment_received: 'DollarSign',
    check_in: 'Activity',
  };
  return iconMap[type] || 'Circle';
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();
  return new Intl.NumberFormat('es-CO').format(num);
};

