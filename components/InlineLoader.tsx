import React from "react";

interface InlineLoaderProps {
  size?: 'small' | 'medium';
  className?: string;
}

export default function InlineLoader({ 
  size = 'small',
  className = "" 
}: InlineLoaderProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5"
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin"></div>
      </div>
    </div>
  );
} 