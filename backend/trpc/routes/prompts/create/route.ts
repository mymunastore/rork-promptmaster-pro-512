import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']),
  tags: z.array(z.string()),
  isFavorite: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  templateId: z.string().optional(),
});

export const createPromptProcedure = protectedProcedure
  .input(createPromptSchema)
  .mutation(async ({ input }: { input: z.infer<typeof createPromptSchema> }) => {
    const now = new Date().toISOString();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    const prompt = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
      userId: 'user-1', // In a real app, get from context
      analytics: {
        views: 0,
        uses: 0,
        shares: 0,
        rating: 0,
        ratingCount: 0,
      },
    };

    console.log('Created prompt:', prompt);
    return prompt;
  });