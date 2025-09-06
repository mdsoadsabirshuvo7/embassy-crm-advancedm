import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="flex justify-end space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);