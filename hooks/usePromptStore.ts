import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { SavedPrompt, PromptCategory } from '@/types/prompt';
import { trpc } from '@/lib/trpc';

// Storage keys
const SAVED_PROMPTS_KEY = 'ai_prompt_generator_saved_prompts';
const SYNC_STATUS_KEY = 'ai_prompt_generator_sync_status';

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create the context hook
export const [PromptStoreProvider, usePromptStore] = createContextHook(() => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const queryClient = useQueryClient();

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

  // tRPC queries for server sync
  const serverPromptsQuery = trpc.prompts.list.useQuery(
    { limit: 100 },
    { enabled: syncEnabled }
  );

  // Mutations
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

  const createPromptMutation = trpc.prompts.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const updatePromptMutation = trpc.prompts.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const deletePromptMutation = trpc.prompts.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  // Initialize prompts from query
  useEffect(() => {
    if (savedPromptsQuery.data && !isInitialized) {
      setSavedPrompts(savedPromptsQuery.data);
      setIsInitialized(true);
    }
  }, [savedPromptsQuery.data, isInitialized]);

  // Sync with server when enabled
  useEffect(() => {
    if (syncEnabled && serverPromptsQuery.data) {
      // Merge server prompts with local prompts
      const serverPrompts = serverPromptsQuery.data.prompts.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category,
        tags: p.tags,
        isFavorite: p.isFavorite,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      
      // Simple merge strategy - server takes precedence
      setSavedPrompts(serverPrompts);
    }
  }, [syncEnabled, serverPromptsQuery.data]);

  // Save a new prompt
  const savePrompt = async (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => {
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

    // Sync to server if enabled
    if (syncEnabled) {
      try {
        await createPromptMutation.mutateAsync({
          title: newPrompt.title,
          content: newPrompt.content,
          category: newPrompt.category,
          tags: newPrompt.tags,
          isFavorite: newPrompt.isFavorite,
        });
      } catch (error) {
        console.error('Failed to sync prompt to server:', error);
      }
    }

    return newPrompt;
  };

  // Update an existing prompt
  const updatePrompt = async (id: string, updates: Partial<Omit<SavedPrompt, 'id' | 'createdAt'>>) => {
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

    // Sync to server if enabled
    if (syncEnabled) {
      try {
        await updatePromptMutation.mutateAsync({ id, ...updates });
      } catch (error) {
        console.error('Failed to sync prompt update to server:', error);
      }
    }
  };

  // Delete a prompt
  const deletePrompt = async (id: string) => {
    const updatedPrompts = savedPrompts.filter(prompt => prompt.id !== id);
    setSavedPrompts(updatedPrompts);
    savePromptsMutation.mutate(updatedPrompts);

    // Sync to server if enabled
    if (syncEnabled) {
      try {
        await deletePromptMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Failed to sync prompt deletion to server:', error);
      }
    }
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

    // Sync to server if enabled
    if (syncEnabled) {
      const prompt = savedPrompts.find(p => p.id === id);
      if (prompt) {
        updatePromptMutation.mutate({ 
          id, 
          isFavorite: !prompt.isFavorite 
        });
      }
    }
  };

  // Get a prompt by ID
  const getPromptById = (id: string) => {
    return savedPrompts.find(prompt => prompt.id === id);
  };

  // Enable/disable server sync
  const toggleSync = async (enabled: boolean) => {
    setSyncEnabled(enabled);
    await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(enabled));
  };

  // Load sync status
  useEffect(() => {
    const loadSyncStatus = async () => {
      try {
        const stored = await AsyncStorage.getItem(SYNC_STATUS_KEY);
        if (stored) {
          setSyncEnabled(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading sync status:', error);
      }
    };
    loadSyncStatus();
  }, []);

  return {
    savedPrompts,
    isLoading: savedPromptsQuery.isLoading || (syncEnabled && serverPromptsQuery.isLoading),
    error: savedPromptsQuery.error || serverPromptsQuery.error,
    syncEnabled,
    savePrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    getPromptById,
    toggleSync,
    // Server sync status
    isSyncing: createPromptMutation.isPending || updatePromptMutation.isPending || deletePromptMutation.isPending,
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