import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Star, Grid3X3, List } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import TemplateCard from '@/components/TemplateCard';
import EnhancedTemplateCard from '@/components/EnhancedTemplateCard';
import CategorySelector from '@/components/CategorySelector';
import EmptyState from '@/components/EmptyState';
import { PromptCategory, PromptTemplate } from '@/types/prompt';
import templates from '@/mocks/templates';
import { trpc } from '@/lib/trpc';

export default function TemplatesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [showFeatured, setShowFeatured] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Use tRPC to fetch templates
  const templatesQuery = trpc.templates.list.useQuery({
    category: selectedCategory || undefined,
    featured: showFeatured || undefined,
    limit: 50,
  });

  const allTemplates = templatesQuery.data?.templates || templates;
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplatePress = (template: PromptTemplate) => {
    router.push({
      pathname: '/prompt/editor',
      params: { templateId: template.id }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchContainer: {
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
    },
    searchIcon: {
      marginRight: layout.spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: 44,
      color: theme.text,
      fontSize: 16,
    },
    filtersContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filtersLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filtersRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    filterButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.backgroundLight,
      marginRight: layout.spacing.xs,
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: layout.spacing.xl,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    gridContainer: {
      paddingHorizontal: layout.spacing.md,
    },
    listContainer: {
      paddingHorizontal: layout.spacing.md,
    },
    gridItem: {
      width: '48%',
      marginBottom: layout.spacing.md,
    },
    templateCardContainer: {
      paddingHorizontal: layout.spacing.md,
    },
    listContent: {
      paddingBottom: layout.spacing.xxl,
    },
  });

  return (
    <View style={styles.container} testID="templates-screen">
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="search-input"
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filtersLeft}>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Filters:</Text>
        </View>
        <View style={styles.filtersRight}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFeatured && styles.filterButtonActive
            ]}
            onPress={() => setShowFeatured(!showFeatured)}
            testID="featured-filter-button"
          >
            <Star size={20} color={showFeatured ? theme.card : theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              viewMode === 'grid' && styles.filterButtonActive
            ]}
            onPress={() => setViewMode('grid')}
            testID="grid-view-button"
          >
            <Grid3X3 size={20} color={viewMode === 'grid' ? theme.card : theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              viewMode === 'list' && styles.filterButtonActive
            ]}
            onPress={() => setViewMode('list')}
            testID="list-view-button"
          >
            <List size={20} color={viewMode === 'list' ? theme.card : theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        testID="category-selector"
      />

      {templatesQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Try adjusting your search or category filters"
          icon={<Filter size={48} color={theme.textSecondary} />}
          testID="empty-state"
        />
      ) : (
        <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when changing view mode
          renderItem={({ item }) => (
            <View style={[
              styles.templateCardContainer,
              viewMode === 'grid' && styles.gridItem
            ]}>
              <EnhancedTemplateCard
                template={item}
                onPress={handleTemplatePress}
                testID={`template-card-${item.id}`}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="templates-list"
        />
      )}
    </View>
  );
}