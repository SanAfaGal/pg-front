/**
 * Constants for product-related data
 * Centralizes all product constants to avoid duplication
 */

import { UnitType, Currency } from '../types';

/**
 * Available unit types for products
 */
export const UNIT_TYPES: Array<{ value: UnitType; label: string }> = [
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'units', label: 'Unidades' },
  { value: 'pcs', label: 'Piezas' },
];

/**
 * Available currencies
 */
export const CURRENCIES: Array<{ value: Currency; label: string }> = [
  { value: 'COP', label: 'Peso Colombiano (COP)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

/**
 * Default currency for the application
 */
export const DEFAULT_CURRENCY: Currency = 'COP';

/**
 * Default unit type for new products
 */
export const DEFAULT_UNIT_TYPE: UnitType = 'units';

/**
 * Movement type constants
 */
export const MOVEMENT_TYPES = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
} as const;

/**
 * Movement type labels in Spanish
 */
export const MOVEMENT_TYPE_LABELS = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
} as const;

/**
 * Stock status constants (for filtering and display)
 */
export const STOCK_STATUSES = {
  NORMAL: 'NORMAL',
  LOW_STOCK: 'LOW_STOCK',
  STOCK_OUT: 'STOCK_OUT',
  OVERSTOCK: 'OVERSTOCK',
} as const;

/**
 * Filter options for product lists
 */
export const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'stock_out', label: 'Sin stock' },
  { value: 'low_stock', label: 'Stock bajo' },
  { value: 'active', label: 'Activos' },
] as const;

/**
 * Sort options for product lists
 */
export const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nombre A-Z' },
  { value: 'name_desc', label: 'Nombre Z-A' },
  { value: 'stock_asc', label: 'Stock menor' },
  { value: 'stock_desc', label: 'Stock mayor' },
] as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 999999,
  PRICE_MIN: 0,
  PRICE_MAX: 999999999,
} as const;

/**
 * UI Constants
 */
export const UI = {
  ITEMS_PER_PAGE: 10,
  MAX_RECENT_MOVEMENTS: 50,
  IMAGE_PREVIEW_HEIGHT: 192, // h-48 in pixels
} as const;

