import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Brain, Zap } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';

const { width } = Dimensions.get('window');

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

export function LoadingSpinner({ size = 'medium', color, style }: LoadingSpinnerProps) {
  const { theme } = useTheme();
  
  const spinnerSize = {
    small: 20,
    medium: 32,
    large: 48,
  }[size];

  return (
    <ActivityIndicator 
      size={spinnerSize} 
      color={color || theme.primary} 
      style={style}
    />
  );
}

interface FullScreenLoadingProps {
  message?: string;
  variant?: 'default' | 'ai' | 'sync';
}

export function FullScreenLoading({ message = 'Loading...', variant = 'default' }: FullScreenLoadingProps) {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (variant) {
      case 'ai':
        return <Brain size={48} color={theme.primary} />;
      case 'sync':
        return <Zap size={48} color={theme.primary} />;
      default:
        return <Sparkles size={48} color={theme.primary} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: layout.spacing.xl,
    },
    iconContainer: {
      backgroundColor: theme.primary + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.lg,
      marginBottom: layout.spacing.xl,
    },
    spinner: {
      marginBottom: layout.spacing.lg,
    },
    message: {
      fontSize: layout.typography.sizes.body,
      color: theme.textSecondary,
      textAlign: 'center',
      letterSpacing: -0.2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <LoadingSpinner size="large" style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    skeleton: {
      width,
      height,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: theme.surface,
    },
    gradient: {
      flex: 1,
    },
  });

  return (
    <View style={[styles.skeleton, style]}>
      <LinearGradient
        colors={[
          theme.surface,
          theme.surface + '80',
          theme.surface,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </View>
  );
}

export function SkeletonCard() {
  const styles = StyleSheet.create({
    container: {
      padding: layout.spacing.lg,
      marginBottom: layout.spacing.md,
      borderRadius: layout.borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    avatar: {
      marginRight: layout.spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      marginBottom: layout.spacing.xs,
    },
    subtitle: {
      marginBottom: layout.spacing.md,
    },
    content: {
      marginBottom: layout.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} style={styles.avatar} />
        <View style={styles.titleContainer}>
          <Skeleton width="70%" height={16} style={styles.title} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={styles.subtitle} />
      <Skeleton width="90%" height={12} style={styles.content} />
      <Skeleton width="60%" height={12} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

interface InlineLoadingProps {
  message?: string;
  size?: 'small' | 'medium';
}

export function InlineLoading({ message = 'Loading...', size = 'small' }: InlineLoadingProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: layout.spacing.md,
    },
    spinner: {
      marginRight: layout.spacing.sm,
    },
    message: {
      fontSize: size === 'small' ? layout.typography.sizes.footnote : layout.typography.sizes.body,
      color: theme.textSecondary,
      letterSpacing: -0.1,
    },
  });

  return (
    <View style={styles.container}>
      <LoadingSpinner size={size} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  variant?: 'default' | 'ai' | 'sync';
}

export function LoadingOverlay({ visible, message = 'Processing...', variant = 'default' }: LoadingOverlayProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const getIcon = () => {
    switch (variant) {
      case 'ai':
        return <Brain size={32} color={theme.primary} />;
      case 'sync':
        return <Zap size={32} color={theme.primary} />;
      default:
        return <Sparkles size={32} color={theme.primary} />;
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      backgroundColor: theme.surface,
      borderRadius: layout.borderRadius.xl,
      padding: layout.spacing.xl,
      alignItems: 'center',
      minWidth: 200,
      maxWidth: width * 0.8,
    },
    iconContainer: {
      backgroundColor: theme.primary + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.md,
      marginBottom: layout.spacing.lg,
    },
    spinner: {
      marginBottom: layout.spacing.md,
    },
    message: {
      fontSize: layout.typography.sizes.body,
      color: theme.text,
      textAlign: 'center',
      letterSpacing: -0.2,
    },
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <LoadingSpinner size="medium" style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

interface PullToRefreshLoadingProps {
  refreshing: boolean;
}

export function PullToRefreshLoading({ refreshing }: PullToRefreshLoadingProps) {
  const { theme } = useTheme();

  if (!refreshing) return null;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: layout.spacing.md,
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <LoadingSpinner size="small" color={theme.primary} />
    </View>
  );
}

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
}

export function ButtonLoading({ loading, children }: ButtonLoadingProps) {
  if (loading) {
    return <LoadingSpinner size="small" color="#FFFFFF" />;
  }
  return <>{children}</>;
}