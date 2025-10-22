export interface DashboardStats {
  total_clients: number;
  active_clients: number;
  total_plans: number;
  monthly_revenue: number;
  recent_registrations: number;
}

export interface RecentActivity {
  id: string;
  type: 'client_registration' | 'subscription_created' | 'payment_received';
  description: string;
  timestamp: string;
  client_id?: string;
  client_name?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activities: RecentActivity[];
  revenue_data: RevenueData[];
  top_plans: Array<{
    id: string;
    name: string;
    subscriptions_count: number;
    revenue: number;
  }>;
}
