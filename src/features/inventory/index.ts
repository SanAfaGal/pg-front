// Main page
export { InventoryPage } from './pages/InventoryPage';

// Components
export { ProductForm } from './components/ProductForm';
export { StockManagement } from './components/StockManagement';
export { InventoryReports } from './components/InventoryReports';
export { ProductHistoryModal } from './components/ProductHistoryModal';
export { MovementList } from './components/MovementList';

// Product List Components
export { ProductList } from './components/lists/ProductList';
export type { ProductListProps } from './components/lists/ProductList';

// Common Components
export * from './components/common';

// Utils
export * from './utils/formatters';
export * from './utils/imageHelpers';
export * from './utils/stockHelpers';

// Constants
export * from './constants/productConstants';

// Hooks
export * from './hooks';

// API
export { inventoryApi } from './api/inventoryApi';

// Types
export * from './types';
