import { apiClient, API_ENDPOINTS } from '../../../shared/api/apiClient';
import {
  Product,
  ProductFormData,
  ProductFilters,
  ProductSearchParams,
  ProductListResponse,
  StockAddRequest,
  StockRemoveRequest,
  StockOperationResponse,
  Movement,
  MovementListResponse,
  InventoryStats,
  LowStockProduct,
  OutOfStockProduct,
  OverstockProduct,
  ProductHistory,
  DailySalesReport,
  DailySalesByEmployee,
  ReconciliationReport,
  DailySalesParams,
  DailySalesByEmployeeParams,
  ReconciliationParams,
  MovementListQueryParams,
} from '../types';

export const inventoryApi = {
  // Products
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = filters ? Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : {};
    return apiClient.get<ProductListResponse>(API_ENDPOINTS.inventory.products.list, {
      params
    });
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(API_ENDPOINTS.inventory.products.detail(id));
  },

  async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;
    return apiClient.get<Product[]>(API_ENDPOINTS.inventory.products.search, {
      params: filteredParams
    });
  },

  async createProduct(productData: ProductFormData): Promise<Product> {
    return apiClient.post<Product>(API_ENDPOINTS.inventory.products.list, productData);
  },

  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<Product> {
    return apiClient.patch<Product>(API_ENDPOINTS.inventory.products.detail(id), productData);
  },

  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.inventory.products.detail(id));
  },

  // Stock Management
  async addStock(request: StockAddRequest): Promise<StockOperationResponse> {
    const params: Record<string, string> = {
      product_id: request.product_id,
      quantity: request.quantity,
    };
    
    // Include responsible if provided and not empty
    if (request.responsible?.trim()) {
      params.responsible = request.responsible.trim();
    }
    
    // Include notes if provided and not empty
    if (request.notes?.trim()) {
      params.notes = request.notes.trim();
    }
    
    return apiClient.post<StockOperationResponse>(
      API_ENDPOINTS.inventory.stock.add, 
      null, 
      { params }
    );
  },

  async removeStock(request: StockRemoveRequest): Promise<StockOperationResponse> {
    const params = {
      product_id: request.product_id,
      quantity: request.quantity,
      ...(request.responsible && { responsible: request.responsible }),
      ...(request.notes && { notes: request.notes })
    };
    return apiClient.post<StockOperationResponse>(
      API_ENDPOINTS.inventory.stock.remove, 
      null, 
      { params }
    );
  },

  // Movements
  async getMovements(params?: MovementListQueryParams): Promise<MovementListResponse> {
    const filteredParams = params ? Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : {};
    return apiClient.get<MovementListResponse>(API_ENDPOINTS.inventory.movements.list, {
      params: filteredParams
    });
  },

  async getMovementById(id: string): Promise<Movement> {
    return apiClient.get<Movement>(API_ENDPOINTS.inventory.movements.detail(id));
  },

  // Reports
  async getInventoryStats(): Promise<InventoryStats> {
    return apiClient.get<InventoryStats>(API_ENDPOINTS.inventory.reports.stats);
  },

  async getLowStockProducts(): Promise<LowStockProduct[]> {
    return apiClient.get<LowStockProduct[]>(API_ENDPOINTS.inventory.reports.lowStock);
  },

  async getOutOfStockProducts(): Promise<OutOfStockProduct[]> {
    return apiClient.get<OutOfStockProduct[]>(API_ENDPOINTS.inventory.reports.outOfStock);
  },

  async getOverstockProducts(): Promise<OverstockProduct[]> {
    return apiClient.get<OverstockProduct[]>(API_ENDPOINTS.inventory.reports.overstock);
  },

  async getProductHistory(productId: string): Promise<ProductHistory> {
    return apiClient.get<ProductHistory>(API_ENDPOINTS.inventory.reports.productHistory(productId));
  },

  async getDailySales(params?: DailySalesParams): Promise<DailySalesReport> {
    const filteredParams = params ? Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : {};
    return apiClient.get<DailySalesReport>(API_ENDPOINTS.inventory.reports.dailySales, {
      params: filteredParams
    });
  },

  async getDailySalesByEmployee(params?: DailySalesByEmployeeParams): Promise<DailySalesByEmployee> {
    const filteredParams = params ? Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : {};
    return apiClient.get<DailySalesByEmployee>(API_ENDPOINTS.inventory.reports.dailySalesByEmployee, {
      params: filteredParams
    });
  },

  async getReconciliationReport(params: ReconciliationParams): Promise<ReconciliationReport> {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;
    return apiClient.get<ReconciliationReport>(API_ENDPOINTS.inventory.reports.reconciliation, {
      params: filteredParams
    });
  },
};
