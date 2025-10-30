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
    <div className={`flex items-center gap-0 border-b border-gray-200 ${className}`}>
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
        relative px-4 py-3 font-medium text-sm transition-all duration-200
        flex items-center justify-center
        ${isActive
          ? 'text-[#f60310]'
          : 'text-[#A0A0A0] hover:text-gray-700'
        }
      `}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f60310]" />
      )}
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
