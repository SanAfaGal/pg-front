import React, { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { useAddStock, useRemoveStock } from '../hooks/useStock';
import { useMovements } from '../hooks/useMovements';
import { ProductList } from '../components/lists/ProductList';
import { ProductForm } from '../components/ProductForm';
import { StockManagement } from '../components/StockManagement';
import { MovementList } from '../components/MovementList';
import { InventoryReports } from '../components/InventoryReports';
import { ProductHistoryModal } from '../components/ProductHistoryModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { PageLayout } from '../../../components/ui/PageLayout';
import { Product, ProductFormData, StockAddRequest, StockRemoveRequest } from '../types';
import { Package, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [showProductHistory, setShowProductHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [movementPage, setMovementPage] = useState(0);

  // Hooks
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const addStockMutation = useAddStock();
  const removeStockMutation = useRemoveStock();
  const { data: movementsResponse, isLoading: movementsLoading, error: movementsError } = useMovements({ skip: movementPage * 10, limit: 10 });

  const products = productsResponse?.items || [];
  const movements = movementsResponse?.items || [];

  // Handlers
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleManageStock = (product: Product) => {
    setSelectedProduct(product);
    setShowStockManagement(true);
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setShowProductHistory(true);
  };

  const handleProductFormSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && selectedProduct) {
        await updateProductMutation.mutateAsync({
          id: selectedProduct.id,
          data
        });
      } else {
        await createProductMutation.mutateAsync(data);
      }
      setShowProductForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleAddStock = async (request: StockAddRequest) => {
    try {
      await addStockMutation.mutateAsync(request);
      setShowStockManagement(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const handleRemoveStock = async (request: StockRemoveRequest) => {
    try {
      await removeStockMutation.mutateAsync(request);
      setShowStockManagement(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleCloseStockManagement = () => {
    setShowStockManagement(false);
    setSelectedProduct(null);
  };

  const handleCloseProductHistory = () => {
    setShowProductHistory(false);
    setSelectedProduct(null);
  };

  return (
    <PageLayout title="Inventario" subtitle="Gestión de productos y stock">
      <div className="space-y-6">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products" activeValue={activeTab} onChange={setActiveTab}>
              <Package className="w-4 h-4 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="reports" activeValue={activeTab} onChange={setActiveTab}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="movements" activeValue={activeTab} onChange={setActiveTab}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Movimientos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" activeValue={activeTab}>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onManageStock={handleManageStock}
              onViewHistory={handleViewHistory}
              onCreateNew={handleCreateProduct}
              isLoading={productsLoading}
              error={productsError ? String(productsError) : undefined}
            />
          </TabsContent>

          <TabsContent value="reports" activeValue={activeTab}>
            <InventoryReports />
          </TabsContent>

          <TabsContent value="movements" activeValue={activeTab}>
            <MovementList 
              movements={movements} 
              isLoading={movementsLoading}
              error={movementsError ? String(movementsError) : undefined}
            />
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="secondary"
                disabled={movementPage === 0}
                onClick={() => setMovementPage(prev => Math.max(0, prev - 1))}
              >
                Anterior
              </Button>
              <span>Página {movementPage + 1}</span>
              <Button
                variant="secondary"
                disabled={!movementsResponse || movements.length < 10}
                onClick={() => setMovementPage(prev => prev + 1)}
              >
                Siguiente
              </Button>
            </div>
          </TabsContent>

        </Tabs>

        {/* Modals */}
        <ProductForm
          product={selectedProduct || undefined}
          isOpen={showProductForm}
          onClose={handleCloseProductForm}
          onSubmit={handleProductFormSubmit}
          isLoading={createProductMutation.isPending || updateProductMutation.isPending}
          title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        />

        {selectedProduct && (
          <StockManagement
            product={selectedProduct}
            isOpen={showStockManagement}
            onClose={handleCloseStockManagement}
            onAddStock={handleAddStock}
            onRemoveStock={handleRemoveStock}
            isLoading={addStockMutation.isPending || removeStockMutation.isPending}
          />
        )}

        {selectedProduct && (
          <ProductHistoryModal
            product={selectedProduct}
            isOpen={showProductHistory}
            onClose={handleCloseProductHistory}
          />
        )}
      </div>
    </PageLayout>
  );
};
