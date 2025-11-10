/**
 * ProductCards Component
 * Card/grid view for product list
 */

import React from 'react';
import { Product } from '../../../types';
import { Card } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/Button';
import { Edit, Trash2, History, Settings2 } from 'lucide-react';
import { ProductImage } from '../../common/ProductImage';
import { StockBadge } from '../../common/StockBadge';
import { formatCurrency, formatQuantity } from '../../../utils/formatters';
import { motion } from 'framer-motion';

interface ProductCardsProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageStock?: (product: Product) => void;
  onViewHistory?: (product: Product) => void;
}

/**
 * ProductCards - Grid/card layout for products
 */
export const ProductCards: React.FC<ProductCardsProps> = ({
  products,
  onEdit,
  onDelete,
  onManageStock,
  onViewHistory,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Image */}
              <div className="flex-shrink-0">
                <ProductImage 
                  url={product.photo_url} 
                  name={product.name}
                  size="MEDIUM"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Header */}
                <div className="mb-2 sm:mb-3 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">
                    {product.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <span>{formatQuantity(product.capacity_value)} {product.unit_type}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-medium text-gray-700">{formatCurrency(product.price, product.currency)}</span>
                  </div>
                </div>

                {/* Stock info */}
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      <span className="text-powergym-blue-medium">{formatQuantity(product.available_quantity)}</span>
                      {' / '}
                      <span className="text-gray-500">{formatQuantity(product.min_stock)}</span>
                      {' / '}
                      <span className="text-gray-500">{formatQuantity(product.max_stock)}</span>
                    </p>
                    <StockBadge status={product.stock_status} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-auto">
                  {onManageStock && (
                    <Button
                      size="sm"
                      className="bg-powergym-red hover:bg-[#c50202] text-white text-xs flex-1 sm:flex-none"
                      onClick={() => onManageStock(product)}
                    >
                      <Settings2 className="w-3.5 h-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Gestionar</span>
                      <span className="sm:hidden">Stock</span>
                    </Button>
                  )}
                  
                  {onViewHistory && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewHistory(product)}
                      className="p-1.5 sm:p-2"
                      title="Ver historial"
                    >
                      <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline ml-1">Historial</span>
                    </Button>
                  )}
                  
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="p-1.5 sm:p-2"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline ml-1">Editar</span>
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
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

