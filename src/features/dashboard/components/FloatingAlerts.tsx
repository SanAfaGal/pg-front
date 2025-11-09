import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../types';
import { ALERT_SEVERITY_CONFIG } from '../constants/dashboardConstants';
import { formatCurrency } from '../utils/dashboardHelpers';
import { useState } from 'react';

interface FloatingAlertsProps {
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

export const FloatingAlerts = ({ alerts }: FloatingAlertsProps) => {
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert, index) => {
          const key = `${alert.type}-${index}`;
          if (dismissedAlerts.has(key)) return null;
          
          const config = ALERT_SEVERITY_CONFIG[alert.severity];
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDismiss(alert, index)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-2xl
                transition-all duration-200 cursor-pointer
                ${config.bgColor} ${config.borderColor}
                backdrop-blur-sm
              `}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg bg-white/50 ${config.textColor}`}>
                {getAlertIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className={`font-semibold ${config.textColor} text-sm leading-tight`}>
                  {alert.message}
                  {alert.total_amount && (
                    <span className="ml-2 inline-block px-2 py-0.5 bg-white/80 rounded font-bold text-xs">
                      {formatCurrency(alert.total_amount)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(alert, index);
                }}
                className={`
                  flex-shrink-0 p-1 rounded-lg transition-all duration-200
                  ${config.textColor} hover:bg-white/50 hover:scale-110
                `}
                aria-label="Cerrar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

