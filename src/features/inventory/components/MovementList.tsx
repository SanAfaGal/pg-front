import React from 'react';
import { Movement } from '../types';
import { Card } from '../../../components/ui/Card';
import { Package, User } from 'lucide-react';
import { MovementTypeIcon } from './common/MovementTypeIcon';
import { LoadingState } from './common/LoadingState';
import { formatDate } from '../utils/formatters';

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
  if (isLoading) {
    return <LoadingState variant="table" rows={5} />;
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
                  <div className="flex items-center gap-2">
                    <MovementTypeIcon type={movement.movement_type} />
                    <span>{movement.movement_type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {movement.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(movement.movement_date, 'short')}
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
