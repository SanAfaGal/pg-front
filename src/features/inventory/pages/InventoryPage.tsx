import React, { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, productKeys } from '../hooks/useProducts';
import { useAddStock, useRemoveStock } from '../hooks/useStock';
import { useMovements, movementKeys } from '../hooks/useMovements';
import { reportKeys } from '../hooks/useReports';
import { ProductList } from '../components/lists/ProductList';
import { ProductForm } from '../components/ProductForm';
import { StockManagement } from '../components/StockManagement';
import { MovementList } from '../components/MovementList';
import { InventoryReports } from '../components/InventoryReports';
import { ProductHistoryModal } from '../components/ProductHistoryModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { PageLayout } from '../../../components/ui/PageLayout';
import { Product, ProductFormData, StockAddRequest, StockRemoveRequest } from '../types';
import { logger, useToast } from '../../../shared';
import { Package, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [showProductHistory, setShowProductHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [movementPage, setMovementPage] = useState(0);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Hooks
  const { data: productsResponse, isLoading: productsLoading, error: productsError, isRefetching: isProductsRefetching, refetch: refetchProducts } = useProducts();
  const { data: movementsResponse, isLoading: movementsLoading, error: movementsError, isRefetching: isMovementsRefetching, refetch: refetchMovements } = useMovements({ skip: movementPage * 10, limit: 10 });
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const addStockMutation = useAddStock();
  const removeStockMutation = useRemoveStock();

  const products = productsResponse?.items || [];
  const movements = movementsResponse?.items || [];

  // Helper function to get query keys to refresh based on active tab
  const getRefreshQueriesForTab = useCallback((tab: string) => {
    switch (tab) {
      case 'reports':
        // Invalidate all report-related queries (all is an array constant, not a function)
        return [
          reportKeys.all,
        ];
      case 'movements':
        // Invalidate all movement-related queries (all is an array constant, not a function)
        return [
          movementKeys.all,
        ];
      case 'products':
      default:
        // Default: refresh products (all is an array constant, not a function)
        return [
          productKeys.all,
        ];
    }
  }, []);

  // Calculate isRefetching based on active tab queries
  const isRefetching = useMemo(() => {
    const queriesToCheck = getRefreshQueriesForTab(activeTab);
    const isFetchingQueries = queriesToCheck.some(queryKey => 
      queryClient.isFetching({ queryKey })
    );
    
    // Only include specific refetching states for their respective tabs
    if (activeTab === 'products') {
      return isFetchingQueries || isProductsRefetching;
    } else if (activeTab === 'movements') {
      return isFetchingQueries || isMovementsRefetching;
    } else {
      // For reports tab, only check query fetching
      return isFetchingQueries;
    }
  }, [activeTab, queryClient, getRefreshQueriesForTab, isProductsRefetching, isMovementsRefetching]);

  const handleRefresh = useCallback(async () => {
    try {
      const queriesToInvalidate = getRefreshQueriesForTab(activeTab);
      
      // Invalidate all queries for the active tab
      await Promise.all(
        queriesToInvalidate.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      );

      // For 'products' and 'movements' tabs, also explicitly refetch to maintain current behavior
      if (activeTab === 'products') {
        await refetchProducts();
      } else if (activeTab === 'movements') {
        await refetchMovements();
      }

      const tabMessages: Record<string, { title: string; message: string }> = {
        reports: {
          title: 'Actualizado',
          message: 'Los reportes de inventario se han actualizado correctamente',
        },
        movements: {
          title: 'Actualizado',
          message: 'Los movimientos se han actualizado correctamente',
        },
        products: {
          title: 'Actualizado',
          message: 'Los productos se han actualizado correctamente',
        },
      };

      const message = tabMessages[activeTab] || tabMessages.products;
      showToast({
        type: 'success',
        ...message,
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar los datos del inventario',
      });
    }
  }, [activeTab, queryClient, getRefreshQueriesForTab, refetchProducts, refetchMovements, showToast]);

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
        logger.error('Error deleting product:', error);
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
      logger.error('Error saving product:', error);
    }
  };

  const handleAddStock = async (request: StockAddRequest) => {
    try {
      await addStockMutation.mutateAsync(request);
      setShowStockManagement(false);
      setSelectedProduct(null);
    } catch (error) {
      logger.error('Error adding stock:', error);
    }
  };

  const handleRemoveStock = async (request: StockRemoveRequest) => {
    try {
      await removeStockMutation.mutateAsync(request);
      setShowStockManagement(false);
      setSelectedProduct(null);
    } catch (error) {
      logger.error('Error removing stock:', error);
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
    <PageLayout 
      title="Inventario" 
      subtitle="Gestión de productos y stock"
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefetching}
          leftIcon={
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
            />
          }
          className="whitespace-nowrap"
        >
          {isRefetching ? 'Actualizando...' : 'Actualizar'}
        </Button>
      }
    >
      <div className="w-full space-y-6">
        <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
          <div className="flex justify-center w-full">
            <TabsList className="inline-flex max-w-full">
              <TabsTrigger 
                value="products" 
                activeValue={activeTab} 
                onChange={setActiveTab}
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Productos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                activeValue={activeTab} 
                onChange={setActiveTab}
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Reportes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="movements" 
                activeValue={activeTab} 
                onChange={setActiveTab}
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Movimientos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="products" activeValue={activeTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" activeValue={activeTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InventoryReports />
              </motion.div>
            </TabsContent>

            <TabsContent value="movements" activeValue={activeTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MovementList 
                  movements={movements} 
                  isLoading={movementsLoading}
                  error={movementsError ? String(movementsError) : undefined}
                  products={products}
                />
                {movementsResponse && movementsResponse.total > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-1">
                    <div className="text-sm text-gray-600">
                      Mostrando {movements.length} de {movementsResponse.total} movimientos
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={movementPage === 0}
                        onClick={() => setMovementPage(prev => Math.max(0, prev - 1))}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-700 font-medium min-w-[80px] text-center">
                        Página {movementPage + 1}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={!movementsResponse || movements.length < 10 || (movementPage + 1) * 10 >= movementsResponse.total}
                        onClick={() => setMovementPage(prev => prev + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </div>

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
