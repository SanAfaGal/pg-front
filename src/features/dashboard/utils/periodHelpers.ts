import { PeriodType } from '../types';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

/**
 * Obtiene la etiqueta en español para un tipo de período
 * @param period - Tipo de período
 * @returns Etiqueta traducida
 */
export const getPeriodLabel = (period: PeriodType): string => {
  const labels: Record<PeriodType, string> = {
    [PERIOD_TYPES.TODAY]: 'Hoy',
    [PERIOD_TYPES.WEEK]: 'Esta Semana',
    [PERIOD_TYPES.MONTH]: 'Este Mes',
    [PERIOD_TYPES.YEAR]: 'Este Año',
  };
  return labels[period] || 'Período';
};

/**
 * Obtiene la etiqueta corta para un tipo de período (para uso en mobile)
 * @param period - Tipo de período
 * @returns Etiqueta corta
 */
export const getPeriodLabelShort = (period: PeriodType): string => {
  const labels: Record<PeriodType, string> = {
    [PERIOD_TYPES.TODAY]: 'Hoy',
    [PERIOD_TYPES.WEEK]: 'Semana',
    [PERIOD_TYPES.MONTH]: 'Mes',
    [PERIOD_TYPES.YEAR]: 'Año',
  };
  return labels[period] || period;
};

