import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Alert, Linking, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Moon, 
  Share2, 
  HelpCircle, 
  Info, 
  Trash2,
  ChevronRight
} from 'lucide-react-native';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import Card from '@/components/Card';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  // const router = useRouter();
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your saved prompts? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Linking.openURL('https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20AI%20Prompt%20Generator%20app!');
    } catch (error) {
      console.error('Error opening share link:', error);
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'For any questions or issues, please contact our support team at support@aipromptgenerator.com',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About AI Prompt Generator',
      'Version 1.0.0\n\nAI Prompt Generator is a tool designed to help you create professional-grade prompts for any AI tool. Create, customize, and optimize your prompts for better results.',
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
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <User size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingDescription}>Manage your account details</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Configure notification preferences</Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              value={true}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Toggle dark theme</Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              value={false}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Share2 size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Share App</Text>
              <Text style={styles.settingDescription}>Tell others about this app</Text>
            </View>
            <TouchableOpacity onPress={handleShare}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get assistance with the app</Text>
            </View>
            <TouchableOpacity onPress={handleSupport}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>About</Text>
              <Text style={styles.settingDescription}>App information and version</Text>
            </View>
            <TouchableOpacity onPress={handleAbout}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear Data</Text>
              <Text style={styles.settingDescription}>Delete all saved prompts</Text>
            </View>
            <TouchableOpacity onPress={handleClearData}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AI Prompt Generator v1.0.0</Text>
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
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.7,
  },
});