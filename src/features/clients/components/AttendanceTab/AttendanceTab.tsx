import { useMemo, useState, useCallback } from 'react';
import { Filter, BarChart3 } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { AnimatePresence, motion } from 'framer-motion';
import { type ClientDashboardResponse } from '../../..';
import { useClientAttendances } from '../../../attendances/hooks/useAttendances';
import { AttendanceFilters, AttendanceFilterOptions } from '../../../attendances';
import { useActiveSubscription } from '../../../subscriptions';
import { useActivePlans } from '../../../plans';
import { parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, isWithinInterval, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { CompactMetrics } from './components/CompactMetrics';
import { RewardProgress } from './components/RewardProgress';
import { CompactAttendanceList } from './components/CompactAttendanceList';

interface AttendanceTabProps {
  dashboard: ClientDashboardResponse | undefined;
}

/**
 * Enhanced attendance metrics interface
 */
interface EnhancedMetrics {
  total: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  last7Days: number;
  last30Days: number;
  averagePerWeek: number;
  averagePerMonth: number;
  lastAttendance: Date | null;
  longestStreak: number;
  currentStreak: number;
}

/**
 * Attendance Tab Component
 * Main component for displaying client attendance information
 * 
 * Features:
 * - Compact attendance metrics
 * - Reward progress indicator (read-only)
 * - Date range filtering
 * - Compact attendance history table
 * - Streak tracking
 */
export function AttendanceTab({ dashboard }: AttendanceTabProps) {
  const clientId = dashboard?.client.id;
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });
  const [filters, setFilters] = useState<AttendanceFilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch attendances with pagination
  const { attendances, isLoading, error } = useClientAttendances(
    clientId || '',
    pagination
  );

  // Get active subscription and plan for reward progress
  const { data: activeSubscription } = useActiveSubscription(clientId || '');
  const { data: activePlans } = useActivePlans();

  const subscriptionPlan = useMemo(() => {
    if (!activeSubscription || !activePlans) return null;
    return activePlans.find(plan => plan.id === activeSubscription.plan_id);
  }, [activeSubscription, activePlans]);

  // Filter attendances locally based on date filters
  const filteredAttendances = useMemo(() => {
    if (!attendances || attendances.length === 0) return [];
    if (!filters.start_date && !filters.end_date) return attendances;

    return attendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      if (filters.start_date) {
        const startDate = parseISO(filters.start_date);
        if (attDate < startDate) return false;
      }
      if (filters.end_date) {
        const endDate = parseISO(filters.end_date);
        if (attDate > endDate) return false;
      }
      return true;
    });
  }, [attendances, filters]);

  // Calculate enhanced metrics
  const metrics = useMemo((): EnhancedMetrics => {
    if (!filteredAttendances || filteredAttendances.length === 0) {
      return {
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        last7Days: 0,
        last30Days: 0,
        averagePerWeek: 0,
        averagePerMonth: 0,
        lastAttendance: null,
        longestStreak: 0,
        currentStreak: 0,
      };
    }

    const now = new Date();
    const weekStart = startOfWeek(now, { locale: es });
    const weekEnd = endOfWeek(now, { locale: es });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const last7Days = subDays(now, 7);
    const last30Days = subDays(now, 30);

    const thisWeekAttendances = filteredAttendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      return isWithinInterval(attDate, { start: weekStart, end: weekEnd });
    });

    const thisMonthAttendances = filteredAttendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      return isWithinInterval(attDate, { start: monthStart, end: monthEnd });
    });

    const thisYearAttendances = filteredAttendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      return isWithinInterval(attDate, { start: yearStart, end: yearEnd });
    });

    const last7DaysAttendances = filteredAttendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      return attDate >= last7Days;
    });

    const last30DaysAttendances = filteredAttendances.filter((att) => {
      const attDate = parseISO(att.check_in);
      return attDate >= last30Days;
    });

    // Calculate streaks
    const sortedAttendances = [...filteredAttendances]
      .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime())
      .map(att => parseISO(att.check_in));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < sortedAttendances.length; i++) {
      const currentDate = sortedAttendances[i];
      
      if (i === 0 && isToday(currentDate)) {
        currentStreak = 1;
      } else if (i > 0) {
        const prevDate = sortedAttendances[i - 1];
        const dayDiff = Math.abs(
          Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        if (dayDiff === 1) {
          tempStreak++;
          if (i === 1 && isToday(currentDate)) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate averages
    const weeksSinceStart = Math.max(1, Math.ceil((now.getTime() - (sortedAttendances[sortedAttendances.length - 1]?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24 * 7)));
    const monthsSinceStart = Math.max(1, Math.ceil((now.getTime() - (sortedAttendances[sortedAttendances.length - 1]?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24 * 30)));

    return {
      total: filteredAttendances.length,
      thisWeek: thisWeekAttendances.length,
      thisMonth: thisMonthAttendances.length,
      thisYear: thisYearAttendances.length,
      last7Days: last7DaysAttendances.length,
      last30Days: last30DaysAttendances.length,
      averagePerWeek: filteredAttendances.length / weeksSinceStart,
      averagePerMonth: filteredAttendances.length / monthsSinceStart,
      lastAttendance: sortedAttendances[0] || null,
      longestStreak,
      currentStreak,
    };
  }, [filteredAttendances]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: AttendanceFilterOptions) => {
    setFilters(newFilters);
    setPagination({ limit: pagination.limit, offset: 0 });
  }, [pagination.limit]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setPagination({ limit: pagination.limit, offset: 0 });
  }, [pagination.limit]);

  // Pagination for displayed items
  const displayedAttendances = useMemo(() => {
    return filteredAttendances.slice(pagination.offset, pagination.offset + pagination.limit);
  }, [filteredAttendances, pagination]);

  const hasActiveFilters = useMemo(() => {
    return !!(filters.start_date || filters.end_date);
  }, [filters]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Reward Progress (Read-only) */}
      <RewardProgress
        activeSubscription={activeSubscription}
        subscriptionPlan={subscriptionPlan}
        attendances={attendances || []}
      />

      {/* Compact Metrics */}
      <CompactMetrics metrics={metrics} />

      {/* Filters Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BarChart3 className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900 truncate">Historial de Asistencias</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="w-3.5 h-3.5" />}
            className="flex-shrink-0"
          >
            {showFilters ? 'Ocultar' : 'Filtros'}
            {hasActiveFilters && (
              <Badge variant="info" size="sm" className="ml-1.5">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-3 sm:p-4 border border-gray-200">
                <AttendanceFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compact Attendance List */}
      <Card className="p-0 border border-gray-200 overflow-hidden">
        <CompactAttendanceList
          attendances={displayedAttendances}
          isLoading={isLoading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          totalCount={attendances?.length || 0}
          onClearFilters={handleClearFilters}
        />
      </Card>
    </div>
  );
}

