import React from 'react';
import { Product, Movement } from '../types';
import { useProductHistory } from '../hooks/useReports';
import { Modal } from '../../../components/ui/Modal';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  Package, 
  X, 
  History as HistoryIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProductHistoryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductImageProps {
  url?: string;
  name: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ url, name }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!url || imageError) {
    return (
      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2 shadow-sm">
      <img
        src={url}
        alt={name}
        className="max-w-full max-h-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

interface MovementRowProps {
  movement: Movement;
}

const MovementRow: React.FC<MovementRowProps> = ({ movement }) => {
  const isEntry = movement.movement_type === 'ENTRY';
  const quantity = parseFloat(movement.quantity);
  const absQuantity = Math.abs(quantity);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
    } catch {
      return date;
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Fecha */}
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(movement.movement_date)}</span>
        </div>
      </td>

      {/* Tipo */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isEntry ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                Entrada
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                Salida
              </span>
            </>
          )}
        </div>
      </td>

      {/* Cantidad */}
      <td className="px-4 py-3">
        <span className={`text-sm font-semibold ${isEntry ? 'text-green-700' : 'text-red-700'}`}>
          {isEntry ? '+' : '-'}{absQuantity}
        </span>
      </td>

      {/* Responsable */}
      <td className="px-4 py-3">
        {movement.responsible ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span>{movement.responsible}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Notas */}
      <td className="px-4 py-3">
        {movement.notes ? (
          <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{movement.notes}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
};

export const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { data: history, isLoading, error } = useProductHistory(product.id, isOpen);

  const formatQuantity = (quantity: string) => {
    return parseFloat(quantity).toFixed(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Historial de Movimientos"
    >
      <div className="p-6">
        {/* Header con info del producto */}
        <Card className="p-4 mb-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <ProductImage url={product.photo_url} name={product.name} />
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatQuantity(product.capacity_value)} {product.unit_type}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-powergym-blue-medium animate-spin mb-3" />
            <p className="text-sm text-gray-600">Cargando historial...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Error al cargar el historial
                </h4>
                <p className="text-sm text-red-700">
                  {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {!isLoading && !error && history && (
          <>
            {/* Stats Cards */}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Stock Actual
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {formatQuantity(product.available_quantity)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HistoryIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Movimientos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {history.total_movements}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Entradas
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {history.entries_count}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      +{formatQuantity(history.total_entries)} unidades
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Salidas
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {history.exits_count}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      -{formatQuantity(history.total_exits)} unidades
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Movements Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">
                  Movimientos Recientes (Últimos 50)
                </h4>
              </div>

              {history.recent_movements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <HistoryIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                    Sin movimientos registrados
                  </h5>
                  <p className="text-sm text-gray-500">
                    Este producto aún no tiene movimientos en el historial
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Responsable
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Notas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.recent_movements.map((movement) => (
                        <MovementRow key={movement.id} movement={movement} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

