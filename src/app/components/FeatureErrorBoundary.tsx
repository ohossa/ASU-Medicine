import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export const FeatureErrorBoundary: React.FC<{ children: React.ReactNode; name: string }> = ({
  children,
  name,
}) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold mb-2">Something went wrong in {name}</h2>
        <p className="text-sm text-gray-500">Please refresh the page.</p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
