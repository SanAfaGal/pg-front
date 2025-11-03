import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { RefreshCw, Calendar, Filter } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../features/auth';
import { useToast } from '../shared';
import { useDashboard, useRecentActivities } from '../features/dashboard/hooks/useDashboard';
import { PeriodType } from '../features/dashboard/types';
import { PERIOD_TYPES, NOTIFICATION_MESSAGES, PERIOD_OPTIONS } from '../features/dashboard/constants/dashboardConstants';
import { PeriodSelector } from '../features/dashboard/components/PeriodSelector';
import { DashboardStatsGrid } from '../features/dashboard/components/DashboardStatsGrid';
import { ClientStatsCard } from '../features/dashboard/components/ClientStatsCard';
import { FinancialStatsCard } from '../features/dashboard/components/FinancialStatsCard';
import { AttendanceStatsCard } from '../features/dashboard/components/AttendanceStatsCard';
import { InventoryStatsCard } from '../features/dashboard/components/InventoryStatsCard';
import { RecentActivitiesList } from '../features/dashboard/components/RecentActivitiesList';
import { AlertsPanel } from '../features/dashboard/components/AlertsPanel';
import { DailyFinancialSummary } from '../features/dashboard/components/DailyFinancialSummary';
import { Clients } from './Clients';
import Attendances from './Attendances';
import { InventoryPage } from '../features/inventory';
import { PlansDebug } from '../components/debug/PlansDebug';
import { SimplePlansTest } from '../components/debug/SimplePlansTest';
import { ConfigDebug } from '../components/debug/ConfigDebug';
import { AuthDebug } from '../components/debug/AuthDebug';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  
  // Initialize activeMenuItem from URL hash or localStorage
  const getInitialMenuItem = (): string => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      return hash;
    }
    const saved = localStorage.getItem('dashboard_active_menu');
    return saved || 'home';
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getInitialMenuItem);
  
  // Period and date state for dashboard
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

  // Recent activities query (separate endpoint)
  const {
    data: recentActivities = [],
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useRecentActivities();

  // Handle errors
  useEffect(() => {
    if (dashboardError) {
      const errorMessage = 
        (dashboardError as any)?.response?.data?.detail || 
        (dashboardError as any)?.message || 
        NOTIFICATION_MESSAGES.loadError;
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  }, [dashboardError, showToast]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  // Helper to format period label
  const getPeriodLabel = (): string => {
    const option = PERIOD_OPTIONS.find(opt => opt.value === period);
    return option?.label || period;
  };

  // Helper to format date label
  const getDateLabel = (): string => {
    try {
      const dateObj = parse(date, 'yyyy-MM-dd', new Date());
      return format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return date;
    }
  };

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
        return <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />;
      }

      if (dashboardError || !dashboardData) {
        return (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Error al cargar el dashboard
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {(dashboardError as any)?.message || 'No se pudieron cargar los datos'}
              </p>
              <button
                onClick={() => refetchDashboard()}
                className="px-4 py-2 bg-powergym-red text-white rounded-lg hover:bg-powergym-red-dark transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        );
      }

      const handleRefresh = async () => {
        try {
          await refetchDashboard();
          showToast({
            type: 'success',
            title: 'Dashboard actualizado',
            message: 'Los datos del dashboard se han actualizado correctamente',
          });
        } catch (error) {
          showToast({
            type: 'error',
            title: 'Error',
            message: 'No se pudo actualizar el dashboard',
          });
        }
      };

      return (
        <div className="space-y-6">
          {/* Header with Period Selector and Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Mostrando datos de: <span className="font-semibold text-powergym-charcoal">{getPeriodLabel()}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Fecha de referencia: <span className="font-semibold text-powergym-charcoal">{getDateLabel()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PeriodSelector
                period={period}
                date={date}
                onPeriodChange={setPeriod}
                onDateChange={setDate}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleRefresh}
                disabled={isDashboardRefetching}
                leftIcon={
                  <RefreshCw
                    className={`w-4 h-4 ${isDashboardRefetching ? 'animate-spin' : ''}`}
                  />
                }
                className="whitespace-nowrap"
              >
                {isDashboardRefetching ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>

          {/* Compact Alerts */}
          {dashboardData.alerts.length > 0 && (
            <AlertsPanel alerts={dashboardData.alerts} />
          )}

          {/* Daily Financial Summary - Always shown for the filtered date/period */}
          <DailyFinancialSummary 
            stats={dashboardData.financial_stats} 
            period={period}
            startDate={dashboardData.period.start_date}
            endDate={dashboardData.period.end_date}
          />

          {/* Main Stats Grid */}
          <DashboardStatsGrid data={dashboardData} period={period} />

          {/* Detailed Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientStatsCard stats={dashboardData.client_stats} period={period} />
            <AttendanceStatsCard stats={dashboardData.attendance_stats} period={period} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InventoryStatsCard stats={dashboardData.inventory_stats} />
            <FinancialStatsCard stats={dashboardData.financial_stats} period={period} />
          </div>

          {/* Recent Activities */}
          <RecentActivitiesList 
            activities={recentActivities}
            isLoading={isActivitiesLoading}
          />
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
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
