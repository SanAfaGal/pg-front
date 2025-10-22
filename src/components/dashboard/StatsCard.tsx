import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'green' | 'amber';
  trend?: string;
  trendUp?: boolean;
}

const colorStyles = {
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    text: 'text-powergym-charcoal',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-powergym-charcoal',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    text: 'text-powergym-charcoal',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-powergym-charcoal',
  },
};

export const StatsCard = ({ title, value, icon: Icon, color, trend, trendUp }: StatsCardProps) => {
  const styles = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 border border-gray-100 hover:-translate-y-0.5 animate-fade-in">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${styles.icon} rounded-xl`}>
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          {trend && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
      </div>
    </div>
  );
};
