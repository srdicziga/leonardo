import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  variant?: 'thumb' | 'card' | 'full';
  width?: number;
  height?: number;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-[#EFECE6]',
  loading = 'lazy',
  variant = 'card',
  width = 640,
  height = 427,
}) => {
  const [hasError, setHasError] = useState(false);

  // Automatically serve lightweight optimized images for lazy-loaded cards & gallery thumbnails
  const resolvedSrc = (() => {
    if (loading === 'eager' || variant === 'full') return src;
    const targetFolder = variant === 'thumb' ? '/images/villa/thumb/' : '/images/villa/opt/';
    if (src === '/images/villa/DJI_0605.png') {
      return `${targetFolder}DJI_0605.jpg`;
    }
    if (
      src.startsWith('/images/villa/') &&
      !src.startsWith('/images/villa/opt/') &&
      !src.startsWith('/images/villa/thumb/') &&
      !src.startsWith('/images/villa/lightbox/') &&
      !src.endsWith('.png')
    ) {
      return src.replace('/images/villa/', targetFolder);
    }
    return src;
  })();

  return (
    <div className={containerClassName}>
      {!hasError ? (
        <img
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={className}
        />
      ) : (
        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F4F0E8] via-[#EAE3D5] to-[#DFD7C6] text-[#4A5844]">
          <svg
            className="w-8 h-8 mb-2 opacity-60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
          </svg>
          <span className="font-serif text-base italic text-[#2B3529]">{alt}</span>
          <span className="text-xs text-[#6B7466] mt-1">Leonardo House · Novigrad</span>
        </div>
      )}
    </div>
  );
};

