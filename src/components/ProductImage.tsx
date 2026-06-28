"use client";

import { useEffect, useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export default function ProductImage({
  src,
  alt,
  fallbackSrc,
  className = "",
}: ProductImageProps) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setActiveSrc(src);
    setHasError(false);
  }, [src]);

  function handleError() {
    if (activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
      setHasError(true);
    }
  }

  return (
    <>
      <img
        src={activeSrc}
        alt={alt}
        onError={handleError}
        className={className}
      />
      {hasError && (
        <span className="sr-only">Showing placeholder — image unavailable</span>
      )}
    </>
  );
}
