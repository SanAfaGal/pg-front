/**
 * ProductTable Component
 * Table view for product list
 */

import React from 'react';
import { Product } from '../../../types';
import { Button } from '../../../../../components/ui/Button';
import { Edit, Trash2, History, Settings2 } from 'lucide-react';
import { ProductImage } from '../../common/ProductImage';
import { StockBadge } from '../../common/StockBadge';
import { formatCurrency, formatQuantity } from '../../../utils/formatters';

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageStock?: (product: Product) => void;
  onViewHistory?: (product: Product) => void;
}

/**
 * ProductTable - Table layout for products
 */
export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onManageStock,
  onViewHistory,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr 
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Product info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage 
                      url={product.photo_url} 
                      name={product.name}
                      size="SMALL"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatQuantity(product.capacity_value)} {product.unit_type}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                </td>

                {/* Stock info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatQuantity(product.available_quantity)} / {formatQuantity(product.min_stock)} / {formatQuantity(product.max_stock)}
                      </p>
                      <p className="text-xs text-gray-500">Actual / Mín / Máx</p>
                    </div>
                    <StockBadge status={product.stock_status} />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onManageStock && (
                      <Button
                        size="sm"
                        className="bg-powergym-red hover:bg-[#c50202] text-white"
                        onClick={() => onManageStock(product)}
                      >
                        <Settings2 className="w-3.5 h-3.5 mr-1" />
                        Gestionar
                      </Button>
                    )}
                    
                    {onViewHistory && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewHistory(product)}
                        title="Ver historial"
                      >
                        <History className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(product)}
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

