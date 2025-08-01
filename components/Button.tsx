import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import layout from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  icon?: React.ReactElement;
  hapticFeedback?: boolean;
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
  hapticFeedback = true,
}) => {
  const { theme } = useTheme();
  
  const handlePress = async () => {
    if (hapticFeedback && Platform.OS !== 'web') {
      const { Haptics } = await import('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      borderRadius: layout.borderRadius.lg,
      overflow: 'hidden',
      ...layout.shadows.small,
    },
    button: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: layout.borderRadius.lg,
      flexDirection: 'row' as const,
    },
    smallButton: {
      paddingVertical: layout.spacing.xs + 2,
      paddingHorizontal: layout.spacing.md,
      minHeight: 36,
    },
    mediumButton: {
      paddingVertical: layout.spacing.sm + 2,
      paddingHorizontal: layout.spacing.lg,
      minHeight: 44,
    },
    largeButton: {
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.xl,
      minHeight: 50,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    textButton: {
      backgroundColor: 'transparent',
      paddingHorizontal: layout.spacing.xs,
      minHeight: 'auto' as const,
    },
    destructiveButton: {
      backgroundColor: theme.error,
    },
    disabledButton: {
      opacity: 0.4,
    },
    text: {
      color: '#FFFFFF',
      fontWeight: layout.typography.weights.semibold,
      textAlign: 'center' as const,
      letterSpacing: -0.2,
    },
    smallText: {
      fontSize: layout.typography.sizes.footnote,
    },
    mediumText: {
      fontSize: layout.typography.sizes.callout,
    },
    largeText: {
      fontSize: layout.typography.sizes.headline,
    },
    outlineText: {
      color: theme.primary,
    },
    textVariantText: {
      color: theme.primary,
    },
    destructiveText: {
      color: '#FFFFFF',
    },
    disabledText: {
      color: theme.textSecondary,
    },
    textWithIcon: {
      marginLeft: layout.spacing.xs,
    },
    iconOnlyButton: {
      paddingHorizontal: layout.spacing.md,
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
              variant === 'destructive' && styles.destructiveText,
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
        onPress={handlePress}
        disabled={disabled || loading}
        testID={testID}
        style={[styles.buttonContainer, style]}
        hitSlop={layout.hitSlop.small}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={variant === 'primary' ? theme.gradient.primary : theme.gradient.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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

  if (variant === 'destructive') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        testID={testID}
        style={[styles.buttonContainer, style]}
        hitSlop={layout.hitSlop.small}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.error, '#FF6B6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
      onPress={handlePress}
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
      hitSlop={layout.hitSlop.small}
      activeOpacity={0.7}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};

export default Button;