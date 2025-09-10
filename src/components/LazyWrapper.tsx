import React, { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
}

// Default loading fallback
const DefaultFallback = () => (
  <Card className="bg-background/50 backdrop-blur-sm border-border/50">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

// Higher-order component for lazy loading
export const withLazyLoading = <P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy wrapper component
export const LazyWrapper: React.FC<LazyWrapperProps & { children: React.ReactNode }> = ({
  children,
  fallback = <DefaultFallback />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
