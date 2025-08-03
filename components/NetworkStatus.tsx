import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';

interface NetworkStatusProps {
  onNetworkChange?: (isConnected: boolean) => void;
}

export function NetworkStatus({ onNetworkChange }: NetworkStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    let netInfoSubscription: any;

    const setupNetworkListener = async () => {
      if (Platform.OS !== 'web') {
        try {
          // Note: NetInfo is not available in Expo Go, so we'll simulate it
          console.log('Network monitoring would be set up here');
        } catch (error) {
          console.log('NetInfo not available:', error);
        }
      } else {
        // Web network detection
        const handleOnline = () => {
          setIsConnected(true);
          setShowBanner(false);
          onNetworkChange?.(true);
        };

        const handleOffline = () => {
          setIsConnected(false);
          setShowBanner(true);
          onNetworkChange?.(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial state
        setIsConnected(navigator.onLine);
        if (!navigator.onLine) {
          setShowBanner(true);
        }

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    setupNetworkListener();

    return () => {
      if (netInfoSubscription) {
        netInfoSubscription();
      }
    };
  }, [onNetworkChange]);

  const styles = StyleSheet.create({
    banner: {
      backgroundColor: isConnected ? theme.success : theme.error,
      paddingVertical: layout.spacing.sm,
      paddingHorizontal: layout.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerText: {
      color: '#FFFFFF',
      fontSize: layout.typography.sizes.footnote,
      fontWeight: layout.typography.weights.medium,
      marginLeft: layout.spacing.sm,
      letterSpacing: -0.1,
    },
  });

  if (!showBanner && isConnected) {
    return null;
  }

  return (
    <View style={styles.banner}>
      {isConnected ? (
        <Wifi size={16} color="#FFFFFF" />
      ) : (
        <WifiOff size={16} color="#FFFFFF" />
      )}
      <Text style={styles.bannerText}>
        {isConnected ? 'Back online' : 'No internet connection'}
      </Text>
    </View>
  );
}

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setIsConnected(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return { isConnected };
}