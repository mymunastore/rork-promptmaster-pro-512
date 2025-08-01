import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import TemplateCard from '@/components/TemplateCard';
import CategorySelector from '@/components/CategorySelector';
import EmptyState from '@/components/EmptyState';

import { PromptCategory, PromptTemplate } from '@/types/prompt';
import templates from '@/mocks/templates';

export default function TemplatesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);

  const filteredTemplates = templates.filter(template => {
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

      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        testID="category-selector"
      />

      {filteredTemplates.length === 0 ? (
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
          renderItem={({ item }) => (
            <View style={styles.templateCardContainer}>
              <TemplateCard
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