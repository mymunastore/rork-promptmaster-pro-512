import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export interface AppError {
  id: string;
  message: string;
  type: 'network' | 'validation' | 'server' | 'client' | 'unknown';
  code?: string | number;
  timestamp: Date;
  context?: Record<string, any>;
  recoverable: boolean;
}

interface UseErrorHandlerReturn {
  errors: AppError[];
  addError: (error: Partial<AppError> & { message: string }) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  handleError: (error: unknown, context?: Record<string, any>) => AppError;
  hasErrors: boolean;
  latestError: AppError | null;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [errors, setErrors] = useState<AppError[]>([]);

  const generateErrorId = useCallback(() => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addError = useCallback((errorData: Partial<AppError> & { message: string }) => {
    const error: AppError = {
      id: generateErrorId(),
      type: 'unknown',
      timestamp: new Date(),
      recoverable: true,
      ...errorData,
    };

    setErrors(prev => [error, ...prev.slice(0, 9)]); // Keep max 10 errors
    
    // Log error for debugging
    console.error('App Error:', error);
    
    return error;
  }, [generateErrorId]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleError = useCallback((error: unknown, context?: Record<string, any>): AppError => {
    let appError: Partial<AppError> & { message: string };

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        appError = {
          message: 'Network connection failed. Please check your internet connection.',
          type: 'network',
          code: 'NETWORK_ERROR',
          recoverable: true,
        };
      }
      // Validation errors
      else if (error.message.includes('validation') || error.message.includes('invalid')) {
        appError = {
          message: 'Invalid input provided. Please check your data.',
          type: 'validation',
          code: 'VALIDATION_ERROR',
          recoverable: true,
        };
      }
      // Server errors
      else if (error.message.includes('500') || error.message.includes('server')) {
        appError = {
          message: 'Server error occurred. Please try again later.',
          type: 'server',
          code: 'SERVER_ERROR',
          recoverable: true,
        };
      }
      // Generic error
      else {
        appError = {
          message: error.message || 'An unexpected error occurred.',
          type: 'client',
          recoverable: true,
        };
      }
    } else if (typeof error === 'string') {
      appError = {
        message: error,
        type: 'unknown',
        recoverable: true,
      };
    } else {
      appError = {
        message: 'An unknown error occurred.',
        type: 'unknown',
        recoverable: false,
      };
    }

    if (context) {
      appError.context = context;
    }

    return addError(appError);
  }, [addError]);

  const hasErrors = errors.length > 0;
  const latestError = errors.length > 0 ? errors[0] : null;

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleError,
    hasErrors,
    latestError,
  };
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandling() {
  if (Platform.OS === 'web') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You could dispatch this to a global error handler here
    });

    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // You could dispatch this to a global error handler here
    });
  }
}

// Utility function to create user-friendly error messages
export function createUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    // Timeout errors
    if (error.message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }
    
    // Authentication errors
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return 'Your session has expired. Please log in again.';
    }
    
    // Permission errors
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    // Not found errors
    if (error.message.includes('404') || error.message.includes('not found')) {
      return 'The requested resource was not found.';
    }
    
    // Server errors
    if (error.message.includes('500') || error.message.includes('server')) {
      return 'A server error occurred. Our team has been notified.';
    }
    
    // Rate limiting
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}