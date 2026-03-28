import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  Pressable,
  Animated
} from 'react-native';
import { 
  Search, 
  Filter, 
  X, 
  SortAsc,
  SortDesc
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Button from '@/components/Button';
import { SearchFilters } from '@/hooks/useAdvancedSearch';
import { PromptCategory } from '@/types/prompt';

interface AdvancedSearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  filters: SearchFilters;
  suggestions?: string[];
  placeholder?: string;
  testID?: string;
}

const categories: { key: PromptCategory; label: string }[] = [
  { key: 'writing', label: 'Writing' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'development', label: 'Development' },
  { key: 'design', label: 'Design' },
  { key: 'business', label: 'Business' },
  { key: 'education', label: 'Education' },
  { key: 'personal', label: 'Personal' },
];

const sortOptions = [
  { key: 'relevance' as const, label: 'Relevance' },
  { key: 'title' as const, label: 'Title' },
  { key: 'createdAt' as const, label: 'Created Date' },
  { key: 'updatedAt' as const, label: 'Updated Date' },
];

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  onFiltersChange,
  filters,
  suggestions = [],
  placeholder = 'Search prompts...',
  testID
}) => {
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(filters.query);
  const [newTag, setNewTag] = useState<string>('');
  
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setInputValue(filters.query);
  }, [filters.query]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSuggestions ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSuggestions, fadeAnim]);

  const handleSearchSubmit = () => {
    onSearch(inputValue);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setShowSuggestions(text.length > 0 && suggestions.length > 0);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      onSearch(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleCategoryToggle = (category: PromptCategory) => {
    onFiltersChange({
      category: filters.category === category ? null : category
    });
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      onFiltersChange({
        tags: [...filters.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onFiltersChange({
      tags: filters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      sortBy,
      sortOrder: newSortOrder
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: null,
      tags: [],
      favoritesOnly: false,
      dateRange: { start: null, end: null },
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      minLength: 0,
      maxLength: Infinity,
    });
    setInputValue('');
    onSearch('');
  };

  const hasActiveFilters = filters.category || 
                          filters.tags.length > 0 || 
                          filters.favoritesOnly ||
                          filters.dateRange.start ||
                          filters.dateRange.end ||
                          filters.minLength > 0 ||
                          filters.maxLength < Infinity;

  const styles = StyleSheet.create({
    container: {
      marginBottom: layout.spacing.md,
    },
    searchContainer: {
      position: 'relative',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: layout.spacing.md,
      minHeight: 48,
    },
    searchInputFocused: {
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    searchIcon: {
      marginRight: layout.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      paddingVertical: layout.spacing.sm,
    },
    clearButton: {
      padding: layout.spacing.xs,
      marginLeft: layout.spacing.sm,
    },
    filterButton: {
      padding: layout.spacing.xs,
      marginLeft: layout.spacing.sm,
      borderRadius: layout.borderRadius.sm,
    },
    filterButtonActive: {
      backgroundColor: theme.primary + '20',
    },
    suggestionsContainer: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      borderTopWidth: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      maxHeight: 200,
      zIndex: 1000,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    suggestionItem: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    suggestionText: {
      fontSize: 14,
      color: theme.text,
    },
    filtersModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    filtersContainer: {
      backgroundColor: theme.background,
      borderTopLeftRadius: layout.borderRadius.xl,
      borderTopRightRadius: layout.borderRadius.xl,
      maxHeight: '80%',
    },
    filtersHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: layout.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filtersTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
    },
    filtersContent: {
      padding: layout.spacing.lg,
    },
    filterSection: {
      marginBottom: layout.spacing.xl,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.round,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    categoryChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: theme.text,
    },
    categoryChipTextActive: {
      color: theme.card,
    },
    tagsContainer: {
      marginBottom: layout.spacing.md,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    tagInput: {
      flex: 1,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 14,
      color: theme.text,
      marginRight: layout.spacing.sm,
    },
    addTagButton: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      backgroundColor: theme.primary,
      borderRadius: layout.borderRadius.md,
    },
    addTagButtonText: {
      color: theme.card,
      fontSize: 14,
      fontWeight: '500' as const,
    },
    tagsDisplay: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accent1 + '20',
      borderRadius: layout.borderRadius.round,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.xs,
    },
    tagChipText: {
      fontSize: 12,
      color: theme.accent1,
      marginRight: layout.spacing.xs,
    },
    sortContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    sortOptionActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    sortOptionText: {
      fontSize: 14,
      color: theme.text,
      marginRight: layout.spacing.xs,
    },
    sortOptionTextActive: {
      color: theme.card,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: layout.spacing.sm,
    },
    toggleLabel: {
      fontSize: 16,
      color: theme.text,
    },
    toggleButton: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.border,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleButtonActive: {
      backgroundColor: theme.primary,
    },
    toggleIndicator: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: theme.card,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleIndicatorActive: {
      alignSelf: 'flex-end',
    },
    filtersFooter: {
      flexDirection: 'row',
      padding: layout.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: layout.spacing.md,
    },
    clearFiltersButton: {
      flex: 1,
    },
    applyFiltersButton: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          showSuggestions && styles.searchInputFocused
        ]}>
          <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={inputValue}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => setShowSuggestions(inputValue.length > 0 && suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            testID="search-input"
          />
          
          {inputValue.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setInputValue('');
                onSearch('');
                setShowSuggestions(false);
              }}
              testID="clear-search-button"
            >
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive
            ]}
            onPress={() => setShowFilters(true)}
            testID="filters-button"
          >
            <Filter size={20} color={hasActiveFilters ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <Animated.View 
            style={[styles.suggestionsContainer, { opacity: fadeAnim }]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                  testID={`suggestion-${index}`}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filtersModal}>
          <Pressable 
            style={{ flex: 1 }} 
            onPress={() => setShowFilters(false)} 
          />
          
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Search Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContent} showsVerticalScrollIndicator={false}>
              {/* Categories */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryChip,
                        filters.category === category.key && styles.categoryChipActive
                      ]}
                      onPress={() => handleCategoryToggle(category.key)}
                      testID={`category-${category.key}`}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        filters.category === category.key && styles.categoryChipTextActive
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tagInputContainer}>
                    <TextInput
                      style={styles.tagInput}
                      value={newTag}
                      onChangeText={setNewTag}
                      placeholder="Add tag filter..."
                      placeholderTextColor={theme.textSecondary}
                      onSubmitEditing={handleTagAdd}
                      testID="tag-filter-input"
                    />
                    <TouchableOpacity
                      style={styles.addTagButton}
                      onPress={handleTagAdd}
                      testID="add-tag-filter-button"
                    >
                      <Text style={styles.addTagButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.tagsDisplay}>
                    {filters.tags.map((tag, index) => (
                      <View key={index} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{tag}</Text>
                        <TouchableOpacity onPress={() => handleTagRemove(tag)}>
                          <X size={12} color={theme.accent1} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Sort Options */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.sortContainer}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.sortOption,
                        filters.sortBy === option.key && styles.sortOptionActive
                      ]}
                      onPress={() => handleSortChange(option.key)}
                      testID={`sort-${option.key}`}
                    >
                      <Text style={[
                        styles.sortOptionText,
                        filters.sortBy === option.key && styles.sortOptionTextActive
                      ]}>
                        {option.label}
                      </Text>
                      {filters.sortBy === option.key && (
                        filters.sortOrder === 'asc' ? 
                          <SortAsc size={16} color={theme.card} /> :
                          <SortDesc size={16} color={theme.card} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Favorites Toggle */}
              <View style={styles.filterSection}>
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Favorites Only</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      filters.favoritesOnly && styles.toggleButtonActive
                    ]}
                    onPress={() => onFiltersChange({ favoritesOnly: !filters.favoritesOnly })}
                    testID="favorites-toggle"
                  >
                    <View style={[
                      styles.toggleIndicator,
                      filters.favoritesOnly && styles.toggleIndicatorActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.filtersFooter}>
              <Button
                title="Clear All"
                onPress={clearAllFilters}
                variant="secondary"
                style={styles.clearFiltersButton}
                testID="clear-all-filters-button"
              />
              <Button
                title="Apply Filters"
                onPress={() => setShowFilters(false)}
                style={styles.applyFiltersButton}
                testID="apply-filters-button"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdvancedSearchBar;