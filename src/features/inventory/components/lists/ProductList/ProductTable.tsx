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
import { motion } from 'framer-motion';

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
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                Precio
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <motion.tr 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Product info */}
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ProductImage 
                      url={product.photo_url} 
                      name={product.name}
                      size="SMALL"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatQuantity(product.capacity_value)} {product.unit_type}
                        </p>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 sm:hidden">
                          {formatCurrency(product.price, product.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price - hidden on mobile */}
                <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                </td>

                {/* Stock info */}
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {formatQuantity(product.available_quantity)} / {formatQuantity(product.min_stock)} / {formatQuantity(product.max_stock)}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">Actual / Mín / Máx</p>
                    </div>
                    <StockBadge status={product.stock_status} />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    {onManageStock && (
                      <Button
                        size="sm"
                        className="bg-powergym-red hover:bg-[#c50202] text-white text-xs sm:text-sm"
                        onClick={() => onManageStock(product)}
                      >
                        <Settings2 className="w-3.5 h-3.5 sm:mr-1" />
                        <span className="hidden sm:inline">Gestionar</span>
                      </Button>
                    )}
                    
                    {onViewHistory && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewHistory(product)}
                        title="Ver historial"
                        className="p-1.5 sm:p-2"
                      >
                        <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(product)}
                        title="Editar"
                        className="p-1.5 sm:p-2"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:bg-red-50 p-1.5 sm:p-2"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

