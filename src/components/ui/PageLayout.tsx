import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  /** Botón de navegación hacia atrás (se muestra a la izquierda) */
  onBack?: () => void;
  backLabel?: string;
  /** Acciones secundarias (se muestran a la derecha) */
  actions?: ReactNode;
  className?: string;
  noBackground?: boolean;
}

/**
 * PageLayout Component
 * Layout wrapper for pages with optional header, back button, and actions
 * 
 * Features:
 * - Responsive design
 * - Back button on the left
 * - Actions on the right
 * - Clean and professional header
 */
export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  onBack,
  backLabel = 'Volver',
  actions, 
  className = '',
  noBackground = false,
}: PageLayoutProps) {
  const hasHeader = title || subtitle || onBack || actions;

  return (
    <div className={`min-h-screen ${noBackground ? '' : 'bg-gray-50'} ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {hasHeader && (
          <header className="mb-4 sm:mb-5 lg:mb-6">
            {/* Back Button Row - Always on top, left aligned */}
            {onBack && (
              <div className="mb-3 sm:mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="text-gray-600 hover:text-gray-900 -ml-2"
                >
                  <span className="hidden sm:inline">{backLabel}</span>
                  <span className="sm:hidden">Volver</span>
                </Button>
              </div>
            )}

            {/* Title and Actions Row */}
            {(title || subtitle || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {(title || subtitle) && (
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight break-words">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
                {actions && (
                  <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
                    {actions}
                  </div>
                )}
              </div>
            )}
          </header>
        )}
        
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
