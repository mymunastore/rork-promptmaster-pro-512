import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Alert, Linking, Platform, Share, Pressable } from 'react-native';
import { 
  User, 
  Bell, 
  Moon, 
  Share2, 
  HelpCircle, 
  Info, 
  Trash2,
  ChevronRight,
  Settings,
  Smartphone,
  Globe
} from 'lucide-react-native';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import { usePromptStore } from '@/hooks/usePromptStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { savedPrompts } = usePromptStore();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications_enabled');
      const darkMode = await AsyncStorage.getItem('dark_mode_enabled');
      
      if (notifications !== null) {
        setNotificationsEnabled(JSON.parse(notifications));
      }
      if (darkMode !== null) {
        setDarkModeEnabled(JSON.parse(darkMode));
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
  
  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value);
    saveSettings('dark_mode_enabled', value);
    console.log('Dark mode:', value ? 'enabled' : 'disabled');
    Alert.alert(
      'Theme Change',
      'Dark mode will be applied in the next app update. This feature is coming soon!',
      [{ text: 'OK' }]
    );
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
            <View style={styles.settingIconContainer}>
              <User size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingDescription}>Manage your account details</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'} • Get updates about new features
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : colors.card}
              ios_backgroundColor={colors.border}
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              testID="notifications-switch"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                {darkModeEnabled ? 'Enabled' : 'Disabled'} • Coming soon!
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={darkModeEnabled ? colors.primary : colors.card}
              ios_backgroundColor={colors.border}
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
              testID="dark-mode-switch"
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
            <View style={styles.settingIconContainer}>
              <Share2 size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Share App</Text>
              <Text style={styles.settingDescription}>Tell others about this amazing app</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleSupport}
            testID="support-setting"
          >
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get assistance and send feedback</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleAbout}
            testID="about-setting"
          >
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>About</Text>
              <Text style={styles.settingDescription}>Version, stats, and app info</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Settings size={20} color={colors.accent3} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Storage Info</Text>
              <Text style={styles.settingDescription}>
                {savedPrompts.length} prompts saved • {Platform.OS === 'web' ? 'Browser' : 'Device'} storage
              </Text>
            </View>
            <View style={styles.storageIndicator}>
              <Text style={styles.storageText}>{savedPrompts.length}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed
            ]}
            onPress={handleClearData}
            testID="clear-data-setting"
            disabled={isLoading}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>Clear All Data</Text>
              <Text style={styles.settingDescription}>
                {isLoading ? 'Clearing...' : `Delete all ${savedPrompts.length} saved prompts`}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.error} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Info</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {Platform.OS === 'web' ? (
                <Globe size={20} color={colors.accent4} />
              ) : (
                <Smartphone size={20} color={colors.accent4} />
              )}
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Platform</Text>
              <Text style={styles.settingDescription}>
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
        <Text style={styles.footerText}>AI Prompt Generator v1.0.0</Text>
        <Text style={styles.footerSubtext}>Platform: {Platform.OS} • Prompts: {savedPrompts.length}</Text>
        <Text style={styles.footerCopyright}>© 2025 All Rights Reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: layout.spacing.lg,
  },
  section: {
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: layout.spacing.md,
    paddingHorizontal: layout.spacing.xs,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    minHeight: 64,
  },
  settingItemPressed: {
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: layout.spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: layout.spacing.xl,
    marginBottom: layout.spacing.xxl,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  storageIndicator: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
    minWidth: 32,
    alignItems: 'center',
  },
  storageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
});