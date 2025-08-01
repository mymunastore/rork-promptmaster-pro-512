import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, Share, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { BookmarkX } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import SavedPromptCard from '@/components/SavedPromptCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import AdvancedSearchBar from '@/components/AdvancedSearchBar';
import { SavedPrompt } from '@/types/prompt';
import { usePromptStore } from '@/hooks/usePromptStore';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

export default function SavedPromptsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { savedPrompts, toggleFavorite } = usePromptStore();
  
  const {
    filters,
    searchResults,
    isSearching,
    updateFilters,
    quickSearch,
    getSearchSuggestions,
    getFilterStats,
    hasActiveFilters
  } = useAdvancedSearch(savedPrompts);
  
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    quickSearch(query);
    if (query.trim()) {
      const newSuggestions = getSearchSuggestions(query, 5);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

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
    if (isSearching) {
      return (
        <EmptyState
          title="Searching..."
          description="Please wait while we search your prompts"
          testID="searching-state"
        />
      );
    }

    if (hasActiveFilters || filters.query.trim()) {
      const stats = getFilterStats();
      return (
        <EmptyState
          title="No matching prompts"
          description={`Found 0 of ${stats.totalPrompts} prompts. Try adjusting your search or filters.`}
          icon={<BookmarkX size={48} color={theme.textSecondary} />}
          testID="no-results-state"
        />
      );
    }

    return (
      <EmptyState
        title="No saved prompts yet"
        description="Create your first prompt to get started"
        icon={<BookmarkX size={48} color={theme.textSecondary} />}
        actionLabel="Create New Prompt"
        onAction={navigateToNewPrompt}
        testID="empty-state"
      />
    );
  };

  const stats = getFilterStats();
  const prompts = searchResults.map(result => result.item);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchContainer: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingHorizontal: layout.spacing.lg,
      paddingTop: layout.spacing.md,
      paddingBottom: layout.spacing.sm,
    },
    statsContainer: {
      paddingTop: layout.spacing.sm,
      alignItems: 'center',
    },
    statsText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    efficiencyText: {
      color: theme.accent3,
      fontWeight: '500' as const,
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
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  return (
    <View style={styles.container} testID="saved-prompts-screen">
      <View style={styles.searchContainer}>
        <AdvancedSearchBar
          onSearch={handleSearch}
          onFiltersChange={updateFilters}
          filters={filters}
          suggestions={suggestions}
          placeholder="Search saved prompts..."
          testID="advanced-search-bar"
        />
        
        {(hasActiveFilters || filters.query.trim()) && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Showing {stats.filteredPrompts} of {stats.totalPrompts} prompts
              {stats.filterEfficiency < 100 && (
                <Text style={styles.efficiencyText}>
                  {' '}({stats.filterEfficiency.toFixed(0)}% match)
                </Text>
              )}
            </Text>
          </View>
        )}
      </View>

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