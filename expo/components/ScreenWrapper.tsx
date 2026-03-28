import React, { ReactNode } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useNetworkStatus } from '@/components/NetworkStatus';
import { FullScreenLoading, LoadingOverlay } from '@/components/LoadingStates';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/components/Toast';


interface ScreenWrapperProps {
  children: ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  loadingVariant?: 'default' | 'ai' | 'sync';
  error?: Error | null;
  onRetry?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  showNetworkStatus?: boolean;
  overlay?: {
    visible: boolean;
    message?: string;
    variant?: 'default' | 'ai' | 'sync';
  };
  testID?: string;
}

export default function ScreenWrapper({
  children,
  loading = false,
  loadingMessage = 'Loading...',
  loadingVariant = 'default',
  error = null,
  onRetry,
  refreshing = false,
  onRefresh,
  scrollable = false,
  safeArea = true,
  backgroundColor,
  showNetworkStatus = true,
  overlay,
  testID,
}: ScreenWrapperProps) {
  const { theme } = useTheme();
  const { isConnected } = useNetworkStatus();
  const { showError } = useToast();

  // Show network error toast when offline
  React.useEffect(() => {
    if (showNetworkStatus && !isConnected) {
      showError(
        'No Internet Connection',
        'Some features may not work properly while offline.',
        { persistent: true }
      );
    }
  }, [isConnected, showNetworkStatus, showError]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor || theme.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <FullScreenLoading
          message={loadingMessage}
          variant={loadingVariant}
        />
      );
    }

    if (error && onRetry) {
      return (
        <ErrorBoundary
          fallback={
            <View style={styles.content}>
              {/* Error will be handled by ErrorBoundary */}
            </View>
          }
        >
          <View />
        </ErrorBoundary>
      );
    }

    if (scrollable) {
      return (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
                colors={[theme.primary]}
              />
            ) : undefined
          }
          testID={testID ? `${testID}-scroll` : undefined}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={styles.content} testID={testID}>
        {children}
      </View>
    );
  };

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <ErrorBoundary>
      <Wrapper style={styles.container} testID={testID}>
        {renderContent()}
        {overlay && (
          <LoadingOverlay
            visible={overlay.visible}
            message={overlay.message}
            variant={overlay.variant}
          />
        )}
      </Wrapper>
    </ErrorBoundary>
  );
}

// Convenience components for common patterns
export function LoadingScreen({
  message = 'Loading...',
  variant = 'default',
}: {
  message?: string;
  variant?: 'default' | 'ai' | 'sync';
}) {
  return (
    <ScreenWrapper loading={true} loadingMessage={message} loadingVariant={variant}>
      <View />
    </ScreenWrapper>
  );
}

export function ScrollableScreen({
  children,
  onRefresh,
  refreshing = false,
  ...props
}: Omit<ScreenWrapperProps, 'scrollable'> & {
  children: ReactNode;
}) {
  return (
    <ScreenWrapper
      {...props}
      scrollable={true}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      {children}
    </ScreenWrapper>
  );
}

export function StaticScreen({
  children,
  ...props
}: Omit<ScreenWrapperProps, 'scrollable'> & {
  children: ReactNode;
}) {
  return (
    <ScreenWrapper {...props} scrollable={false}>
      {children}
    </ScreenWrapper>
  );
}