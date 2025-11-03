import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Activity, UserPlus, Calendar, DollarSign } from 'lucide-react';
import { RecentActivity } from '../types';
import { formatRelativeTime, formatCurrency, formatDateTime } from '../utils/dashboardHelpers';

interface RecentActivitiesListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const getActivityIconComponent = (type: RecentActivity['type']) => {
  const iconProps = { className: 'w-4 h-4', strokeWidth: 2 };
  
  switch (type) {
    case 'client_registration':
      return <UserPlus {...iconProps} />;
    case 'subscription_created':
      return <Calendar {...iconProps} />;
    case 'payment_received':
      return <DollarSign {...iconProps} />;
    case 'check_in':
      return <Activity {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  const colorMap: Record<RecentActivity['type'], string> = {
    client_registration: 'bg-blue-100 text-blue-600',
    subscription_created: 'bg-green-100 text-green-600',
    payment_received: 'bg-green-100 text-green-600',
    check_in: 'bg-blue-100 text-blue-600',
  };
  
  return colorMap[type] || 'bg-gray-100 text-gray-600';
};

const getPaymentMethodLabel = (method: string | null): string => {
  if (!method) return '';
  const methods: Record<string, string> = {
    cash: 'Efectivo',
    qr: 'QR',
    card: 'Tarjeta',
    transfer: 'Transferencia',
  };
  return methods[method.toLowerCase()] || method;
};

export const RecentActivitiesList = ({ activities, isLoading = false }: RecentActivitiesListProps) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-powergym-charcoal flex items-center gap-2">
            <Activity className="w-5 h-5 text-powergym-red" />
            Actividad Reciente
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-powergym-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando actividades...</p>
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-powergym-charcoal flex items-center gap-2">
            <Activity className="w-5 h-5 text-powergym-red" />
            Actividad Reciente
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay actividades recientes</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-powergym-charcoal flex items-center gap-2">
          <Activity className="w-5 h-5 text-powergym-red" />
          Actividad Reciente
        </h3>
      </div>
      <div className="space-y-2">
        {activities.map((activity) => {
          const { date, time } = formatDateTime(activity.timestamp);
          const isPayment = activity.type === 'payment_received' && activity.metadata.amount;
          
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}>
                {getActivityIconComponent(activity.type)}
              </div>
              
              {activity.client_name && (
                <Avatar name={activity.client_name} size="sm" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-tight">
                  {activity.description}
                  {isPayment && activity.metadata.method && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({getPaymentMethodLabel(activity.metadata.method)})
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400">{date} • {time}</p>
                  {isPayment && (
                    <span className="text-xs font-semibold text-green-600">
                      {formatCurrency(activity.metadata.amount)}
                    </span>
                  )}
                  {activity.metadata.plan_name && (
                    <span className="text-xs text-gray-500">
                      • {activity.metadata.plan_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
