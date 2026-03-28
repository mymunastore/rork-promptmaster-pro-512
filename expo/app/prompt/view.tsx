import React from 'react';
import { StyleSheet, View, Text, ScrollView, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '@/constants/colors';
import layout from '@/constants/layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { usePromptStore } from '@/hooks/usePromptStore';

export default function PromptViewScreen() {
  const router = useRouter();
  const { promptId } = useLocalSearchParams<{ promptId: string }>();
  const { getPromptById, toggleFavorite, deletePrompt } = usePromptStore();

  const prompt = getPromptById(promptId);

  if (!prompt) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Prompt not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          style={styles.button}
        />
      </View>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: '/prompt/editor',
      params: { promptId }
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${prompt.title}\n\n${prompt.content}`,
      });
    } catch (error) {
      console.error('Error sharing prompt:', error);
      Alert.alert('Error', 'Failed to share prompt');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Prompt',
      'Are you sure you want to delete this prompt? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePrompt(promptId);
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleFavorite = () => {
    toggleFavorite(promptId);
  };

  const formattedDate = new Date(prompt.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container} testID="prompt-view-screen">
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{prompt.title}</Text>
          <Text style={styles.date}>Last updated: {formattedDate}</Text>
        </View>

        <View style={styles.categoryContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{prompt.category}</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {prompt.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.contentCard}>
          <Text style={styles.content}>{prompt.content}</Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Favorite"
          onPress={handleToggleFavorite}
          variant="outline"
          style={styles.iconButton}
          testID="favorite-button"
        />
        <Button
          title="Edit"
          onPress={handleEdit}
          variant="outline"
          style={styles.iconButton}
          testID="edit-button"
        />
        <Button
          title="Share"
          onPress={handleShare}
          variant="outline"
          style={styles.iconButton}
          testID="share-button"
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="outline"
          style={styles.iconButton}
          testID="delete-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: layout.spacing.lg,
    paddingBottom: 100, // Extra padding for footer
  },
  header: {
    marginBottom: layout.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryContainer: {
    marginBottom: layout.spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.round,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: layout.spacing.md,
  },
  tag: {
    backgroundColor: colors.card,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.round,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    color: colors.text,
    fontSize: 14,
  },
  contentCard: {
    padding: layout.spacing.lg,
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: layout.spacing.md,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: layout.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
  },
  button: {
    alignSelf: 'center',
    minWidth: 150,
  },
});