import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { 
  Edit3,
  Camera,
  Check,
  X
} from 'lucide-react-native';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { usePromptStore } from '@/hooks/usePromptStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  joinDate: string;
  avatar?: string;
  avatarColor?: string;
  preferences?: {
    favoriteCategories: string[];
    defaultTone: string;
    autoSave: boolean;
  };
}

const PROFILE_STORAGE_KEY = 'user_profile';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { savedPrompts } = usePromptStore();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'AI Enthusiast',
    email: 'user@example.com',
    bio: 'Creating amazing prompts for AI tools',
    joinDate: new Date().toISOString().split('T')[0],
    avatarColor: theme.primaryLight,
    preferences: {
      favoriteCategories: [],
      defaultTone: 'professional',
      autoSave: true,
    },
  });
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setEditedProfile(parsedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const saveProfile = async () => {
    if (!editedProfile.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!editedProfile.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(editedProfile));
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
      console.log('Profile saved:', editedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  const handleAvatarPress = () => {
    Alert.alert(
      'Profile Picture',
      'Choose how you\'d like to update your profile picture:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose Color',
          onPress: () => {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            const updatedProfile = { ...editedProfile, avatarColor: randomColor };
            setEditedProfile(updatedProfile);
            
            if (!isEditing) {
              setProfile(updatedProfile);
              AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
            }
            
            Alert.alert('Avatar Updated!', 'Your avatar color has been changed.');
          }
        },
        {
          text: 'Upload Photo',
          onPress: () => {
            Alert.alert(
              'Coming Soon',
              'Photo upload feature will be available in the next update! For now, you can customize your avatar color.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: layout.spacing.lg,
    },
    header: {
      alignItems: 'center' as const,
      marginBottom: layout.spacing.xl,
    },
    avatarContainer: {
      position: 'relative' as const,
      marginBottom: layout.spacing.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: (isEditing ? editedProfile.avatarColor : profile.avatarColor) || theme.primaryLight,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: layout.spacing.sm,
      borderWidth: 3,
      borderColor: theme.background,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '600' as const,
      color: theme.background,
    },
    cameraButton: {
      position: 'absolute' as const,
      bottom: layout.spacing.sm,
      right: -8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 2,
      borderColor: theme.background,
    },
    nameText: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: theme.text,
      textAlign: 'center' as const,
      marginBottom: layout.spacing.xs,
    },
    emailText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center' as const,
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
      padding: layout.spacing.lg,
      backgroundColor: theme.card,
    },
    fieldContainer: {
      marginBottom: layout.spacing.lg,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    fieldValue: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
    },
    input: {
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      minHeight: 44,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top' as const,
    },
    statsContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
    },
    statItem: {
      alignItems: 'center' as const,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: theme.primary,
      marginBottom: layout.spacing.xs,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center' as const,
    },
    editButtons: {
      flexDirection: 'row' as const,
      gap: layout.spacing.md,
      marginTop: layout.spacing.lg,
    },
    editButton: {
      flex: 1,
    },
    iconContainer: {
      width: 24,
      height: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: layout.spacing.sm,
    },
  });
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            !isEditing ? (
              <Pressable
                onPress={() => setIsEditing(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: layout.spacing.sm,
                })}
                testID="edit-profile-button"
              >
                <Edit3 size={20} color={theme.primary} />
              </Pressable>
            ) : null
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="profile-screen"
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Pressable 
              style={styles.avatar}
              onPress={handleAvatarPress}
              testID="avatar-button"
            >
              <Text style={styles.avatarText}>
                {getInitials(isEditing ? editedProfile.name : profile.name)}
              </Text>
            </Pressable>
            <Pressable 
              style={styles.cameraButton}
              onPress={handleAvatarPress}
              testID="camera-button"
            >
              <Camera size={16} color={theme.background} />
            </Pressable>
          </View>
          
          {!isEditing && (
            <>
              <Text style={styles.nameText}>{profile.name}</Text>
              <Text style={styles.emailText}>{profile.email}</Text>
            </>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Card style={styles.card}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.textSecondary}
                  testID="name-input"
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.name}</Text>
              )}
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  testID="email-input"
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.email}</Text>
              )}
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Bio</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                  testID="bio-input"
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.bio || 'No bio added yet'}</Text>
              )}
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Member Since</Text>
              <Text style={styles.fieldValue}>{formatJoinDate(profile.joinDate)}</Text>
            </View>
            
            {isEditing && (
              <View style={styles.editButtons}>
                <Button
                  title="Cancel"
                  onPress={cancelEdit}
                  variant="secondary"
                  style={styles.editButton}
                  icon={<X size={16} color={theme.textSecondary} />}
                  testID="cancel-edit-button"
                />
                <Button
                  title="Save"
                  onPress={saveProfile}
                  loading={isLoading}
                  style={styles.editButton}
                  icon={<Check size={16} color={theme.background} />}
                  testID="save-profile-button"
                />
              </View>
            )}
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <Card style={styles.card}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{savedPrompts.length}</Text>
                <Text style={styles.statLabel}>Saved{'\n'}Prompts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {savedPrompts.filter(p => p.isFavorite).length}
                </Text>
                <Text style={styles.statLabel}>Favorite{'\n'}Prompts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.max(1, Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)))}
                </Text>
                <Text style={styles.statLabel}>Days{'\n'}Active</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}