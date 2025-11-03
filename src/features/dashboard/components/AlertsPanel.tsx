import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Alert } from '../types';
import { ALERT_SEVERITY_CONFIG } from '../constants/dashboardConstants';
import { formatCurrency } from '../utils/dashboardHelpers';
import { useState } from 'react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const getAlertIcon = (severity: Alert['severity']) => {
  const iconProps = { className: 'w-4 h-4', strokeWidth: 2 };
  
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
    <div className="flex flex-wrap gap-2">
      {alerts.map((alert, index) => {
        if (dismissedAlerts.has(`${alert.type}-${index}`)) return null;
        
        const config = ALERT_SEVERITY_CONFIG[alert.severity];
        
        return (
          <div
            key={`${alert.type}-${index}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.borderColor} ${config.bgColor} text-sm`}
          >
            <div className={`flex-shrink-0 ${config.textColor}`}>
              {getAlertIcon(alert.severity)}
            </div>
            <span className={`font-medium ${config.textColor} flex-1`}>
              {alert.message}
              {alert.total_amount && (
                <span className="ml-1 font-semibold">
                  {formatCurrency(alert.total_amount)}
                </span>
              )}
            </span>
            <button
              onClick={() => handleDismiss(alert, index)}
              className={`flex-shrink-0 ${config.textColor} hover:opacity-75 transition-opacity`}
              aria-label="Cerrar alerta"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
