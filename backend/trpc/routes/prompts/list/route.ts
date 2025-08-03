import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const listPromptsSchema = z.object({
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']).optional(),
  search: z.string().optional(),
  favoritesOnly: z.boolean().default(false),
  isPublic: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'rating']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const listPromptsProcedure = protectedProcedure
  .input(listPromptsSchema)
  .query(async ({ input }: { input: z.infer<typeof listPromptsSchema> }) => {
    // Mock data - in a real app, this would query a database
    const mockPrompts = [
      {
        id: '1',
        title: 'Creative Writing Assistant',
        content: 'You are a creative writing assistant. Help me write engaging stories with vivid descriptions and compelling characters.',
        category: 'writing' as const,
        tags: ['creative', 'storytelling', 'fiction'],
        isFavorite: true,
        isPublic: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        userId: 'user-1',
        analytics: {
          views: 150,
          uses: 45,
          shares: 12,
          rating: 4.8,
          ratingCount: 25,
        },
      },
      {
        id: '2',
        title: 'Marketing Copy Generator',
        content: 'Create compelling marketing copy that converts. Focus on benefits, use emotional triggers, and include clear calls-to-action.',
        category: 'marketing' as const,
        tags: ['copywriting', 'conversion', 'sales'],
        isFavorite: false,
        isPublic: true,
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        userId: 'user-1',
        analytics: {
          views: 89,
          uses: 23,
          shares: 8,
          rating: 4.5,
          ratingCount: 18,
        },
      },
    ];

    // Apply filters
    let filteredPrompts = mockPrompts.filter(prompt => {
      if (input.category && prompt.category !== input.category) return false;
      if (input.favoritesOnly && !prompt.isFavorite) return false;
      if (input.isPublic !== undefined && prompt.isPublic !== input.isPublic) return false;
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(searchLower) ||
          prompt.content.toLowerCase().includes(searchLower) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });

    // Apply sorting
    filteredPrompts.sort((a, b) => {
      const aValue = a[input.sortBy as keyof typeof a];
      const bValue = b[input.sortBy as keyof typeof b];
      
      if (input.sortBy === 'rating') {
        const aRating = a.analytics.rating;
        const bRating = b.analytics.rating;
        return input.sortOrder === 'desc' ? bRating - aRating : aRating - bRating;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return input.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      return 0;
    });

    // Apply pagination
    const paginatedPrompts = filteredPrompts.slice(input.offset, input.offset + input.limit);

    return {
      prompts: paginatedPrompts,
      total: filteredPrompts.length,
      hasMore: input.offset + input.limit < filteredPrompts.length,
    };
  });