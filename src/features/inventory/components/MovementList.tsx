import React, { useMemo } from 'react';
import { Movement, Product } from '../types';
import { Card } from '../../../components/ui/Card';
import { Package, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { MovementTypeIcon } from './common/MovementTypeIcon';
import { LoadingState } from './common/LoadingState';
import { formatDate, formatQuantity } from '../utils/formatters';
import { useMediaQuery } from '../../../shared';
import { motion } from 'framer-motion';
import { Badge } from '../../../components/ui/Badge';

interface MovementListProps {
  movements: Movement[];
  isLoading?: boolean;
  error?: string;
  /** Optional products map to display product names instead of IDs */
  products?: Product[];
}

/**
 * MovementList Component
 * Displays inventory movements in a responsive format:
 * - Cards on mobile/tablet
 * - Table on desktop
 * 
 * Features:
 * - Responsive design
 * - Clear visual indicators for entry/exit
 * - Product name display when available
 * - Empty and error states
 * - Loading states
 */
export const MovementList: React.FC<MovementListProps> = ({
  movements,
  isLoading = false,
  error,
  products = [],
}) => {
  const { isMobile, isTablet } = useMediaQuery();
  const isMobileOrTablet = isMobile || isTablet;

  // Create products map for quick lookup
  const productsMap = useMemo(() => {
    return new Map(products.map(product => [product.id, product]));
  }, [products]);

  // Format movements with product names
  const formattedMovements = useMemo(() => {
    return movements.map(movement => {
      const product = productsMap.get(movement.product_id);
      const isEntry = movement.movement_type === 'ENTRY';
      const quantity = parseFloat(movement.quantity);
      const absQuantity = Math.abs(quantity);

      return {
        ...movement,
        productName: product?.name || `ID: ${movement.product_id.slice(0, 8)}`,
        isEntry,
        absQuantity,
        formattedQuantity: formatQuantity(absQuantity),
      };
    });
  }, [movements, productsMap]);

  if (isLoading) {
    return <LoadingState variant="table" rows={5} message="Cargando movimientos..." />;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Error al cargar movimientos</p>
          <p className="text-xs text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-sm font-semibold text-gray-900 mb-1">No hay movimientos registrados</p>
          <p className="text-xs text-gray-500">Los movimientos de inventario aparecerán aquí</p>
        </div>
      </Card>
    );
  }

  // Mobile/Tablet Card View
  if (isMobileOrTablet) {
    return (
      <div className="space-y-3">
        {formattedMovements.map((movement, index) => (
          <motion.div
            key={movement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            <Card className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
              {/* Header: Product and Type */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {movement.productName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <MovementTypeIcon type={movement.movement_type} size="sm" />
                    <Badge
                      variant={movement.isEntry ? 'success' : 'error'}
                      size="sm"
                      className="text-xs"
                    >
                      {movement.isEntry ? 'Entrada' : 'Salida'}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-lg font-bold ${
                      movement.isEntry ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movement.isEntry ? '+' : '-'}{movement.formattedQuantity}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="text-sm text-gray-900 truncate">
                      {formatDate(movement.movement_date, 'short')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className={`w-3.5 h-3.5 flex-shrink-0 ${movement.responsible ? 'text-gray-400' : 'text-gray-300'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Responsable</p>
                    <p className={`text-sm truncate ${movement.responsible ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {movement.responsible || 'No asignado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {movement.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Notas</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{movement.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <Card className="p-0 border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {formattedMovements.map((movement, index) => (
              <motion.tr
                key={movement.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {movement.productName}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MovementTypeIcon type={movement.movement_type} size="sm" />
                    <Badge
                      variant={movement.isEntry ? 'success' : 'error'}
                      size="sm"
                    >
                      {movement.isEntry ? 'Entrada' : 'Salida'}
                    </Badge>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${
                      movement.isEntry ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movement.isEntry ? '+' : '-'}{movement.formattedQuantity}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {formatDate(movement.movement_date, 'short')}
                    </span>
                  </div>
                </td>

                {/* Responsible */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 flex-shrink-0 ${movement.responsible ? 'text-gray-400' : 'text-gray-300'}`} />
                    <span className={`text-sm ${movement.responsible ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                      {movement.responsible || 'No asignado'}
                    </span>
                  </div>
                </td>

                {/* Notes */}
                <td className="px-4 py-3">
                  {movement.notes ? (
                    <div className="flex items-start gap-2 max-w-xs">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 line-clamp-2">{movement.notes}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
