import React from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import colors from '@/constants/colors';
import layout from '@/constants/layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  testID,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.multilineInput,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.sm,
    fontSize: 16,
    color: colors.text,
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: layout.spacing.xs,
  },
});

export default Input;