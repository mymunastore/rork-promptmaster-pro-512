import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { SavedPrompt, PromptCategory } from '@/types/prompt';

// Storage keys
const SAVED_PROMPTS_KEY = 'ai_prompt_generator_saved_prompts';

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create the context hook
export const [PromptStoreProvider, usePromptStore] = createContextHook(() => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Query to fetch saved prompts from AsyncStorage
  const savedPromptsQuery = useQuery({
    queryKey: ['savedPrompts'],
    queryFn: async () => {
      try {
        const storedPrompts = await AsyncStorage.getItem(SAVED_PROMPTS_KEY);
        console.log('Fetched stored prompts:', storedPrompts ? JSON.parse(storedPrompts).length : 0);
        return storedPrompts ? JSON.parse(storedPrompts) as SavedPrompt[] : [];
      } catch (error) {
        console.error('Error fetching saved prompts:', error);
        return [];
      }
    },
  });

  // Mutation to save prompts to AsyncStorage
  const savePromptsMutation = useMutation({
    mutationFn: async (prompts: SavedPrompt[]) => {
      try {
        await AsyncStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(prompts));
        console.log('Saved prompts to storage:', prompts.length);
        return prompts;
      } catch (error) {
        console.error('Error saving prompts:', error);
        throw error;
      }
    },
  });

  // Initialize prompts from query
  useEffect(() => {
    if (savedPromptsQuery.data && !isInitialized) {
      setSavedPrompts(savedPromptsQuery.data);
      setIsInitialized(true);
    }
  }, [savedPromptsQuery.data, isInitialized]);

  // Save a new prompt
  const savePrompt = (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPrompt: SavedPrompt = {
      ...prompt,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedPrompts = [...savedPrompts, newPrompt];
    setSavedPrompts(updatedPrompts);
    savePromptsMutation.mutate(updatedPrompts);
    return newPrompt;
  };

  // Update an existing prompt
  const updatePrompt = (id: string, updates: Partial<Omit<SavedPrompt, 'id' | 'createdAt'>>) => {
    const updatedPrompts = savedPrompts.map(prompt => {
      if (prompt.id === id) {
        return {
          ...prompt,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return prompt;
    });

    setSavedPrompts(updatedPrompts);
    savePromptsMutation.mutate(updatedPrompts);
  };

  // Delete a prompt
  const deletePrompt = (id: string) => {
    const updatedPrompts = savedPrompts.filter(prompt => prompt.id !== id);
    setSavedPrompts(updatedPrompts);
    savePromptsMutation.mutate(updatedPrompts);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const updatedPrompts = savedPrompts.map(prompt => {
      if (prompt.id === id) {
        return {
          ...prompt,
          isFavorite: !prompt.isFavorite,
          updatedAt: new Date().toISOString(),
        };
      }
      return prompt;
    });

    setSavedPrompts(updatedPrompts);
    savePromptsMutation.mutate(updatedPrompts);
  };

  // Get a prompt by ID
  const getPromptById = (id: string) => {
    return savedPrompts.find(prompt => prompt.id === id);
  };

  return {
    savedPrompts,
    isLoading: savedPromptsQuery.isLoading,
    error: savedPromptsQuery.error,
    savePrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    getPromptById,
  };
});

// Custom hook for filtered prompts
export const useFilteredPrompts = (
  search: string = '',
  category: PromptCategory | null = null,
  favoritesOnly: boolean = false
) => {
  const { savedPrompts, isLoading } = usePromptStore();

  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesSearch = search === '' || 
      prompt.title.toLowerCase().includes(search.toLowerCase()) || 
      prompt.content.toLowerCase().includes(search.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = category === null || prompt.category === category;
    
    const matchesFavorite = !favoritesOnly || prompt.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return {
    prompts: filteredPrompts,
    isLoading,
    isEmpty: filteredPrompts.length === 0,
  };
};