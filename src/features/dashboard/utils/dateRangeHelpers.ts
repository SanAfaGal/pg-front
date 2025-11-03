/**
 * Date range calculation utilities for dashboard periods
 */

import { format, parse, startOfWeek, startOfMonth, startOfYear, endOfMonth, endOfYear, addDays, subDays } from 'date-fns';
import { PeriodType } from '../types';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

/**
 * Calculate start and end dates for a given period and reference date
 */
export const calculateDateRange = (
  period: PeriodType,
  referenceDate: string // YYYY-MM-DD format
): { start_date: string; end_date: string } => {
  try {
    const refDate = parse(referenceDate, 'yyyy-MM-dd', new Date());
    
    switch (period) {
      case PERIOD_TYPES.TODAY:
        return {
          start_date: format(refDate, 'yyyy-MM-dd'),
          end_date: format(refDate, 'yyyy-MM-dd'),
        };
      
      case PERIOD_TYPES.WEEK:
        // Week containing reference date (Monday to Sunday)
        const weekStart = startOfWeek(refDate, { weekStartsOn: 1 }); // Monday
        const weekEnd = addDays(weekStart, 6); // Sunday
        return {
          start_date: format(weekStart, 'yyyy-MM-dd'),
          end_date: format(weekEnd, 'yyyy-MM-dd'),
        };
      
      case PERIOD_TYPES.MONTH:
        const monthStart = startOfMonth(refDate);
        const monthEnd = endOfMonth(refDate);
        return {
          start_date: format(monthStart, 'yyyy-MM-dd'),
          end_date: format(monthEnd, 'yyyy-MM-dd'),
        };
      
      case PERIOD_TYPES.YEAR:
        const yearStart = startOfYear(refDate);
        const yearEnd = endOfYear(refDate);
        return {
          start_date: format(yearStart, 'yyyy-MM-dd'),
          end_date: format(yearEnd, 'yyyy-MM-dd'),
        };
      
      default:
        // Fallback to today
        const today = format(new Date(), 'yyyy-MM-dd');
        return {
          start_date: today,
          end_date: today,
        };
    }
  } catch (error) {
    // Fallback to today on error
    const today = format(new Date(), 'yyyy-MM-dd');
    return {
      start_date: today,
      end_date: today,
    };
  }
};

