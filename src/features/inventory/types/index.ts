// Inventory Module Types

// Enums
export type StockStatus = 'NORMAL' | 'LOW_STOCK' | 'STOCK_OUT' | 'OVERSTOCK';
export type MovementType = 'ENTRY' | 'EXIT';
export type UnitType = 'ml' | 'l' | 'g' | 'kg' | 'units' | 'pcs';
export type Currency = 'COP' | 'USD' | 'EUR';

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  capacity_value: string;
  unit_type: UnitType;
  price: string;
  currency: Currency;
  photo_url?: string;
  available_quantity: string;
  min_stock: string;
  max_stock: string;
  stock_status: StockStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  capacity_value: string;
  unit_type: UnitType;
  price: string;
  currency: Currency;
  photo_url?: string;
  min_stock: string;
  max_stock: string;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  active_only?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface ProductSearchParams {
  q: string;
  skip?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

// Paginated Response Types
export interface PaginatedResponse<T> {
  skip: number;
  limit: number;
  total: number;
  items: T[];
}

export type ProductListResponse = PaginatedResponse<Product>;

// Stock Management Types
export interface StockAddRequest {
  product_id: string;
  quantity: string;
  responsible?: string;
  notes?: string;
}

export interface StockRemoveRequest {
  product_id: string;
  quantity: string;
  responsible?: string;
  notes?: string;
}

export interface StockOperationResponse {
  product: {
    id: string;
    name: string;
    available_quantity: string;
    stock_status: StockStatus;
  };
  movement: Movement;
}

// Movement Types
export interface Movement {
  id: string;
  product_id: string;
  movement_type: MovementType;
  quantity: string;
  movement_date: string;
  responsible?: string;
  notes?: string;
}

export interface MovementFilters {
  skip?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface MovementListQueryParams {
  skip?: number;
  limit?: number;
}

export type MovementListResponse = PaginatedResponse<Movement>;

// Reports Types
export interface InventoryStats {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  overstock_count: number;
  total_inventory_value: string;
  total_units: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  available_quantity: string;
  min_stock: string;
  stock_status: StockStatus;
}

export interface OutOfStockProduct {
  id: string;
  name: string;
  available_quantity: string;
  stock_status: StockStatus;
}

export interface OverstockProduct {
  id: string;
  name: string;
  available_quantity: string;
  max_stock: string;
  stock_status: StockStatus;
}

export interface ProductHistory {
  product_id: string;
  total_movements: number;
  total_entries: string;
  total_exits: string;
  entries_count: number;
  exits_count: number;
  last_movement?: Movement;
  recent_movements: Movement[];
}

export interface DailySalesReport {
  date: string;
  responsible?: string;
  total_units_sold: string;
  total_transactions: number;
  movements: Movement[];
}

export interface DailySalesByEmployee {
  date: string;
  total_employees: number;
  sales_by_employee: Record<string, EmployeeSales>;
}

export interface EmployeeSales {
  total_units: string;
  total_amount: string;
  total_transactions: number;
  movements: Movement[];
}

export interface ReconciliationReport {
  period: {
    start: string;
    end: string;
  };
  reconciliation: Record<string, EmployeeReconciliation>;
}

export interface EmployeeReconciliation {
  total_units_sold: string;
  exit_count: number;
  entries: string;
  movements: Movement[];
}

export interface DailySalesParams {
  date?: string;
  responsible?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface DailySalesByEmployeeParams {
  date?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ReconciliationParams {
  start_date: string;
  end_date: string;
  [key: string]: string | number | boolean | undefined;
}
