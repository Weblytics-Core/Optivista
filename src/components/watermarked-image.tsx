
"use client";

import React, { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

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
    <div className={cn("relative w-full h-full overflow-hidden bg-black/5", className?.includes('rounded') && 'rounded-lg')}>
      <Image {...props} className={cn("w-full h-full", props.fill ? "object-contain" : "")} />
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
