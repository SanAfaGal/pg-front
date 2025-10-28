import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import { StockAddRequest, StockRemoveRequest } from '../types';
import { productKeys } from './useProducts';
import { movementKeys } from './useMovements';

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
      
      // Invalidate reports that might be affected
      queryClient.invalidateQueries({ queryKey: ['reports'] });
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
      
      // Invalidate reports that might be affected
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
