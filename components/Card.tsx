import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
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
      backgroundColor: theme.card + 'E6',
      borderRadius: layout.borderRadius.xl,
      padding: getPadding(),
      overflow: 'hidden',

      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    default: {
      ...layout.shadows.small,
      backgroundColor: theme.card + 'CC',
    },
    elevated: {
      ...layout.shadows.medium,
      backgroundColor: theme.card + 'E6',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    outlined: {
      borderWidth: 1.5,
      borderColor: theme.primary + '40',
      backgroundColor: theme.card + '80',
      shadowOpacity: 0,
      elevation: 0,
    },
    filled: {
      backgroundColor: theme.backgroundAccent + 'CC',
      borderColor: 'rgba(255, 255, 255, 0.08)',
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