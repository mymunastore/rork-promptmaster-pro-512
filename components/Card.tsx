import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({ children, style, testID }) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.md,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
  
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export default Card;