// Image utilities for facial recognition
export interface ImageCaptureOptions {
  quality: number; // 0.1 to 1.0
  maxWidth: number;
  maxHeight: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
}

// Default image capture options
export const DEFAULT_IMAGE_OPTIONS: ImageCaptureOptions = {
  quality: 0.8,
  maxWidth: 640,
  maxHeight: 480,
  format: 'image/jpeg',
};

// Capture image from video element
export const captureImageFromVideo = (
  videoElement: HTMLVideoElement,
  options: ImageCaptureOptions = DEFAULT_IMAGE_OPTIONS
): string => {
  // Create canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas dimensions
  const { maxWidth, maxHeight } = options;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  
  // Calculate dimensions maintaining aspect ratio
  let canvasWidth = maxWidth;
  let canvasHeight = maxHeight;
  
  if (videoWidth / videoHeight > maxWidth / maxHeight) {
    canvasHeight = (maxWidth * videoHeight) / videoWidth;
  } else {
    canvasWidth = (maxHeight * videoWidth) / videoHeight;
  }
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Draw video frame to canvas
  ctx.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);

  // Convert to base64
  const base64String = canvas.toDataURL(options.format, options.quality);
  
  // Remove data URL prefix to get just the base64 string
  return base64String.split(',')[1];
};

// Validate image size
export const validateImageSize = (base64String: string, maxSizeMB: number = 2): boolean => {
  // Calculate approximate size in bytes
  const sizeInBytes = (base64String.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  
  return sizeInMB <= maxSizeMB;
};

// Optimize image for API
export const optimizeImageForAPI = (
  base64String: string,
  maxSizeMB: number = 2
): string => {
  if (validateImageSize(base64String, maxSizeMB)) {
    return base64String;
  }

  // If image is too large, we need to recompress
  // This is a simplified approach - in production you might want more sophisticated compression
  const quality = Math.max(0.1, 1 - (base64String.length / (maxSizeMB * 1024 * 1024 * 4 / 3)));
  
  // Create a temporary canvas to recompress
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context for optimization');
  }

  // Create image from base64
  const img = new Image();
  img.src = `data:image/jpeg;base64,${base64String}`;
  
  // Set canvas size
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw and recompress
  ctx.drawImage(img, 0, 0);
  const optimizedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
  
  return optimizedBase64;
};

// Detect face in image (basic validation)
export const detectFaceInImage = (base64String: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Basic validation - check if image has reasonable dimensions
      const hasValidDimensions = img.width > 100 && img.height > 100;
      resolve(hasValidDimensions);
    };
    img.onerror = () => resolve(false);
    img.src = `data:image/jpeg;base64,${base64String}`;
  });
};

// Format image for API request
export const formatImageForAPI = async (
  base64String: string,
  maxSizeMB: number = 2
): Promise<string> => {
  // Optimize image size
  const optimizedImage = optimizeImageForAPI(base64String, maxSizeMB);
  
  // Basic face detection (you might want to use a more sophisticated library)
  const hasFace = await detectFaceInImage(optimizedImage);
  if (!hasFace) {
    throw new Error('No face detected in the image. Please ensure your face is visible and well-lit.');
  }
  
  return optimizedImage;
};
