import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import layout from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    buttonContainer: {
      borderRadius: layout.borderRadius.md,
      overflow: 'hidden',
    },
    button: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: layout.borderRadius.md,
      flexDirection: 'row' as const,
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
      borderColor: theme.primary,
    },
    textButton: {
      backgroundColor: 'transparent',
      paddingHorizontal: layout.spacing.xs,
      minHeight: 'auto' as const,
    },
    disabledButton: {
      opacity: 0.6,
    },
    text: {
      color: theme.background,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
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
      color: theme.primary,
    },
    textVariantText: {
      color: theme.primary,
    },
    disabledText: {
      color: theme.textSecondary,
    },
    textWithIcon: {
      marginLeft: 8,
    },
    iconOnlyButton: {
      paddingHorizontal: 12,
    },
  });
  
  const getButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'outline' ? theme.primary : theme.background} />;
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
          colors={variant === 'primary' ? [theme.primary, theme.primaryLight] : [theme.secondary, theme.accent2]}
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

export default Button;