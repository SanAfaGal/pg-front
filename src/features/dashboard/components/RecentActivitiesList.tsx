import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Activity, UserPlus, Calendar, DollarSign, Clock, HeartPulse, ArrowRight } from 'lucide-react';
import { RecentActivity } from '../types';
import { formatRelativeTime, formatDateTime } from '../utils/dashboardHelpers';

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

const getActivityColorScheme = (type: RecentActivity['type']) => {
  const schemes: Record<RecentActivity['type'], {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    badge: string;
  }> = {
    client_registration: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    subscription_created: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      iconBg: 'bg-green-500',
      iconColor: 'text-white',
      badge: 'bg-green-50 text-green-700 border-green-200',
    },
    payment_received: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    check_in: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  };
  
  return schemes[type] || {
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    iconBg: 'bg-gray-500',
    iconColor: 'text-white',
    badge: 'bg-gray-50 text-gray-700 border-gray-200',
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
  const maxDisplayed = 4;

  // Estado de carga - solo mostrar skeleton si está cargando Y no hay datos
  if (isLoading && activities.length === 0) {
    return (
      <Card 
        padding="md" 
        className="w-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col min-h-[320px] h-full rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <HeartPulse className="w-5 h-5 text-gray-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  // Estado vacío
  if (activities.length === 0) {
    return (
      <Card 
        padding="md" 
        className="w-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col min-h-[320px] h-full rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <HeartPulse className="w-5 h-5 text-gray-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <p className="text-sm text-gray-500 font-light">Sin eventos</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="p-4 bg-gray-50 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-gray-300" strokeWidth={2} />
          </div>
          <p className="text-sm text-gray-500 font-light">No hay actividades</p>
        </div>
      </Card>
    );
  }

  // Lista de actividades - Máximo 4 eventos sin scroll
  const displayedActivities = activities.slice(0, maxDisplayed);
  const hasMore = activities.length > maxDisplayed;

  return (
    <Card 
      padding="md" 
      className="w-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col min-h-[320px] h-full rounded-2xl"
    >
      {/* Header Moderno */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <HeartPulse className="w-5 h-5 text-indigo-600" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <p className="text-sm text-gray-500 font-light hidden sm:block">Últimos eventos</p>
          </div>
        </div>
        {activities.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
            <span className="text-xs font-medium text-gray-700">{activities.length}</span>
          </div>
        )}
      </div>
      
      {/* Lista de Actividades - Sin Scroll */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {displayedActivities.map((activity, index) => {
            const { date } = formatDateTime(activity.timestamp);
            const isPayment = activity.type === 'payment_received' && activity.metadata.amount;
            const relativeTime = formatRelativeTime(activity.timestamp);
            const colorScheme = getActivityColorScheme(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="flex gap-3 group"
              >
                {/* Ícono del timeline */}
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-xl flex items-center justify-center shadow-sm ${colorScheme.iconColor}`}>
                    {getActivityIconComponent(activity.type)}
                  </div>
                </div>
                
                {/* Contenido de la actividad */}
                <div className={`flex-1 min-w-0 ${colorScheme.bg} rounded-xl border ${colorScheme.border} p-3 transition-all duration-200 hover:shadow-sm`}>
                  <div className="space-y-2">
                    {/* Badge y tiempo relativo */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${colorScheme.badge}`}>
                        {getActivityTypeLabel(activity.type)}
                      </span>
                      <span className="text-xs text-gray-500 font-light">{relativeTime}</span>
                    </div>
                    
                    {/* Descripción */}
                    <p className="text-sm text-gray-900 font-normal leading-relaxed line-clamp-2">
                      {activity.description}
                    </p>
                    
                    {/* Metadata footer */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/60">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-light">
                        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{date}</span>
                      </div>
                      {isPayment && activity.metadata.method && (
                        <span className="px-2 py-0.5 bg-white rounded-md border border-gray-200 text-xs font-normal text-gray-600">
                          {getPaymentMethodLabel(activity.metadata.method)}
                        </span>
                      )}
                      {activity.metadata.plan_name && (
                        <span className="px-2 py-0.5 bg-white rounded-md border border-gray-200 text-xs font-normal text-gray-600">
                          {activity.metadata.plan_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón "Ver más" */}
        {hasMore && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                // Navegar a una página de actividades o mostrar más
                // Por ahora, simplemente hacemos scroll o mostramos más
                window.location.hash = '#activities';
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>Ver más actividades</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
