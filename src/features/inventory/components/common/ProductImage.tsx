/**
 * ProductImage Component
 * Reusable component for displaying product images with fallback
 */

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import {
  getImageUrl,
  getImageContainerClasses,
  IMAGE_CONTAINER_BASE_CLASSES,
  FALLBACK_CONTAINER_BASE_CLASSES,
  IMAGE_BASE_CLASSES,
  type ImageSize,
} from '../../utils/imageHelpers';

export interface ProductImageProps {
  /** Product photo URL */
  url?: string;
  /** Product name for alt text */
  name: string;
  /** Size variant */
  size?: ImageSize;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProductImage - Displays product image with automatic fallback
 * 
 * Features:
 * - Automatic fallback to icon if image fails or URL is invalid
 * - Multiple size variants (SMALL, MEDIUM, LARGE, PREVIEW)
 * - Proper image proportions with object-contain
 * - Clean white background for images
 * - Gradient background for fallback
 * 
 * @example
 * <ProductImage 
 *   url={product.photo_url} 
 *   name={product.name}
 *   size="MEDIUM"
 * />
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  url,
  name,
  size = 'SMALL',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(url);
  const sizeClasses = getImageContainerClasses(size);
  
  // Reset error state when URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [url]);

  // Show fallback if no URL, invalid URL, or image failed to load
  if (!imageUrl || imageError) {
    return (
      <div
        className={`
          ${FALLBACK_CONTAINER_BASE_CLASSES}
          ${sizeClasses.width}
          ${sizeClasses.height}
          ${className}
        `}
        role="img"
        aria-label={`${name} - imagen no disponible`}
      >
        <Package 
          className={`${size === 'PREVIEW' ? 'w-12 h-12' : size === 'LARGE' ? 'w-10 h-10' : size === 'MEDIUM' ? 'w-8 h-8' : 'w-6 h-6'} text-gray-400`} 
        />
      </div>
    );
  }

  // Show actual image
  return (
    <div
      className={`
        ${IMAGE_CONTAINER_BASE_CLASSES}
        ${sizeClasses.width}
        ${sizeClasses.height}
        ${sizeClasses.padding}
        ${className}
      `}
    >
      <img
        src={imageUrl}
        alt={name}
        className={IMAGE_BASE_CLASSES}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
};

