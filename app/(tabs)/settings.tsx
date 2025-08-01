import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Alert, Linking, Platform, Share, Pressable } from 'react-native';
import { 
  User, 
  Bell, 
  Moon, 
  Sun,
  Share2, 
  HelpCircle, 
  Info, 
  Trash2,
  ChevronRight,
  Settings,
  Smartphone,
  Globe
} from 'lucide-react-native';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import { usePromptStore } from '@/hooks/usePromptStore';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { savedPrompts } = usePromptStore();
  const { theme, themeMode, isDark, toggleTheme, isLoading: themeLoading } = useTheme();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications_enabled');
      
      if (notifications !== null) {
        setNotificationsEnabled(JSON.parse(notifications));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const saveSettings = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings('notifications_enabled', value);
    console.log('Notifications:', value ? 'enabled' : 'disabled');
  };
  
  const handleDarkModeToggle = () => {
    toggleTheme();
    console.log('Theme toggled to:', themeMode === 'dark' ? 'light' : 'dark');
  };
  
  const handleProfilePress = () => {
    Alert.alert(
      'Profile',
      'Profile management is coming soon! You\'ll be able to sync your prompts across devices.',
      [{ text: 'OK' }]
    );
  };
  
  const handleClearData = () => {
    const promptCount = savedPrompts.length;
    Alert.alert(
      'Clear All Data',
      `Are you sure you want to delete all ${promptCount} saved prompts? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared successfully.');
              console.log('All app data cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const shareMessage = 'Check out this amazing AI Prompt Generator app! Create professional-grade prompts for any AI tool. 🚀';
      
      if (Platform.OS === 'web') {
        // Web sharing
        if (navigator.share) {
          await navigator.share({
            title: 'AI Prompt Generator',
            text: shareMessage,
            url: window.location.href,
          });
        } else {
          // Fallback for web browsers without native sharing
          await Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`);
        }
      } else {
        // Native sharing
        await Share.share({
          message: shareMessage,
          title: 'AI Prompt Generator',
        });
      }
      console.log('App shared successfully');
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Error', 'Failed to share the app. Please try again.');
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Here are your options:\n\n• Email: support@aipromptgenerator.com\n• FAQ: Check our frequently asked questions\n• Feedback: Share your suggestions',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            const emailUrl = `mailto:support@aipromptgenerator.com?subject=AI Prompt Generator Support&body=Hi, I need help with...`;
            Linking.openURL(emailUrl).catch(() => {
              Alert.alert('Error', 'Could not open email client');
            });
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    const deviceInfo = Platform.select({
      ios: 'iOS',
      android: 'Android',
      web: 'Web',
      default: 'Unknown'
    });
    
    Alert.alert(
      'About AI Prompt Generator',
      `Version 1.0.0\nPlatform: ${deviceInfo}\nPrompts Saved: ${savedPrompts.length}\n\nAI Prompt Generator is a powerful tool designed to help you create professional-grade prompts for any AI tool. Create, customize, and optimize your prompts for better results.\n\nFeatures:\n• Template library\n• Custom prompt creation\n• Keyword suggestions\n• Cross-platform sync`,
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: layout.spacing.lg,
    },
    section: {
      marginBottom: layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
      paddingHorizontal: layout.spacing.xs,
    },
    card: {
      padding: 0,
      overflow: 'hidden',
      backgroundColor: theme.card,
    },
    settingItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: layout.spacing.md,
      minHeight: 64,
    },
    settingItemPressed: {
      backgroundColor: `${theme.primary}08`,
    },
    settingIconContainer: {
      width: 36,
      height: 36,
      borderRadius: layout.borderRadius.md,
      backgroundColor: `${theme.primary}15`,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: layout.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: theme.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: layout.spacing.md,
    },
    footer: {
      alignItems: 'center' as const,
      marginTop: layout.spacing.xl,
      marginBottom: layout.spacing.xxl,
    },
    footerText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    footerSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: layout.spacing.xs,
    },
    footerCopyright: {
      fontSize: 12,
      color: theme.textSecondary,
      opacity: 0.7,
    },
    storageIndicator: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.md,
      minWidth: 32,
      alignItems: 'center' as const,
    },
    storageText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: theme.background,
    },
  });

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID="settings-screen"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.card}>
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleProfilePress}
            testID="profile-setting"
          >
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.primary}15` }]}>
              <User size={20} color={theme.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Profile</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Manage your account details</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.primary}15` }]}>
              <Bell size={20} color={theme.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'} • Get updates about new features
              </Text>
            </View>
            <Switch
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={notificationsEnabled ? theme.primary : theme.card}
              ios_backgroundColor={theme.border}
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              testID="notifications-switch"
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.primary}15` }]}>
              {isDark ? (
                <Moon size={20} color={theme.primary} />
              ) : (
                <Sun size={20} color={theme.primary} />
              )}
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {isDark ? 'Enabled' : 'Disabled'} • Switch between light and dark themes
              </Text>
            </View>
            <Switch
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={isDark ? theme.primary : theme.card}
              ios_backgroundColor={theme.border}
              value={isDark}
              onValueChange={handleDarkModeToggle}
              testID="dark-mode-switch"
              disabled={themeLoading}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.card}>
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleShare}
            testID="share-app-setting"
          >
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <Share2 size={20} color={theme.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Share App</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Tell others about this amazing app</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleSupport}
            testID="support-setting"
          >
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <HelpCircle size={20} color={theme.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Help & Support</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Get assistance and send feedback</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleAbout}
            testID="about-setting"
          >
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <Info size={20} color={theme.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>About</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Version, stats, and app info</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.accent3}15` }]}>
              <Settings size={20} color={theme.accent3} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Storage Info</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {savedPrompts.length} prompts saved • {Platform.OS === 'web' ? 'Browser' : 'Device'} storage
              </Text>
            </View>
            <View style={[styles.storageIndicator, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.storageText, { color: theme.background }]}>{savedPrompts.length}</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleClearData}
            testID="clear-data-setting"
            disabled={isLoading}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.error}15` }]}>
              <Trash2 size={20} color={theme.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.error }]}>Clear All Data</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {isLoading ? 'Clearing...' : `Delete all ${savedPrompts.length} saved prompts`}
              </Text>
            </View>
            <ChevronRight size={20} color={theme.error} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Info</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: `${theme.accent4}15` }]}>
              {Platform.OS === 'web' ? (
                <Globe size={20} color={theme.accent4} />
              ) : (
                <Smartphone size={20} color={theme.accent4} />
              )}
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Platform</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {Platform.select({
                  ios: 'iOS Device',
                  android: 'Android Device',
                  web: 'Web Browser',
                  default: 'Unknown Platform'
                })}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.text }]}>AI Prompt Generator v1.0.0</Text>
        <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>Platform: {Platform.OS} • Prompts: {savedPrompts.length}</Text>
        <Text style={[styles.footerCopyright, { color: theme.textSecondary }]}>© 2025 All Rights Reserved</Text>
      </View>
    </ScrollView>
  );
}