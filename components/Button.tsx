import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import layout from '@/constants/layout';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  icon?: React.ReactElement;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
  icon,
}) => {
  const getButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.card} />;
    }
    
    return (
      <>
        {icon && icon}
        {title && (
          <Text 
            style={[
              styles.text, 
              styles[`${size}Text`],
              variant === 'outline' && styles.outlineText,
              variant === 'text' && styles.textVariantText,
              disabled && styles.disabledText,
              icon && styles.textWithIcon,
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </>
    );
  };

  if (variant === 'primary' || variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        testID={testID}
        style={[styles.buttonContainer, style]}
      >
        <LinearGradient
          colors={variant === 'primary' ? colors.gradient.primary : colors.gradient.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            styles[`${size}Button`],
            disabled && styles.disabledButton,
            icon && !title && styles.iconOnlyButton,
          ]}
        >
          {getButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={[
        styles.button,
        styles[`${size}Button`],
        variant === 'outline' && styles.outlineButton,
        variant === 'text' && styles.textButton,
        disabled && styles.disabledButton,
        icon && !title && styles.iconOnlyButton,
        style,
      ]}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.md,
  },
  smallButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    minHeight: 32,
  },
  mediumButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xl,
    minHeight: 52,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: layout.spacing.xs,
    minHeight: 'auto',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    color: colors.card,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  outlineText: {
    color: colors.primary,
  },
  textVariantText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.inactive,
  },
  textWithIcon: {
    marginLeft: 8,
  },
  iconOnlyButton: {
    paddingHorizontal: 12,
  },
});

export default Button;