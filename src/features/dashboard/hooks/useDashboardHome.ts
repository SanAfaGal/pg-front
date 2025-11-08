import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDashboard, useRecentActivities, dashboardKeys } from './useDashboard';
import { useToast } from '../../../shared';
import { PeriodType } from '../types';
import { PERIOD_TYPES, NOTIFICATION_MESSAGES } from '../constants/dashboardConstants';
import { getPeriodLabel } from '../utils/periodHelpers';

/**
 * Hook personalizado para manejar la lógica del dashboard home
 * Extrae toda la lógica de estado, formato y acciones del componente Dashboard
 */
export const useDashboardHome = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Period and date state
  const [period, setPeriod] = useState<PeriodType>(PERIOD_TYPES.MONTH);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Dashboard data query
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isRefetching: isDashboardRefetching,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard({ period, date });

  // Recent activities query
  const {
    data: recentActivities = [],
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useRecentActivities();

  // Helper to format period label
  const periodLabel = useMemo(() => getPeriodLabel(period), [period]);

  // Helper to format date label
  const dateLabel = useMemo(() => {
    try {
      const dateObj = parse(date, 'yyyy-MM-dd', new Date());
      return format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return date;
    }
  }, [date]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      // Invalidate both dashboard data and recent activities
      await Promise.all([
        refetchDashboard(),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.recentActivities() }),
      ]);
      showToast({
        type: 'success',
        title: 'Dashboard actualizado',
        message: 'Los datos del dashboard y actividades recientes se han actualizado correctamente',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar el dashboard',
      });
    }
  }, [refetchDashboard, queryClient, showToast]);

  return {
    // State
    period,
    date,
    setPeriod,
    setDate,
    
    // Data
    dashboardData,
    recentActivities,
    
    // Loading states
    isDashboardLoading,
    isDashboardRefetching,
    isActivitiesLoading,
    
    // Errors
    dashboardError,
    activitiesError,
    
    // Labels
    periodLabel,
    dateLabel,
    
    // Actions
    handleRefresh,
  };
};

