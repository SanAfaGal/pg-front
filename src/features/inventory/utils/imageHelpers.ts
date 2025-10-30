/**
 * Utility functions for handling product images
 * Centralizes image-related logic including error handling and fallbacks
 */

/**
 * Checks if a URL is a valid image URL
 * @param url - The URL to validate
 * @returns True if valid HTTP/HTTPS URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\/.+/i.test(url);
};

/**
 * Gets the appropriate image URL or returns null for fallback
 * @param photoUrl - The photo URL from the product
 * @returns The URL if valid, null otherwise
 */
export const getImageUrl = (photoUrl?: string): string | null => {
  if (!photoUrl || !isValidImageUrl(photoUrl)) {
    return null;
  }
  return photoUrl;
};

/**
 * Image size variants for different contexts
 */
export const IMAGE_SIZES = {
  SMALL: { width: 'w-12', height: 'h-12', padding: 'p-1.5' },  // 48x48 - List view
  MEDIUM: { width: 'w-16', height: 'h-16', padding: 'p-2' },    // 64x64 - Card view
  LARGE: { width: 'w-24', height: 'h-24', padding: 'p-3' },     // 96x96 - Detail view
  PREVIEW: { width: 'w-full', height: 'h-48', padding: 'p-4' }, // Form preview
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

/**
 * Get CSS classes for image container based on size
 * @param size - The size variant
 * @returns Object with width, height, and padding classes
 */
export const getImageContainerClasses = (size: ImageSize = 'SMALL') => {
  return IMAGE_SIZES[size];
};

/**
 * Common image container styles
 */
export const IMAGE_CONTAINER_BASE_CLASSES =
  'bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm';

/**
 * Common fallback container styles
 */
export const FALLBACK_CONTAINER_BASE_CLASSES =
  'bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200';

/**
 * Common image styles for proper sizing and proportions
 */
export const IMAGE_BASE_CLASSES = 'max-w-full max-h-full object-contain';

