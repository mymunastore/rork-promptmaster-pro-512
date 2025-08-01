import { useState, useMemo, useCallback } from 'react';
import { SavedPrompt, PromptCategory } from '@/types/prompt';

export interface SearchFilters {
  query: string;
  category: PromptCategory | null;
  tags: string[];
  favoritesOnly: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'relevance';
  sortOrder: 'asc' | 'desc';
  minLength: number;
  maxLength: number;
}

export interface SearchResult {
  item: SavedPrompt;
  score: number;
  matches: {
    title: boolean;
    content: boolean;
    tags: boolean;
  };
}

const defaultFilters: SearchFilters = {
  query: '',
  category: null,
  tags: [],
  favoritesOnly: false,
  dateRange: {
    start: null,
    end: null,
  },
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  minLength: 0,
  maxLength: Infinity,
};

export const useAdvancedSearch = (prompts: SavedPrompt[]) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Calculate relevance score for search results
  const calculateRelevanceScore = useCallback((prompt: SavedPrompt, query: string): SearchResult => {
    if (!query.trim()) {
      return {
        item: prompt,
        score: 1,
        matches: { title: false, content: false, tags: false }
      };
    }

    const queryLower = query.toLowerCase();
    const titleLower = prompt.title.toLowerCase();
    const contentLower = prompt.content.toLowerCase();
    const tagsLower = prompt.tags.map(tag => tag.toLowerCase());

    let score = 0;
    const matches = {
      title: false,
      content: false,
      tags: false,
    };

    // Title matches (highest weight)
    if (titleLower.includes(queryLower)) {
      matches.title = true;
      score += 10;
      
      // Exact title match gets bonus
      if (titleLower === queryLower) {
        score += 20;
      }
      
      // Title starts with query gets bonus
      if (titleLower.startsWith(queryLower)) {
        score += 10;
      }
    }

    // Content matches (medium weight)
    if (contentLower.includes(queryLower)) {
      matches.content = true;
      score += 5;
      
      // Multiple occurrences in content
      const occurrences = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
      score += Math.min(occurrences * 2, 10); // Cap bonus at 10
    }

    // Tag matches (high weight)
    const matchingTags = tagsLower.filter(tag => tag.includes(queryLower));
    if (matchingTags.length > 0) {
      matches.tags = true;
      score += matchingTags.length * 8;
      
      // Exact tag match gets bonus
      if (tagsLower.includes(queryLower)) {
        score += 15;
      }
    }

    // Fuzzy matching for typos (lower weight)
    if (score === 0) {
      const fuzzyScore = calculateFuzzyScore(queryLower, titleLower) + 
                        calculateFuzzyScore(queryLower, contentLower);
      if (fuzzyScore > 0.7) {
        score += fuzzyScore * 3;
      }
    }

    // Boost score for favorites
    if (prompt.isFavorite) {
      score *= 1.2;
    }

    // Boost score for recently updated prompts
    const daysSinceUpdate = (Date.now() - new Date(prompt.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) {
      score *= 1.1;
    }

    return {
      item: prompt,
      score,
      matches,
    };
  }, []);

  // Simple fuzzy matching algorithm
  const calculateFuzzyScore = useCallback((query: string, text: string): number => {
    if (query.length === 0) return 0;
    if (text.length === 0) return 0;

    let matches = 0;
    let queryIndex = 0;

    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        matches++;
        queryIndex++;
      }
    }

    return matches / query.length;
  }, []);

  // Apply all filters and return sorted results
  const searchResults = useMemo((): SearchResult[] => {
    setIsSearching(true);

    let results = prompts.map(prompt => calculateRelevanceScore(prompt, filters.query));

    // Filter by category
    if (filters.category) {
      results = results.filter(result => result.item.category === filters.category);
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      results = results.filter(result => 
        filters.tags.every(tag => 
          result.item.tags.some(itemTag => 
            itemTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Filter by favorites
    if (filters.favoritesOnly) {
      results = results.filter(result => result.item.isFavorite);
    }

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      results = results.filter(result => {
        const itemDate = new Date(result.item.createdAt);
        const start = filters.dateRange.start;
        const end = filters.dateRange.end;
        
        if (start && itemDate < start) return false;
        if (end && itemDate > end) return false;
        
        return true;
      });
    }

    // Filter by content length
    results = results.filter(result => {
      const contentLength = result.item.content.length;
      return contentLength >= filters.minLength && contentLength <= filters.maxLength;
    });

    // Filter out results with zero score if there's a query
    if (filters.query.trim()) {
      results = results.filter(result => result.score > 0);
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'title':
          comparison = a.item.title.localeCompare(b.item.title);
          break;
        case 'createdAt':
          comparison = new Date(a.item.createdAt).getTime() - new Date(b.item.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.item.updatedAt).getTime() - new Date(b.item.updatedAt).getTime();
          break;
        case 'relevance':
        default:
          comparison = b.score - a.score; // Higher score first for relevance
          break;
      }

      if (filters.sortBy !== 'relevance') {
        comparison = filters.sortOrder === 'desc' ? -comparison : comparison;
      }

      return comparison;
    });

    setTimeout(() => setIsSearching(false), 0);
    return results;
  }, [prompts, filters, calculateRelevanceScore]);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Quick search (just query)
  const quickSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
  }, []);

  // Get search suggestions based on existing prompts
  const getSearchSuggestions = useCallback((query: string, limit: number = 5): string[] => {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    // Add matching titles
    prompts.forEach(prompt => {
      if (prompt.title.toLowerCase().includes(queryLower)) {
        suggestions.add(prompt.title);
      }
    });

    // Add matching tags
    prompts.forEach(prompt => {
      prompt.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }, [prompts]);

  // Get filter statistics
  const getFilterStats = useCallback(() => {
    const totalPrompts = prompts.length;
    const filteredPrompts = searchResults.length;
    const categories = new Set(prompts.map(p => p.category));
    const allTags = new Set(prompts.flatMap(p => p.tags));
    const favoriteCount = prompts.filter(p => p.isFavorite).length;

    return {
      totalPrompts,
      filteredPrompts,
      categoriesCount: categories.size,
      tagsCount: allTags.size,
      favoriteCount,
      filterEfficiency: totalPrompts > 0 ? (filteredPrompts / totalPrompts) * 100 : 0,
    };
  }, [prompts, searchResults]);

  return {
    filters,
    searchResults,
    isSearching,
    updateFilter,
    updateFilters,
    resetFilters,
    quickSearch,
    getSearchSuggestions,
    getFilterStats,
    hasActiveFilters: JSON.stringify(filters) !== JSON.stringify(defaultFilters),
  };
};

export default useAdvancedSearch;