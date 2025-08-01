import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import colors from '@/constants/colors';
import layout from '@/constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({ children, style, testID }) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card;