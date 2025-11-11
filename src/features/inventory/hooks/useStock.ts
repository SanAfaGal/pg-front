import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import { StockAddRequest, StockRemoveRequest } from '../types';
import { productKeys } from './useProducts';
import { movementKeys } from './useMovements';
import { reportKeys } from './useReports';

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StockAddRequest) => inventoryApi.addStock(request),
    onSuccess: (response) => {
      // Invalidate product lists and specific product
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(response.product.id) });
      
      // Invalidate movements
      queryClient.invalidateQueries({ queryKey: movementKeys.lists() });
      
      // Invalidate product history for this specific product
      queryClient.invalidateQueries({ queryKey: reportKeys.productHistory(response.product.id) });
      
      // Invalidate specific report queries that might be affected
      queryClient.invalidateQueries({ queryKey: reportKeys.stats() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: reportKeys.outOfStock() });
      queryClient.invalidateQueries({ queryKey: reportKeys.overstock() });
      
      // Invalidate daily sales and reconciliation reports (they may include responsible tracking)
      // Invalidate all variations of these reports
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'daily-sales'],
      });
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'daily-sales-by-employee'],
      });
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'reconciliation'],
      });
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StockRemoveRequest) => inventoryApi.removeStock(request),
    onSuccess: (response) => {
      // Invalidate product lists and specific product
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(response.product.id) });
      
      // Invalidate movements
      queryClient.invalidateQueries({ queryKey: movementKeys.lists() });
      
      // Invalidate product history for this specific product
      queryClient.invalidateQueries({ queryKey: reportKeys.productHistory(response.product.id) });
      
      // Invalidate specific report queries that might be affected
      queryClient.invalidateQueries({ queryKey: reportKeys.stats() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: reportKeys.outOfStock() });
      queryClient.invalidateQueries({ queryKey: reportKeys.overstock() });
      
      // Invalidate daily sales and reconciliation reports (they track responsible users)
      // Invalidate all variations of these reports
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'daily-sales'],
      });
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'daily-sales-by-employee'],
      });
      queryClient.invalidateQueries({ 
        queryKey: [...reportKeys.all, 'reconciliation'],
      });
    },
  });
};
