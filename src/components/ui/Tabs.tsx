import { ReactNode } from 'react';

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  activeValue: string;
  onChange: (value: string) => void;
}

interface TabsContentProps {
  value: string;
  activeValue: string;
  children: ReactNode;
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  return (
    <div className={className} data-active-tab={value}>
      {children}
    </div>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex items-center gap-0 border-b-2 border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, activeValue, onChange }: TabsTriggerProps) {
  const isActive = value === activeValue;

  return (
    <button
      onClick={() => onChange(value)}
      className={`
        relative flex-initial px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm transition-all duration-200
        flex items-center justify-center gap-2 whitespace-nowrap
        ${isActive
          ? 'text-primary-500 border-b-2 border-primary-500'
          : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, children }: TabsContentProps) {
  if (value !== activeValue) return null;

  return (
    <div className="mt-6 animate-fadeIn w-full">
      {children}
    </div>
  );
}
