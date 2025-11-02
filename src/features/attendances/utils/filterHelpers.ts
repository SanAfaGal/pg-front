/**
 * Utility functions for attendance filters
 */

export interface DateFilterPreset {
  label: string;
  start_date: Date;
  end_date: Date;
}

/**
 * Get date filter presets (today, this week, this month)
 */
export const getDateFilterPresets = (): DateFilterPreset[] => {
  const now = new Date();
  
  // Today
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // This week (Monday to Sunday)
  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStart.setDate(weekStart.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  // This month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return [
    {
      label: 'Hoy',
      start_date: today,
      end_date: tomorrow,
    },
    {
      label: 'Esta Semana',
      start_date: weekStart,
      end_date: weekEnd,
    },
    {
      label: 'Este Mes',
      start_date: monthStart,
      end_date: monthEnd,
    },
  ];
};

/**
 * Check if filters have active values
 */
export const hasActiveFilters = (filters: Record<string, any>): boolean => {
  return Object.values(filters).some(
    value => value !== undefined && value !== null && value !== ''
  );
};

/**
 * Format date for datetime-local input
 */
export const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

/**
 * Convert datetime-local input value to ISO string
 */
export const parseInputDateToISO = (value: string): string => {
  if (!value) return '';
  return new Date(value).toISOString();
};

