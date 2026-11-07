"use client";

import React, { useState } from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
}

export default function BlurImage({
  src,
  alt,
  className = "",
  fill,
  priority,
  ...props
}: BlurImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setHasError(true)}
      className={`${
        fill ? "absolute inset-0 w-full h-full object-cover" : "w-full h-full object-cover"
      } ${className}`}
      {...props}
    />
  );
}
