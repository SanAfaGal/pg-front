import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Activity, UserPlus, Calendar, DollarSign, Clock, HeartPulse, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedActivities = activities.slice(startIndex, endIndex);

  // Reiniciar a la primera página cuando cambien las actividades
  useEffect(() => {
    setCurrentPage(0);
  }, [activities.length]);

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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

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
      
      {/* Lista de Actividades con Paginación */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 flex-1"
          >
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
          </motion.div>
        </AnimatePresence>

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
                currentPage === 0
                  ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-sm hover:shadow-md'
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {currentPage + 1} / {totalPages}
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
                currentPage === totalPages - 1
                  ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-sm hover:shadow-md'
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
