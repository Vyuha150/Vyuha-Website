import React from "react";

interface SmallLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function SmallLoader({ 
  message = "Loading...", 
  size = 'medium',
  className = "" 
}: SmallLoaderProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8"
  };

  const containerClasses = {
    small: "p-4",
    medium: "p-6",
    large: "p-8"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      {/* Spinning loader */}
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin"></div>
      </div>
      
      {/* Loading message */}
      {message && (
        <p className="text-sm text-gray-600 mt-3 text-center font-medium">
          {message}
        </p>
      )}
    </div>
  );
} 