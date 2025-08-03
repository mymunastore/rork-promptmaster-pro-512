import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const deletePromptSchema = z.object({
  id: z.string(),
});

export const deletePromptProcedure = protectedProcedure
  .input(deletePromptSchema)
  .mutation(async ({ input }: { input: z.infer<typeof deletePromptSchema> }) => {
    // Mock delete - in a real app, this would delete from database
    console.log('Deleted prompt:', input.id);
    
    return {
      success: true,
      id: input.id,
      deletedAt: new Date().toISOString(),
    };
  });