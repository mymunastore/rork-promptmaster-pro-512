import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RefreshCw, AlertTriangle, Wifi } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useNetworkStatus } from '@/components/NetworkStatus';
import { useToast } from '@/components/Toast';
import Button from '@/components/Button';
import layout from '@/constants/layout';

interface RetryHandlerProps {
  onRetry: () => Promise<void> | void;
  error?: Error | null;
  maxRetries?: number;
  retryDelay?: number;
  autoRetry?: boolean;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  showRetryButton?: boolean;
  retryButtonText?: string;
  errorMessage?: string;
}

export default function RetryHandler({
  onRetry,
  error,
  maxRetries = 3,
  retryDelay = 1000,
  autoRetry = false,
  children,
  fallback,
  showRetryButton = true,
  retryButtonText = 'Try Again',
  errorMessage,
}: RetryHandlerProps) {
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [lastRetryTime, setLastRetryTime] = useState<number>(0);
  
  const { theme } = useTheme();
  const { isConnected } = useNetworkStatus();
  const { showError, showSuccess } = useToast();

  const handleRetry = useCallback(async () => {
    if (isRetrying || retryCount >= maxRetries) {
      return;
    }

    // Check network connectivity
    if (!isConnected) {
      showError(
        'No Internet Connection',
        'Please check your connection and try again.'
      );
      return;
    }

    setIsRetrying(true);
    setLastRetryTime(Date.now());

    try {
      await onRetry();
      setRetryCount(0);
      showSuccess('Success', 'Operation completed successfully');
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      setRetryCount(prev => prev + 1);
      
      if (retryCount + 1 >= maxRetries) {
        showError(
          'Maximum Retries Exceeded',
          'Please try again later or contact support.'
        );
      } else {
        showError(
          'Retry Failed',
          `Attempt ${retryCount + 1} of ${maxRetries} failed. Trying again...`
        );
      }
    } finally {
      setIsRetrying(false);
    }
  }, [
    isRetrying,
    retryCount,
    maxRetries,
    isConnected,
    onRetry,
    showError,
    showSuccess,
  ]);

  // Auto retry with exponential backoff
  useEffect(() => {
    if (autoRetry && error && retryCount < maxRetries && !isRetrying) {
      const delay = retryDelay * Math.pow(2, retryCount);
      const timeSinceLastRetry = Date.now() - lastRetryTime;
      
      if (timeSinceLastRetry >= delay) {
        const timer = setTimeout(() => {
          handleRetry();
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, [autoRetry, error, retryCount, maxRetries, isRetrying, retryDelay, lastRetryTime, handleRetry]);

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    if (!error) return 'An error occurred';
    
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'Network connection failed. Please check your internet connection.';
    }
    
    if (error.message.includes('timeout')) {
      return 'Request timed out. The server may be busy.';
    }
    
    return error.message || 'An unexpected error occurred';
  };

  const canRetry = retryCount < maxRetries && !isRetrying;
  const hasExceededRetries = retryCount >= maxRetries;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: layout.spacing.xl,
    },
    iconContainer: {
      backgroundColor: theme.error + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.lg,
      marginBottom: layout.spacing.xl,
    },
    title: {
      fontSize: layout.typography.sizes.title2,
      fontWeight: layout.typography.weights.bold,
      color: theme.text,
      textAlign: 'center',
      marginBottom: layout.spacing.md,
      letterSpacing: -0.3,
    },
    message: {
      fontSize: layout.typography.sizes.body,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: layout.spacing.xl,
      lineHeight: 24,
      maxWidth: 300,
    },
    retryInfo: {
      fontSize: layout.typography.sizes.footnote,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: layout.spacing.lg,
      opacity: 0.8,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: layout.spacing.md,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    button: {
      minWidth: 120,
    },
    networkStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: layout.spacing.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      backgroundColor: isConnected ? theme.success + '20' : theme.error + '20',
      borderRadius: layout.borderRadius.md,
    },
    networkText: {
      fontSize: layout.typography.sizes.footnote,
      color: isConnected ? theme.success : theme.error,
      marginLeft: layout.spacing.sm,
      fontWeight: layout.typography.weights.medium,
    },
  });

  if (!error) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={48} color={theme.error} />
      </View>
      
      <Text style={styles.title}>
        {hasExceededRetries ? 'Unable to Complete' : 'Something went wrong'}
      </Text>
      
      <Text style={styles.message}>
        {getErrorMessage()}
      </Text>
      
      {retryCount > 0 && (
        <Text style={styles.retryInfo}>
          Retry attempt {retryCount} of {maxRetries}
        </Text>
      )}
      
      {showRetryButton && (
        <View style={styles.buttonContainer}>
          <Button
            title={isRetrying ? 'Retrying...' : retryButtonText}
            onPress={handleRetry}
            disabled={!canRetry}
            loading={isRetrying}
            variant={hasExceededRetries ? 'outline' : 'primary'}
            style={styles.button}
            icon={<RefreshCw size={18} color={hasExceededRetries ? theme.primary : '#FFFFFF'} />}
            testID="retry-button"
          />
        </View>
      )}
      
      <View style={styles.networkStatus}>
        <Wifi size={16} color={isConnected ? theme.success : theme.error} />
        <Text style={styles.networkText}>
          {isConnected ? 'Connected' : 'No Internet'}
        </Text>
      </View>
    </View>
  );
}

// Hook for retry logic
export function useRetry(
  operation: () => Promise<void> | void,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    autoRetry?: boolean;
  } = {}
) {
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { maxRetries = 3 } = options;
  const { isConnected } = useNetworkStatus();
  const { showError, showSuccess } = useToast();

  const retry = useCallback(async () => {
    if (isRetrying || retryCount >= maxRetries) {
      return;
    }

    if (!isConnected) {
      showError('No Internet Connection', 'Please check your connection and try again.');
      return;
    }

    setIsRetrying(true);

    try {
      await operation();
      setRetryCount(0);
      setError(null);
      showSuccess('Success', 'Operation completed successfully');
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setError(retryError as Error);
      
      if (newRetryCount >= maxRetries) {
        showError('Maximum Retries Exceeded', 'Please try again later.');
      }
    } finally {
      setIsRetrying(false);
    }
  }, [operation, isRetrying, retryCount, maxRetries, isConnected, showError, showSuccess]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
    setError(null);
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    error,
    canRetry: retryCount < maxRetries && !isRetrying,
    hasExceededRetries: retryCount >= maxRetries,
  };
}