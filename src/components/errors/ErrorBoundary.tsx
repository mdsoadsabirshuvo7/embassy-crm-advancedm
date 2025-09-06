import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{ onReset?: () => void; label?: string }>, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Boundary caught error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border rounded-lg bg-destructive/5 text-destructive space-y-4">
          <div>
            <h2 className="font-semibold text-lg">{this.props.label || 'Something went wrong.'}</h2>
            <p className="text-sm opacity-80 break-all">{this.state.error?.message}</p>
          </div>
          <Button size="sm" variant="outline" onClick={this.handleReset}>Retry</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
