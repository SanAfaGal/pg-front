import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format a date string for display
 */
export const formatAttendanceDate = (dateString: string): string => {
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
export const formatAttendanceDateTime = (dateString: string): { date: string; time: string } => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return { date: 'Fecha inválida', time: 'Hora inválida' };
    }
    return {
      date: format(date, 'dd/MM/yyyy', { locale: es }),
      time: format(date, 'HH:mm:ss', { locale: es }),
    };
  } catch {
    return { date: 'Fecha inválida', time: 'Hora inválida' };
  }
};

/**
 * Format a datetime string with full locale formatting
 */
export const formatAttendanceDateTimeFull = (dateString: string): { date: string; time: string } => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return { date: 'Fecha inválida', time: 'Hora inválida' };
    }
    return {
      date: format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es }),
      time: format(date, 'hh:mm:ss a', { locale: es }),
    };
  } catch {
    return { date: 'Fecha inválida', time: 'Hora inválida' };
  }
};

