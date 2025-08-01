import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  testID, 
  variant = 'default',
  padding = 'medium'
}) => {
  const { theme } = useTheme();
  
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return layout.spacing.sm;
      case 'medium': return layout.spacing.md;
      case 'large': return layout.spacing.lg;
      default: return layout.spacing.md;
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.xl,
      padding: getPadding(),
      overflow: 'hidden',
    },
    default: {
      ...layout.shadows.small,
      borderWidth: Platform.select({
        ios: 0,
        android: 0.5,
        web: 1,
      }),
      borderColor: theme.border + '20',
    },
    elevated: {
      ...layout.shadows.medium,
      borderWidth: 0,
    },
    outlined: {
      borderWidth: 1.5,
      borderColor: theme.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    filled: {
      backgroundColor: theme.backgroundAccent,
      borderWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  });
  
  return (
    <View 
      style={[
        styles.card, 
        styles[variant],
        style
      ]} 
      testID={testID}
    >
      {children}
    </View>
  );
};

export default Card;