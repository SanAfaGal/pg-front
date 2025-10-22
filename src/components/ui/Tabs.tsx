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
      {typeof children === 'function' ? children({ value, onChange }) : children}
    </div>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex items-center gap-1 bg-gray-100 p-1 rounded-lg ${className}`}>
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
        flex-1 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200
        ${isActive
          ? 'bg-white text-powergym-red shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
    <div className="mt-6 animate-fadeIn">
      {children}
    </div>
  );
}
