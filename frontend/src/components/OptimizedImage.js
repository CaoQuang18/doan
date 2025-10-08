import React, { useState, useEffect } from 'react';
import { ImSpinner2 } from 'react-icons/im';

/**
 * Optimized Image Component
 * - Lazy loading
 * - Blur placeholder
 * - Error handling
 * - Loading state
 * - Automatic compression for base64
 */

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '',
  fallback = null,
  showLoading = true,
  quality = 0.8,
  maxWidth = 1200,
  maxHeight = 1200
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    const optimizeBase64Image = async (base64) => {
      try {
        const img = new Image();
        img.src = base64;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Create canvas to resize and compress
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const optimized = canvas.toDataURL('image/jpeg', quality);
        setImageSrc(optimized);
        loadImage(optimized);
      } catch (err) {
        console.error('Image optimization error:', err);
        setImageSrc(base64); // Fallback to original
        loadImage(base64);
      }
    };

    // If it's a base64 image, optimize it
    if (src.startsWith('data:image')) {
      optimizeBase64Image(src);
    } else {
      // Regular URL image
      setImageSrc(src);
      loadImage(src);
    }
  }, [src, maxWidth, maxHeight, quality]);

  const loadImage = (imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    
    img.onload = () => {
      setLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };
  };

  if (error) {
    return fallback || (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading Spinner */}
      {loading && showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ImSpinner2 className="animate-spin text-violet-600 text-2xl" />
        </div>
      )}
      
      {/* Actual Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
