import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, UserPlus, Activity, Calendar } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { apiClient, API_ENDPOINTS, useCache } from '../shared';
import { useAuth } from '../features/auth';
import { Clients } from './Clients';
import Attendances from './Attendances';
import { InventoryPage } from '../features/inventory';
import { PlansDebug } from '../components/debug/PlansDebug';
import { SimplePlansTest } from '../components/debug/SimplePlansTest';
import { ConfigDebug } from '../components/debug/ConfigDebug';
import { AuthDebug } from '../components/debug/AuthDebug';

interface DashboardProps {
  onLogout: () => void;
}

interface DashboardStats {
  totalClients: number;
  activeMembers: number;
  monthlyRevenue: number;
  newSignups: number;
}

interface RecentActivity {
  id: number;
  client: string;
  action: string;
  time: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize activeMenuItem from URL hash or localStorage
  const getInitialMenuItem = (): string => {
    // First check URL hash
    const hash = window.location.hash.substring(1); // Remove the '#'
    if (hash) {
      return hash;
    }
    // Then check localStorage
    const saved = localStorage.getItem('dashboard_active_menu');
    return saved || 'home';
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getInitialMenuItem);
  const { user } = useAuth();

  // Update URL hash and localStorage when menu item changes
  useEffect(() => {
    window.location.hash = activeMenuItem;
    localStorage.setItem('dashboard_active_menu', activeMenuItem);
  }, [activeMenuItem]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setActiveMenuItem(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { data: dashboardData, loading: isDashboardLoading } = useCache<DashboardData>(
    async () => {
      return await apiClient.get<DashboardData>(API_ENDPOINTS.statistics);
    },
    {
      key: 'dashboard_data',
      ttl: 5 * 60 * 1000,
    }
  );

  const stats = dashboardData?.stats || {
    totalClients: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    newSignups: 0,
  };

  const recentActivities = dashboardData?.recentActivities || [];

  const renderContent = () => {
    if (activeMenuItem === 'clients') {
      return <Clients />;
    }

    if (activeMenuItem === 'attendances') {
      return <Attendances />;
    }

    if (activeMenuItem === 'inventory') {
      return <InventoryPage />;
    }

    if (activeMenuItem === 'debug-plans') {
      return <PlansDebug />;
    }

    if (activeMenuItem === 'simple-test') {
      return <SimplePlansTest />;
    }

    if (activeMenuItem === 'config-debug') {
      return <ConfigDebug />;
    }

    if (activeMenuItem === 'auth-debug') {
      return <AuthDebug />;
    }

    if (activeMenuItem === 'home') {
      if (isDashboardLoading) {
        return (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-powergym-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-8">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-powergym-charcoal mb-2">
              Dashboard
            </h2>
            <p className="text-gray-500">
              Resumen general del sistema PowerGym AG
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatsCard
                title="Total Miembros"
                value={stats.totalClients}
                icon={Users}
                color="blue"
                trend="+12%"
                trendUp={true}
              />
              <StatsCard
                title="Miembros Activos"
                value={stats.activeMembers}
                icon={TrendingUp}
                color="green"
                trend="+8%"
                trendUp={true}
              />
              <StatsCard
                title="Ingresos del Mes"
                value={`$${stats.monthlyRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="red"
                trend="+15%"
                trendUp={true}
              />
              <StatsCard
                title="Nuevos este Mes"
                value={stats.newSignups}
                icon={UserPlus}
                color="amber"
                trend="+23%"
                trendUp={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-powergym-charcoal flex items-center gap-2">
                    <Activity className="w-5 h-5 text-powergym-red" />
                    Actividad Reciente
                  </h3>
                  <Badge variant="info">Hoy</Badge>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Avatar name={activity.client} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-powergym-charcoal truncate">
                          {activity.client}
                        </p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-powergym-charcoal mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-powergym-blue-medium" />
                  Clases de Hoy
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-powergym-red/10 to-powergym-blue-medium/10 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-powergym-charcoal">Yoga Matutino</h4>
                      <Badge variant="success">8:00 AM</Badge>
                    </div>
                    <p className="text-sm text-gray-600">12 participantes</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-powergym-charcoal">Spinning</h4>
                      <Badge variant="warning">10:00 AM</Badge>
                    </div>
                    <p className="text-sm text-gray-600">20 participantes</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-powergym-charcoal">CrossFit</h4>
                      <Badge variant="info">6:00 PM</Badge>
                    </div>
                    <p className="text-sm text-gray-600">15 participantes</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem={activeMenuItem}
        onItemClick={setActiveMenuItem}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
