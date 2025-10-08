import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl">
        {/* Image skeleton */}
        <div className="relative h-48 bg-gray-300 dark:bg-gray-700">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"></div>
        </div>

        {/* Content skeleton */}
        <div className="p-5">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>

          {/* Address skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 animate-pulse w-3/4"></div>

          {/* Features skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-12"></div>
          </div>

          {/* Price skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-14">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonGrid };
