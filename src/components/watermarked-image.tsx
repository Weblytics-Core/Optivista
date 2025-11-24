
"use client";

import React, { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';

interface WatermarkedImageProps extends ImageProps {
  watermarkText: string;
  watermarkEnabled?: boolean;
}

export function WatermarkedImage({ watermarkText, watermarkEnabled = false, className, ...props }: WatermarkedImageProps) {
  const [position, setPosition] = useState({ top: '10%', left: '10%' });

  useEffect(() => {
    if (!watermarkEnabled) return;

    const interval = setInterval(() => {
      const top = `${Math.random() * 80 + 10}%`; // Keep it between 10% and 90%
      const left = `${Math.random() * 80 + 10}%`;
      setPosition({ top, left });
    }, 4000); // Change position every 4 seconds

    return () => clearInterval(interval);
  }, [watermarkEnabled]);

  return (
    <div className="relative w-full h-full">
      <Image className={className} {...props} />
      {watermarkEnabled && (
        <div
          className="absolute pointer-events-none text-white/30 font-headline text-sm md:text-base transition-all duration-500 ease-in-out select-none [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]"
          style={{ top: position.top, left: position.left }}
        >
          {watermarkText}
        </div>
      )}
    </div>
  );
}
