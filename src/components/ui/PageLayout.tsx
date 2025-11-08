import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  noBackground?: boolean;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '',
  noBackground = false,
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen ${noBackground ? '' : 'bg-gray-50'} ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {(title || subtitle || actions) && (
          <div className="mb-3 sm:mb-4 lg:mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
