import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import createContextHook from '@nkzw/create-context-hook';



export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  persistent?: boolean;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  }, [fadeAnim, slideAnim, toast.id, onDismiss]);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    if (!toast.persistent) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.persistent, handleDismiss, fadeAnim, slideAnim]);



  const getIcon = () => {
    const iconSize = 20;
    const iconColor = '#FFFFFF';

    switch (toast.type) {
      case 'success':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'error':
        return <XCircle size={iconSize} color={iconColor} />;
      case 'warning':
        return <AlertCircle size={iconSize} color={iconColor} />;
      case 'info':
        return <Info size={iconSize} color={iconColor} />;
      default:
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.error;
      case 'warning':
        return '#FF9500';
      case 'info':
        return theme.primary;
      default:
        return theme.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: getBackgroundColor(),
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.md,
      marginHorizontal: layout.spacing.lg,
      marginBottom: layout.spacing.sm,
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: 60,
      ...layout.shadows.medium,
    },
    iconContainer: {
      marginRight: layout.spacing.md,
      marginTop: 2,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: layout.typography.sizes.callout,
      fontWeight: layout.typography.weights.semibold,
      color: '#FFFFFF',
      marginBottom: toast.message ? layout.spacing.xs : 0,
      letterSpacing: -0.2,
    },
    message: {
      fontSize: layout.typography.sizes.footnote,
      color: '#FFFFFF',
      opacity: 0.9,
      lineHeight: 18,
      letterSpacing: -0.1,
    },
    actionContainer: {
      marginTop: layout.spacing.sm,
    },
    actionButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.md,
      alignSelf: 'flex-start',
    },
    actionText: {
      fontSize: layout.typography.sizes.footnote,
      fontWeight: layout.typography.weights.semibold,
      color: '#FFFFFF',
      letterSpacing: -0.1,
    },
    dismissButton: {
      padding: layout.spacing.xs,
      marginLeft: layout.spacing.sm,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{toast.title}</Text>
        {toast.message && (
          <Text style={styles.message}>{toast.message}</Text>
        )}
        {toast.action && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toast.action.onPress}
            >
              <Text style={styles.actionText}>{toast.action.label}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        hitSlop={layout.hitSlop.small}
      >
        <X size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      left: 0,
      right: 0,
      zIndex: 9999,
      pointerEvents: 'box-none',
    },
  });

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </View>
  );
}

// Toast Context
export const [ToastProvider, useToast] = createContextHook(() => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const toast: ToastData = {
      id: generateId(),
      duration: 4000,
      ...toastData,
    };

    setToasts(prev => [toast, ...prev.slice(0, 4)]); // Keep max 5 toasts
    return toast.id;
  }, [generateId]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    return showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    return showToast({ type: 'error', title, message, ...options });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    return showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    return showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  return {
    toasts,
    showToast,
    dismissToast,
    dismissAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    ),
  };
});