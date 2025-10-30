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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* Image */}
            <ProductImage 
              url={product.photo_url} 
              name={product.name}
              size="MEDIUM"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatQuantity(product.capacity_value)} {product.unit_type} • {formatCurrency(product.price, product.currency)}
                </p>
              </div>

              {/* Stock info */}
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-mono font-semibold text-gray-900">
                  Stock: <span className="text-powergym-blue-medium">{formatQuantity(product.available_quantity)}</span>
                  {' / '}
                  <span className="text-gray-500">{formatQuantity(product.min_stock)}</span>
                  {' / '}
                  <span className="text-gray-500">{formatQuantity(product.max_stock)}</span>
                </p>
                <StockBadge status={product.stock_status} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
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
                  >
                    <History className="w-3.5 h-3.5 mr-1" />
                    Historial
                  </Button>
                )}
                
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

