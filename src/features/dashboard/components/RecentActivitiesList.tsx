import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Activity, UserPlus, Calendar, DollarSign, Clock } from 'lucide-react';
import { RecentActivity } from '../types';
import { formatRelativeTime, formatCurrency, formatDateTime } from '../utils/dashboardHelpers';

interface RecentActivitiesListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const getActivityIconComponent = (type: RecentActivity['type']) => {
  const iconProps = { className: 'w-4 h-4', strokeWidth: 2.5 };
  
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

const getActivityColorScheme = (type: RecentActivity['type']) => {
  const schemes: Record<RecentActivity['type'], {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    badge: string;
  }> = {
    client_registration: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    subscription_created: {
      bg: 'bg-green-50/50',
      border: 'border-green-200',
      iconBg: 'bg-green-500',
      iconColor: 'text-white',
      badge: 'bg-green-100 text-green-700 border-green-200',
    },
    payment_received: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    check_in: {
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
  };
  
  return schemes[type] || {
    bg: 'bg-gray-50/50',
    border: 'border-gray-200',
    iconBg: 'bg-gray-500',
    iconColor: 'text-white',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
  };
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

const getActivityTypeLabel = (type: RecentActivity['type']): string => {
  const labels: Record<RecentActivity['type'], string> = {
    client_registration: 'Registro',
    subscription_created: 'Suscripción',
    payment_received: 'Pago',
    check_in: 'Asistencia',
  };
  return labels[type] || 'Actividad';
};

export const RecentActivitiesList = ({ activities, isLoading = false }: RecentActivitiesListProps) => {
  if (isLoading) {
    return (
      <Card padding="sm" className="bg-white border border-gray-200 shadow-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 flex-shrink-0">
          <div className="p-1.5 bg-gradient-to-br from-powergym-charcoal to-slate-700 rounded-lg shadow-md flex-shrink-0">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-powergym-charcoal truncate">Actividad Reciente</h3>
            <p className="text-xs text-gray-500">Cargando...</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-8 h-8 border-4 border-powergym-red border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card padding="sm" className="bg-white border border-gray-200 shadow-lg h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 flex-shrink-0">
          <div className="p-1.5 bg-gradient-to-br from-powergym-charcoal to-slate-700 rounded-lg shadow-md flex-shrink-0">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-powergym-charcoal truncate">Actividad Reciente</h3>
            <p className="text-xs text-gray-500">Sin eventos</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No hay actividades</p>
          </div>
        </div>
      </Card>
    );
  }

  // Limitar a 5 actividades para mantener compacto
  const displayedActivities = activities.slice(0, 5);

  return (
    <Card padding="sm" className="bg-white border border-gray-200 shadow-lg h-full flex flex-col">
      {/* Header - Consistente con BaseStatsCard */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-gradient-to-br from-powergym-charcoal to-slate-700 rounded-lg shadow-md flex-shrink-0">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-powergym-charcoal truncate">Actividad Reciente</h3>
            <p className="text-xs text-gray-500 hidden sm:block">Últimos eventos</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">{activities.length}</span>
        </div>
      </div>
      
      {/* Timeline Compacto - Altura Limitada con Scroll Interno */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
        <div className="space-y-2 pb-2">
          {displayedActivities.map((activity, index) => {
            const { date } = formatDateTime(activity.timestamp);
            const isPayment = activity.type === 'payment_received' && activity.metadata.amount;
            const relativeTime = formatRelativeTime(activity.timestamp);
            const colorScheme = getActivityColorScheme(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex gap-2 group`}
              >
                {/* Punto del Timeline */}
                <div className="flex-shrink-0 pt-1">
                  <div className={`w-8 h-8 ${colorScheme.iconBg} rounded-lg flex items-center justify-center shadow-md ${colorScheme.iconColor}`}>
                    {getActivityIconComponent(activity.type)}
                  </div>
                </div>
                
                {/* Contenido Compacto */}
                <div className={`flex-1 min-w-0 ${colorScheme.bg} rounded-xl border ${colorScheme.border} p-2.5 shadow-sm transition-all duration-200`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colorScheme.badge} truncate`}>
                          {getActivityTypeLabel(activity.type)}
                        </span>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{relativeTime}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                        {activity.description}
                      </p>
                      {isPayment && activity.metadata.amount && (
                        <div className="mt-1">
                          <div className="inline-block px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold text-xs shadow-md">
                            {formatCurrency(activity.metadata.amount)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Metadata Footer Compacto */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-200/50">
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium truncate">{date}</span>
                    </div>
                    {isPayment && activity.metadata.method && (
                      <div className="px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-medium text-gray-700 truncate">
                        {getPaymentMethodLabel(activity.metadata.method)}
                      </div>
                    )}
                    {activity.metadata.plan_name && (
                      <div className="px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-medium text-gray-700 truncate">
                        {activity.metadata.plan_name}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
