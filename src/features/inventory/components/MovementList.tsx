import React from 'react';
import { Movement } from '../types';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  User
} from 'lucide-react';

interface MovementListProps {
  movements: Movement[];
  isLoading?: boolean;
  error?: string;
}

export const MovementList: React.FC<MovementListProps> = ({
  movements,
  isLoading = false,
  error,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'ENTRY':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'EXIT':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-red-600">
        Error: {error}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                    {movement.product_id.slice(0, 8)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {getMovementIcon(movement.movement_type)}
                    <span className="ml-2">{movement.movement_type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {movement.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(movement.movement_date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {movement.responsible ? (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {movement.responsible}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {movement.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
