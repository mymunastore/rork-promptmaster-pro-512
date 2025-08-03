import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import layout from '@/constants/layout';
import Button from '@/components/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const router = useRouter();

  const goHome = () => {
    router.replace('/(tabs)');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: layout.spacing.xl,
      backgroundColor: '#0A0A0A',
    },
    iconContainer: {
      backgroundColor: '#FF6B6B20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.lg,
      marginBottom: layout.spacing.xl,
    },
    title: {
      fontSize: layout.typography.sizes.title1,
      fontWeight: layout.typography.weights.bold,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: layout.spacing.md,
      letterSpacing: -0.5,
    },
    message: {
      fontSize: layout.typography.sizes.body,
      color: '#FFFFFF80',
      textAlign: 'center',
      marginBottom: layout.spacing.xl,
      lineHeight: 24,
      maxWidth: 300,
    },
    errorDetails: {
      fontSize: layout.typography.sizes.footnote,
      color: '#FFFFFF40',
      textAlign: 'center',
      marginBottom: layout.spacing.xl,
      fontFamily: 'monospace',
      maxWidth: 280,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={48} color="#FF6B6B" />
      </View>
      
      <Text style={styles.title}>Something went wrong</Text>
      
      <Text style={styles.message}>
        We encountered an unexpected error. Don&apos;t worry, your data is safe.
      </Text>
      
      {__DEV__ && error && (
        <Text style={styles.errorDetails}>
          {error.message}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          style={styles.button}
          icon={<RefreshCw size={18} color="#FFFFFF" />}
          testID="error-retry-button"
        />
        
        <Button
          title="Go Home"
          onPress={goHome}
          variant="outline"
          style={styles.button}
          icon={<Home size={18} color="#6366F1" />}
          testID="error-home-button"
        />
      </View>
    </View>
  );
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryClass {...props} />;
}

export { ErrorFallback };