import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Switch, Platform } from 'react-native';
import { Key, Eye, EyeOff, Trash2, Check, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useApiKeys } from '@/hooks/useApiKeys';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface ApiKeyManagerProps {
  testID?: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ testID }) => {
  const { theme } = useTheme();
  const { 
    apiKeys, 
    settings, 
    saveApiKey, 
    removeApiKey, 
    updateSettings,
    clearAllApiKeys 
  } = useApiKeys();

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempKeyValue, setTempKeyValue] = useState<string>('');

  const providers = [
    { key: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
    { key: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-...' },
    { key: 'gemini', label: 'Google Gemini', placeholder: 'AIza...' },
  ] as const;

  const handleToggleVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleStartEditing = (provider: string) => {
    setEditingKey(provider);
    setTempKeyValue(apiKeys[provider as keyof typeof apiKeys] || '');
  };

  const handleSaveKey = async (provider: string) => {
    if (!tempKeyValue.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    try {
      await saveApiKey(provider as keyof typeof apiKeys, tempKeyValue.trim());
      setEditingKey(null);
      setTempKeyValue('');
      Alert.alert('Success', `${provider} API key saved successfully`);
    } catch {
      Alert.alert('Error', `Failed to save ${provider} API key`);
    }
  };

  const handleCancelEditing = () => {
    setEditingKey(null);
    setTempKeyValue('');
  };

  const handleRemoveKey = (provider: string) => {
    Alert.alert(
      'Remove API Key',
      `Are you sure you want to remove the ${provider} API key?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeApiKey(provider as keyof typeof apiKeys);
              Alert.alert('Success', `${provider} API key removed`);
            } catch {
              Alert.alert('Error', `Failed to remove ${provider} API key`);
            }
          },
        },
      ]
    );
  };

  const handleProviderChange = (provider: 'openai' | 'anthropic' | 'gemini' | 'rork') => {
    updateSettings({ selectedProvider: provider });
  };

  const handleToggleCustomKeys = (enabled: boolean) => {
    updateSettings({ useCustomKeys: enabled });
    if (!enabled) {
      updateSettings({ selectedProvider: 'rork' });
    }
  };

  const handleClearAllKeys = () => {
    Alert.alert(
      'Clear All API Keys',
      'Are you sure you want to remove all saved API keys? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllApiKeys();
              Alert.alert('Success', 'All API keys have been cleared');
            } catch {
              Alert.alert('Error', 'Failed to clear API keys');
            }
          },
        },
      ]
    );
  };

  const maskApiKey = (key: string): string => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const styles = StyleSheet.create({
    container: {
      padding: layout.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    section: {
      marginBottom: layout.spacing.lg,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: layout.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLabel: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    providerSelector: {
      marginTop: layout.spacing.sm,
    },
    providerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: layout.spacing.sm,
      paddingHorizontal: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: layout.spacing.sm,
    },
    providerButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    providerButtonText: {
      fontSize: 14,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    providerButtonTextActive: {
      color: theme.card,
    },
    keyRow: {
      marginBottom: layout.spacing.md,
    },
    keyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.sm,
    },
    keyLabel: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme.text,
    },
    keyStatus: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
    keyStatusValid: {
      color: theme.success,
    },
    keyStatusMissing: {
      color: theme.error,
    },
    keyInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    keyInput: {
      flex: 1,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 14,
      color: theme.text,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    keyDisplay: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 14,
      color: theme.text,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    keyActions: {
      flexDirection: 'row',
      marginLeft: layout.spacing.sm,
      gap: layout.spacing.xs,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    saveButton: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },
    cancelButton: {
      backgroundColor: theme.error,
      borderColor: theme.error,
    },
    warningText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginTop: layout.spacing.xs,
    },
    clearAllButton: {
      marginTop: layout.spacing.md,
    },
  });

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Key size={20} color={theme.primary} />
        <Text style={styles.title}>AI API Configuration</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Use Custom API Keys</Text>
            <Text style={styles.settingDescription}>
              Use your own API keys instead of Rork&apos;s built-in AI service
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.useCustomKeys ? theme.primary : theme.card}
            ios_backgroundColor={theme.border}
            value={settings.useCustomKeys}
            onValueChange={handleToggleCustomKeys}
            testID="custom-keys-switch"
          />
        </View>

        {settings.useCustomKeys && (
          <View style={styles.providerSelector}>
            <Text style={styles.sectionTitle}>Select AI Provider</Text>
            
            <TouchableOpacity
              style={[
                styles.providerButton,
                settings.selectedProvider === 'rork' && styles.providerButtonActive,
              ]}
              onPress={() => handleProviderChange('rork')}
            >
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.success }} />
              <Text style={[
                styles.providerButtonText,
                settings.selectedProvider === 'rork' && styles.providerButtonTextActive,
              ]}>
                Rork (Built-in) - Free
              </Text>
            </TouchableOpacity>

            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.key}
                style={[
                  styles.providerButton,
                  settings.selectedProvider === provider.key && styles.providerButtonActive,
                ]}
                onPress={() => handleProviderChange(provider.key)}
                disabled={!apiKeys[provider.key]}
              >
                <View style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: 6, 
                  backgroundColor: apiKeys[provider.key] ? theme.success : theme.error 
                }} />
                <Text style={[
                  styles.providerButtonText,
                  settings.selectedProvider === provider.key && styles.providerButtonTextActive,
                  !apiKeys[provider.key] && { opacity: 0.5 },
                ]}>
                  {provider.label} {!apiKeys[provider.key] && '(No API Key)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {settings.useCustomKeys && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Keys</Text>
          
          {providers.map((provider) => {
            const hasKey = Boolean(apiKeys[provider.key]);
            const isEditing = editingKey === provider.key;
            const keyValue = apiKeys[provider.key] || '';

            return (
              <View key={provider.key} style={styles.keyRow}>
                <View style={styles.keyHeader}>
                  <Text style={styles.keyLabel}>{provider.label}</Text>
                  <Text style={[
                    styles.keyStatus,
                    hasKey ? styles.keyStatusValid : styles.keyStatusMissing,
                  ]}>
                    {hasKey ? 'Configured' : 'Not Set'}
                  </Text>
                </View>

                <View style={styles.keyInputContainer}>
                  {isEditing ? (
                    <TextInput
                      style={styles.keyInput}
                      value={tempKeyValue}
                      onChangeText={setTempKeyValue}
                      placeholder={provider.placeholder}
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry={!showKeys[provider.key]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      testID={`${provider.key}-input`}
                    />
                  ) : (
                    <Text style={styles.keyDisplay}>
                      {hasKey 
                        ? (showKeys[provider.key] ? keyValue : maskApiKey(keyValue))
                        : provider.placeholder
                      }
                    </Text>
                  )}

                  <View style={styles.keyActions}>
                    {isEditing ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.saveButton]}
                          onPress={() => handleSaveKey(provider.key)}
                          testID={`save-${provider.key}`}
                        >
                          <Check size={16} color={theme.card} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={handleCancelEditing}
                          testID={`cancel-${provider.key}`}
                        >
                          <X size={16} color={theme.card} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        {hasKey && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleToggleVisibility(provider.key)}
                            testID={`toggle-${provider.key}`}
                          >
                            {showKeys[provider.key] ? (
                              <EyeOff size={16} color={theme.textSecondary} />
                            ) : (
                              <Eye size={16} color={theme.textSecondary} />
                            )}
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleStartEditing(provider.key)}
                          testID={`edit-${provider.key}`}
                        >
                          <Key size={16} color={theme.textSecondary} />
                        </TouchableOpacity>
                        {hasKey && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleRemoveKey(provider.key)}
                            testID={`remove-${provider.key}`}
                          >
                            <Trash2 size={16} color={theme.error} />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                </View>

                {!hasKey && (
                  <Text style={styles.warningText}>
                    Add your {provider.label} API key to use this provider
                  </Text>
                )}
              </View>
            );
          })}

          <Button
            title="Clear All API Keys"
            onPress={handleClearAllKeys}
            variant="outline"
            style={styles.clearAllButton}
            testID="clear-all-keys"
          />
        </View>
      )}

      <Text style={styles.warningText}>
        API keys are stored securely on your device and never shared with third parties.
        {settings.useCustomKeys && ' Using custom keys may incur charges from your chosen provider.'}
      </Text>
    </Card>
  );
};

export default ApiKeyManager;