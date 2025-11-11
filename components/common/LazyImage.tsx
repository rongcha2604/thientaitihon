// LazyImage component với lazy loading và optimization
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string; // Placeholder image hoặc emoji
  fallback?: string; // Fallback khi image load fail
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  className = '',
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(placeholder || null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Intersection Observer để lazy load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !hasError) {
            // Image vào viewport → Load image
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
            };
            img.onerror = () => {
              setHasError(true);
              if (fallback) {
                setImageSrc(fallback);
              }
            };
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Load trước khi vào viewport 50px
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, isLoaded, hasError, fallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc || src}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-50 blur-sm' : 'opacity-100'} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
      onError={handleError}
      {...props}
    />
  );
};

export default LazyImage;

