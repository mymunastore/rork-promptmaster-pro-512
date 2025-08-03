import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const updatePromptSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']).optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

export const updatePromptProcedure = protectedProcedure
  .input(updatePromptSchema)
  .mutation(async ({ input }) => {
    const { id, ...updates } = input;
    
    // Mock update - in a real app, this would update the database
    const updatedPrompt = {
      id,
      title: 'Updated Prompt',
      content: 'Updated content',
      category: 'writing' as const,
      tags: ['updated'],
      isFavorite: false,
      isPublic: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
      userId: 'user-1',
      analytics: {
        views: 0,
        uses: 0,
        shares: 0,
        rating: 0,
        ratingCount: 0,
      },
      ...updates,
    };

    console.log('Updated prompt:', updatedPrompt);
    return updatedPrompt;
  });