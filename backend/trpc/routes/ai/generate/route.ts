import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const generatePromptSchema = z.object({
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']),
  purpose: z.string().min(1, 'Purpose is required'),
  tone: z.enum(['professional', 'casual', 'creative', 'technical', 'friendly']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  keywords: z.array(z.string()).default([]),
});

export const generatePromptProcedure = protectedProcedure
  .input(generatePromptSchema)
  .mutation(async ({ input }: { input: z.infer<typeof generatePromptSchema> }) => {
    try {
      const keywordsText = input.keywords.length > 0 ? `\nKeywords to include: ${input.keywords.join(', ')}` : '';
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert prompt engineer. Generate a high-quality AI prompt based on the user's requirements.
              
              Guidelines:
              - Create prompts that are clear, specific, and effective
              - Match the requested tone and length
              - Include relevant context and instructions
              - Ensure the prompt will produce useful results
              - Return only the prompt without explanations`
            },
            {
              role: 'user',
              content: `Create a ${input.tone} ${input.length} prompt for ${input.category} category.
              
              Purpose: ${input.purpose}${keywordsText}
              
              Length guidelines:
              - Short: 1-2 sentences
              - Medium: 2-4 sentences
              - Long: 4+ sentences with detailed instructions`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      
      return {
        prompt: data.completion.trim(),
        category: input.category,
        purpose: input.purpose,
        tone: input.tone,
        length: input.length,
        keywords: input.keywords,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw new Error('Failed to generate prompt');
    }
  });