import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    onError
  } = options;

  const handleError = useCallback((
    error: unknown,
    context?: string,
    customMessage?: string
  ) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
      ? error 
      : 'An unexpected error occurred';

    const fullMessage = context 
      ? `${context}: ${errorMessage}` 
      : errorMessage;

    if (logToConsole) {
      console.error('Error:', {
        message: fullMessage,
        error,
        context,
        timestamp: new Date().toISOString()
      });
    }

    if (showToast) {
      toast({
        title: 'Error',
        description: customMessage || errorMessage,
        variant: 'destructive',
      });
    }

    if (onError && error instanceof Error) {
      onError(error);
    }
  }, [showToast, logToConsole, onError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    customMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, customMessage);
      return null;
    }
  }, [handleError]);

  const wrapWithErrorHandling = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    context?: string
  ): T => {
    return ((...args: Parameters<T>) => {
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            handleError(error, context);
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        handleError(error, context);
        throw error;
      }
    }) as T;
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    wrapWithErrorHandling
  };
};