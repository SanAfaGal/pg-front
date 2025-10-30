/**
 * Utility functions for stock-related calculations and logic
 */

import { StockStatus } from '../types';

/**
 * Calculate stock status based on current, min, and max values
 * @param current - Current stock quantity
 * @param min - Minimum stock threshold
 * @param max - Maximum stock threshold
 * @returns Stock status enum value
 */
export const calculateStockStatus = (
  current: string | number,
  min: string | number,
  max: string | number
): StockStatus => {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const minNum = typeof min === 'string' ? parseFloat(min) : min;
  const maxNum = typeof max === 'string' ? parseFloat(max) : max;

  if (currentNum === 0) return 'STOCK_OUT';
  if (currentNum < minNum) return 'LOW_STOCK';
  if (currentNum > maxNum) return 'OVERSTOCK';
  return 'NORMAL';
};

/**
 * Check if product is low on stock
 * @param current - Current stock quantity
 * @param min - Minimum stock threshold
 * @returns True if stock is low or out
 */
export const isLowStock = (
  current: string | number,
  min: string | number
): boolean => {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const minNum = typeof min === 'string' ? parseFloat(min) : min;
  return currentNum <= minNum;
};

/**
 * Check if product is out of stock
 * @param current - Current stock quantity
 * @returns True if stock is zero
 */
export const isOutOfStock = (current: string | number): boolean => {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  return currentNum === 0;
};

/**
 * Calculate stock percentage
 * @param current - Current stock quantity
 * @param max - Maximum stock capacity
 * @returns Percentage (0-100)
 */
export const calculateStockPercentage = (
  current: string | number,
  max: string | number
): number => {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const maxNum = typeof max === 'string' ? parseFloat(max) : max;
  
  if (maxNum === 0) return 0;
  return Math.min(100, Math.max(0, (currentNum / maxNum) * 100));
};

/**
 * Get stock status color for UI elements
 * @param status - Stock status enum
 * @returns Object with color classes
 */
export const getStockStatusColors = (status: StockStatus) => {
  switch (status) {
    case 'NORMAL':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'text-green-600',
      };
    case 'LOW_STOCK':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
      };
    case 'STOCK_OUT':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'text-red-600',
      };
    case 'OVERSTOCK':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'text-blue-600',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: 'text-gray-600',
      };
  }
};

/**
 * Get stock status label in Spanish
 * @param status - Stock status enum
 * @returns Localized label
 */
export const getStockStatusLabel = (status: StockStatus): string => {
  switch (status) {
    case 'NORMAL':
      return 'Normal';
    case 'LOW_STOCK':
      return 'Stock Bajo';
    case 'STOCK_OUT':
      return 'Sin Stock';
    case 'OVERSTOCK':
      return 'Sobrestock';
    default:
      return 'Desconocido';
  }
};

