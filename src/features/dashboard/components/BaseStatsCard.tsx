import { ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { LucideIcon } from 'lucide-react';

export type IconColor = 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'indigo';

interface BaseStatsCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: IconColor;
  children: ReactNode;
  className?: string;
}

const iconColorStyles: Record<IconColor, { 
  bg: string; 
  icon: string;
  shadow: string;
}> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    icon: 'text-white',
    shadow: 'shadow-blue-500/20',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    icon: 'text-white',
    shadow: 'shadow-green-500/20',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    icon: 'text-white',
    shadow: 'shadow-red-500/20',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    icon: 'text-white',
    shadow: 'shadow-amber-500/20',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    icon: 'text-white',
    shadow: 'shadow-purple-500/20',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    icon: 'text-white',
    shadow: 'shadow-indigo-500/20',
  },
};

export const BaseStatsCard = ({
  title,
  icon: Icon,
  iconColor,
  children,
  className = '',
}: BaseStatsCardProps) => {
  const colorStyles = iconColorStyles[iconColor];

  return (
    <Card 
      padding="sm" 
      className={`
        bg-white border border-gray-200 h-full
        shadow-lg flex flex-col
        ${className}
      `}
    >
      {/* Header Ultra Compacto */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 flex-shrink-0">
        <div className={`p-1.5 ${colorStyles.bg} rounded-lg shadow-md ${colorStyles.shadow} flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${colorStyles.icon}`} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-powergym-charcoal truncate">{title}</h3>
      </div>

      {/* Content - Flexible y Compacto */}
      <div className="flex-1 min-h-0 overflow-auto">
        {children}
      </div>
    </Card>
  );
};
