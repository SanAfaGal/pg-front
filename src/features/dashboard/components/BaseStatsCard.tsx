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
      padding="md" 
      className={`
        bg-white border border-gray-200
        shadow-md hover:shadow-lg transition-shadow duration-300
        flex flex-col
        min-h-[320px] h-full
        rounded-2xl
        ${className}
      `}
    >
      {/* Header Moderno y Minimalista */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className={`p-2.5 ${colorStyles.bg} rounded-xl shadow-sm ${colorStyles.shadow} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colorStyles.icon}`} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
      </div>

      {/* Content - Flexible y Espacioso */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </Card>
  );
};
