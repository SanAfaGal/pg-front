// Types
export type {
  DashboardData,
  DashboardQueryParams,
  PeriodType,
  PeriodInfo,
  ClientStats,
  SubscriptionStats,
  FinancialStats,
  AttendanceStats,
  InventoryStats,
  RecentActivity,
  Alert,
  AlertType,
  AlertSeverity,
  ActivityType,
} from './types';

// API
export { dashboardApi } from './api/dashboardApi';

// Hooks
export { useDashboard, useRecentActivities, dashboardKeys } from './hooks/useDashboard';
export { useDashboardHome } from './hooks/useDashboardHome';

// Constants
export {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
  PERIOD_TYPES,
  PERIOD_OPTIONS,
  DATE_FORMATS,
  ACTIVITY_TYPE_CONFIG,
  ALERT_SEVERITY_CONFIG,
  NOTIFICATION_MESSAGES,
} from './constants/dashboardConstants';

// Utils
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatActivityDescription,
  getActivityIcon,
  formatPercentage,
  formatNumber,
} from './utils/dashboardHelpers';
export { calculateDateRange } from './utils/dateRangeHelpers';
export { getPeriodLabel, getPeriodLabelShort } from './utils/periodHelpers';

// Components
export { PeriodSelector } from './components/PeriodSelector';
export { DashboardStatsGrid } from './components/DashboardStatsGrid';
export { BaseStatsCard } from './components/BaseStatsCard';
export { ClientStatsCard } from './components/ClientStatsCard';
export { FinancialStatsCard } from './components/FinancialStatsCard';
export { AttendanceStatsCard } from './components/AttendanceStatsCard';
export { InventoryStatsCard } from './components/InventoryStatsCard';
export { RecentActivitiesList } from './components/RecentActivitiesList';
export { AlertsPanel } from './components/AlertsPanel';
export { FloatingAlerts } from './components/FloatingAlerts';
export { DailyFinancialSummary } from './components/DailyFinancialSummary';
export { DashboardHeader } from './components/DashboardHeader';
export { DashboardErrorState } from './components/DashboardErrorState';
