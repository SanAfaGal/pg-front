import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import {
  Product,
  ProductFormData,
  ProductFilters,
  ProductSearchParams,
  ProductListResponse,
} from '../types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (params: ProductSearchParams) => [...productKeys.all, 'search', params] as const,
};

// Hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => inventoryApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => inventoryApi.getProductById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (params: ProductSearchParams, enabled = true) => {
  return useQuery({
    queryKey: productKeys.search(params),
    queryFn: () => inventoryApi.searchProducts(params),
    enabled: enabled && !!params.q,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductFormData) => inventoryApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      inventoryApi.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryApi.deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
};
