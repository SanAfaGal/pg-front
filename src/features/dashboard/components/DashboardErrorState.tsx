import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface DashboardErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export const DashboardErrorState = ({ error, onRetry }: DashboardErrorStateProps) => {
  const errorMessage = 
    (error as Error & { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || 
    (error as Error & { message?: string })?.message || 
    'No se pudieron cargar los datos del dashboard';

  return (
    <Card padding="lg" className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Error al cargar el dashboard
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          {errorMessage}
        </p>
        <Button
          variant="primary"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Reintentar
        </Button>
      </div>
    </Card>
  );
};

