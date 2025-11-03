/**
 * Dashboard Types
 * Types matching the backend API response structure
 */

export type PeriodType = 'today' | 'week' | 'month' | 'year';

export interface PeriodInfo {
  start_date: string;
  end_date: string;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  new_in_period: number;
  with_active_subscription: number;
  with_expired_subscription: number;
  with_pending_payment: number;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  expired: number;
  pending_payment: number;
  canceled: number;
  scheduled: number;
  expiring_soon: number;
  expired_recently: number;
}

export interface RevenueByMethod {
  cash: string;
  qr?: string;
  card?: string;
  transfer?: string;
}

export interface FinancialStats {
  period_revenue: string;
  pending_debt: string;
  debt_count: number;
  average_payment: string;
  payments_count: number;
  revenue_by_method: RevenueByMethod;
}

export interface AttendanceStats {
  total_attendances: number;
  peak_hour: string;
  average_daily: number;
  unique_visitors: number;
  attendance_rate: number;
}

export interface InventorySalesStats {
  units: number;
  amount: string;
  transactions: number;
}

export interface InventoryStats {
  total_products: number;
  active_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  overstock_count: number;
  total_inventory_value: string;
  total_units: string;
  sales_in_period: InventorySalesStats;
}

export interface RecentActivityMetadata {
  attendance_id: string | null;
  payment_id: string | null;
  amount: string | null;
  method: string | null;
  subscription_id: string | null;
  plan_name: string | null;
}

export type ActivityType =
  | 'client_registration'
  | 'subscription_created'
  | 'payment_received'
  | 'check_in';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  client_id?: string;
  client_name?: string;
  metadata: RecentActivityMetadata;
}

export type AlertType =
  | 'low_stock'
  | 'out_of_stock'
  | 'subscriptions_expiring'
  | 'pending_debt'
  | 'low_attendance'
  | 'system_error';

export type AlertSeverity = 'info' | 'warning' | 'error';

export interface Alert {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  count: number;
  total_amount: string | null;
}

export interface DashboardData {
  period: PeriodInfo;
  client_stats: ClientStats;
  subscription_stats: SubscriptionStats;
  financial_stats: FinancialStats;
  attendance_stats: AttendanceStats;
  inventory_stats: InventoryStats;
  alerts: Alert[];
  generated_at: string;
}

export interface DashboardQueryParams {
  period?: PeriodType;
  date?: string; // YYYY-MM-DD format - used to calculate start_date and end_date
}
