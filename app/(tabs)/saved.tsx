import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Heart, BookmarkX } from 'lucide-react-native';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import SavedPromptCard from '@/components/SavedPromptCard';
import CategorySelector from '@/components/CategorySelector';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { PromptCategory, SavedPrompt } from '@/types/prompt';
import { usePromptStore, useFilteredPrompts } from '@/hooks/usePromptStore';

export default function SavedPromptsScreen() {
  const router = useRouter();
  const { toggleFavorite } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  const { prompts, isLoading } = useFilteredPrompts(searchQuery, selectedCategory, favoritesOnly);

  const handlePromptPress = (prompt: SavedPrompt) => {
    router.push({
      pathname: '/prompt/editor',
      params: { promptId: prompt.id }
    });
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    toggleFavorite(id);
  };

  const handleShare = async (prompt: SavedPrompt) => {
    try {
      await Share.share({
        message: `${prompt.title}\n\n${prompt.content}`,
      });
    } catch (error) {
      console.error('Error sharing prompt:', error);
      Alert.alert('Error', 'Failed to share prompt');
    }
  };

  const navigateToNewPrompt = () => {
    router.push('/prompt/editor');
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <EmptyState
          title="Loading your prompts..."
          description="Please wait while we fetch your saved prompts"
          testID="loading-state"
        />
      );
    }

    if (searchQuery || selectedCategory || favoritesOnly) {
      return (
        <EmptyState
          title="No matching prompts"
          description="Try adjusting your search or filters"
          icon={<Filter size={48} color={colors.textSecondary} />}
          testID="no-results-state"
        />
      );
    }

    return (
      <EmptyState
        title="No saved prompts yet"
        description="Create your first prompt to get started"
        icon={<BookmarkX size={48} color={colors.textSecondary} />}
        actionLabel="Create New Prompt"
        onAction={navigateToNewPrompt}
        testID="empty-state"
      />
    );
  };

  return (
    <View style={styles.container} testID="saved-prompts-screen">
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved prompts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="search-input"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.favoriteFilter, favoritesOnly && styles.favoriteFilterActive]}
          onPress={() => setFavoritesOnly(!favoritesOnly)}
          testID="favorites-filter"
        >
          <Heart 
            size={20} 
            color={favoritesOnly ? colors.card : colors.error}
            fill={favoritesOnly ? colors.card : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        testID="category-selector"
      />

      {prompts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={prompts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.promptCardContainer}>
              <SavedPromptCard
                prompt={item}
                onPress={handlePromptPress}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
                testID={`prompt-card-${item.id}`}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="prompts-list"
        />
      )}

      <View style={styles.fabContainer}>
        <Button
          title="New Prompt"
          onPress={navigateToNewPrompt}
          variant="primary"
          style={styles.fab}
          testID="new-prompt-button"
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
  searchContainer: {
    padding: layout.spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    marginRight: layout.spacing.sm,
  },
  searchIcon: {
    marginRight: layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontSize: 16,
  },
  favoriteFilter: {
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteFilterActive: {
    backgroundColor: colors.error,
  },
  promptCardContainer: {
    paddingHorizontal: layout.spacing.md,
  },
  listContent: {
    paddingBottom: layout.spacing.xxl,
  },
  fabContainer: {
    position: 'absolute',
    bottom: layout.spacing.lg,
    right: layout.spacing.lg,
  },
  fab: {
    borderRadius: layout.borderRadius.round,
    paddingHorizontal: layout.spacing.lg,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});