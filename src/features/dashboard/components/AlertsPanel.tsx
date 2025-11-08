import { AlertCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../types';
import { ALERT_SEVERITY_CONFIG } from '../constants/dashboardConstants';
import { formatCurrency } from '../utils/dashboardHelpers';
import { useState } from 'react';
import { Card } from '../../../components/ui/Card';

interface AlertsPanelProps {
  alerts: Alert[];
}

const getAlertIcon = (severity: Alert['severity']) => {
  const iconProps = { className: 'w-4 h-4', strokeWidth: 2.5 };
  
  switch (severity) {
    case 'error':
      return <AlertCircle {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  if (alerts.length === 0) {
    return null;
  }

  const visibleAlerts = alerts.filter((alert, index) => {
    const key = `${alert.type}-${index}`;
    return !dismissedAlerts.has(key);
  });

  if (visibleAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (alert: Alert, index: number) => {
    const key = `${alert.type}-${index}`;
    setDismissedAlerts((prev) => new Set(prev).add(key));
  };

  return (
    <Card padding="sm" className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
      {/* Header Compacto */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex-shrink-0">
            <Bell className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-powergym-charcoal truncate">Alertas</h3>
            <p className="text-xs text-gray-600 hidden sm:block">Notificaciones importantes</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-amber-200 flex-shrink-0">
          <span className="text-xs font-bold text-amber-700">{visibleAlerts.length}</span>
        </div>
      </div>
      
      {/* Alertas Compactas */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => {
            const key = `${alert.type}-${index}`;
            if (dismissedAlerts.has(key)) return null;
            
            const config = ALERT_SEVERITY_CONFIG[alert.severity];
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, transition: { duration: 0.15 } }}
                className={`
                  flex items-start gap-2 p-2.5 rounded-xl border transition-all duration-200
                  ${config.bgColor} ${config.borderColor} hover:shadow-md
                  group
                `}
              >
                <div className={`flex-shrink-0 p-1.5 rounded-lg bg-white/50 ${config.textColor}`}>
                  {getAlertIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${config.textColor} text-xs sm:text-sm leading-tight`}>
                    {alert.message}
                    {alert.total_amount && (
                      <span className="ml-2 inline-block px-2 py-0.5 bg-white/80 rounded font-bold text-xs">
                        {formatCurrency(alert.total_amount)}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(alert, index)}
                  className={`
                    flex-shrink-0 p-1 rounded-lg transition-all duration-200
                    ${config.textColor} hover:bg-white/50 hover:scale-110
                  `}
                  aria-label="Cerrar alerta"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
};
