'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NewsImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  fallbackSize?: 'sm' | 'md' | 'lg';
}

// Componente placeholder SVG para quando não há imagem
function PlaceholderSVG({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-dark-800 via-dark-850 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <svg 
          className={`${sizeClasses[size]} text-gold-500/30 mx-auto mb-2`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <span className="text-dark-600 text-xs block">Sem imagem</span>
      </div>
    </div>
  );
}

export function NewsImage({ 
  src, 
  alt, 
  fill = true, 
  priority = false, 
  className = '',
  fallbackSize = 'md'
}: NewsImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Se não há src ou houve erro, mostra placeholder
  if (!src || hasError) {
    return <PlaceholderSVG size={fallbackSize} />;
  }

  return (
    <>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-800 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        unoptimized // Evita problemas com imagens externas de fontes variadas
      />
    </>
  );
}
