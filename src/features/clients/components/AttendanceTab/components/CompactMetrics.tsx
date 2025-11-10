import { useMemo } from 'react';
import { Activity, Calendar, Clock, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Card } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';
import { motion } from 'framer-motion';

interface EnhancedMetrics {
  total: number;
  thisWeek: number;
  thisMonth: number;
  last7Days: number;
  last30Days: number;
  averagePerWeek: number;
  lastAttendance: Date | null;
  currentStreak: number;
}

interface CompactMetricsProps {
  metrics: EnhancedMetrics;
}

/**
 * Compact Metrics Component
 * Displays key attendance metrics in a space-efficient horizontal layout
 */
export const CompactMetrics = ({ metrics }: CompactMetricsProps) => {
  const keyMetrics = useMemo(() => [
    { label: 'Total', value: metrics.total, icon: Activity, color: 'blue' },
    { label: 'Esta Semana', value: metrics.thisWeek, icon: Calendar, color: 'green' },
    { label: 'Este Mes', value: metrics.thisMonth, icon: Target, color: 'purple' },
    { label: 'Últimos 7d', value: metrics.last7Days, icon: TrendingUp, color: 'indigo' },
  ], [metrics]);

  return (
    <Card className="p-3 sm:p-4 border border-gray-200">
      <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-2 flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-[120px]"
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                metric.color === 'green' ? 'bg-green-100 text-green-600' :
                metric.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-indigo-100 text-indigo-600'
              }`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{metric.label}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            </motion.div>
          );
        })}
        
        {metrics.lastAttendance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="flex items-center gap-2 border-l-0 sm:border-l border-gray-200 pl-0 sm:pl-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0"
          >
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="text-left sm:text-right flex-1 sm:flex-none">
              <p className="text-xs text-gray-500">Racha</p>
              <Badge variant="success" size="sm">{metrics.currentStreak} días</Badge>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

