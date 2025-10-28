import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import {
  DailySalesParams,
  DailySalesByEmployeeParams,
  ReconciliationParams,
} from '../types';

// Query Keys
export const reportKeys = {
  all: ['reports'] as const,
  stats: () => [...reportKeys.all, 'stats'] as const,
  lowStock: () => [...reportKeys.all, 'low-stock'] as const,
  outOfStock: () => [...reportKeys.all, 'out-of-stock'] as const,
  overstock: () => [...reportKeys.all, 'overstock'] as const,
  productHistory: (productId: string) => [...reportKeys.all, 'product-history', productId] as const,
  dailySales: (params?: DailySalesParams) => [...reportKeys.all, 'daily-sales', params] as const,
  dailySalesByEmployee: (params?: DailySalesByEmployeeParams) => [...reportKeys.all, 'daily-sales-by-employee', params] as const,
  reconciliation: (params: ReconciliationParams) => [...reportKeys.all, 'reconciliation', params] as const,
};

// Hooks
export const useInventoryStats = () => {
  return useQuery({
    queryKey: reportKeys.stats(),
    queryFn: () => inventoryApi.getInventoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: reportKeys.lowStock(),
    queryFn: () => inventoryApi.getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOutOfStockProducts = () => {
  return useQuery({
    queryKey: reportKeys.outOfStock(),
    queryFn: () => inventoryApi.getOutOfStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOverstockProducts = () => {
  return useQuery({
    queryKey: reportKeys.overstock(),
    queryFn: () => inventoryApi.getOverstockProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductHistory = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: reportKeys.productHistory(productId),
    queryFn: () => inventoryApi.getProductHistory(productId),
    enabled: enabled && !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDailySales = (params?: DailySalesParams) => {
  return useQuery({
    queryKey: reportKeys.dailySales(params),
    queryFn: () => inventoryApi.getDailySales(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useDailySalesByEmployee = (params?: DailySalesByEmployeeParams) => {
  return useQuery({
    queryKey: reportKeys.dailySalesByEmployee(params),
    queryFn: () => inventoryApi.getDailySalesByEmployee(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useReconciliationReport = (params: ReconciliationParams, enabled = true) => {
  return useQuery({
    queryKey: reportKeys.reconciliation(params),
    queryFn: () => inventoryApi.getReconciliationReport(params),
    enabled: enabled && !!params.start_date && !!params.end_date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
