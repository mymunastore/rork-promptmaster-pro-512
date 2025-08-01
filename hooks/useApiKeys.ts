import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  gemini?: string;
}

interface ApiKeySettings {
  selectedProvider: 'openai' | 'anthropic' | 'gemini' | 'rork';
  useCustomKeys: boolean;
}

const API_KEYS_STORAGE_KEY = 'ai_prompt_generator_api_keys';
const API_SETTINGS_STORAGE_KEY = 'ai_prompt_generator_api_settings';

export const [ApiKeysProvider, useApiKeys] = createContextHook(() => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [settings, setSettings] = useState<ApiKeySettings>({
    selectedProvider: 'rork',
    useCustomKeys: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load API keys and settings from storage
  useEffect(() => {
    loadApiKeysAndSettings();
  }, []);

  const loadApiKeysAndSettings = async () => {
    try {
      setIsLoading(true);
      
      const [storedKeys, storedSettings] = await Promise.all([
        AsyncStorage.getItem(API_KEYS_STORAGE_KEY),
        AsyncStorage.getItem(API_SETTINGS_STORAGE_KEY),
      ]);

      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading API keys and settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (provider: keyof ApiKeys, key: string) => {
    try {
      const updatedKeys = { ...apiKeys, [provider]: key };
      setApiKeys(updatedKeys);
      await AsyncStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(updatedKeys));
      console.log(`${provider} API key saved`);
    } catch (error) {
      console.error(`Error saving ${provider} API key:`, error);
      throw error;
    }
  };

  const removeApiKey = async (provider: keyof ApiKeys) => {
    try {
      const updatedKeys = { ...apiKeys };
      delete updatedKeys[provider];
      setApiKeys(updatedKeys);
      await AsyncStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(updatedKeys));
      console.log(`${provider} API key removed`);
    } catch (error) {
      console.error(`Error removing ${provider} API key:`, error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<ApiKeySettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(API_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('API settings updated:', updatedSettings);
    } catch (error) {
      console.error('Error updating API settings:', error);
      throw error;
    }
  };

  const getActiveApiKey = (): string | null => {
    if (!settings.useCustomKeys || settings.selectedProvider === 'rork') {
      return null; // Use Rork's API
    }
    
    return apiKeys[settings.selectedProvider] || null;
  };

  const getApiEndpoint = (): string => {
    if (!settings.useCustomKeys || settings.selectedProvider === 'rork') {
      return 'https://toolkit.rork.com/text/llm/';
    }
    
    // For custom API keys, we'll still use Rork's endpoint but with custom keys
    // In a real app, you'd have different endpoints for different providers
    return 'https://toolkit.rork.com/text/llm/';
  };

  const hasValidApiKey = (): boolean => {
    if (!settings.useCustomKeys || settings.selectedProvider === 'rork') {
      return true; // Rork's API is always available
    }
    
    const key = apiKeys[settings.selectedProvider];
    return Boolean(key && key.trim().length > 0);
  };

  const clearAllApiKeys = async () => {
    try {
      setApiKeys({});
      await AsyncStorage.removeItem(API_KEYS_STORAGE_KEY);
      console.log('All API keys cleared');
    } catch (error) {
      console.error('Error clearing API keys:', error);
      throw error;
    }
  };

  return {
    apiKeys,
    settings,
    isLoading,
    saveApiKey,
    removeApiKey,
    updateSettings,
    getActiveApiKey,
    getApiEndpoint,
    hasValidApiKey,
    clearAllApiKeys,
  };
});