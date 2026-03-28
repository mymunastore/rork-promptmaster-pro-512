import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const optimizePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']),
  optimizationType: z.enum(['clarity', 'specificity', 'creativity', 'performance']).default('performance'),
});

export const optimizePromptProcedure = protectedProcedure
  .input(optimizePromptSchema)
  .mutation(async ({ input }) => {
    try {
      // Call AI optimization service
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert prompt engineer. Optimize the given prompt for ${input.optimizationType}. 
              
              Guidelines:
              - For clarity: Make the prompt clearer and more understandable
              - For specificity: Add specific details and constraints
              - For creativity: Enhance creative elements and inspiration
              - For performance: Optimize for better AI model performance
              
              Return only the optimized prompt without explanations.`
            },
            {
              role: 'user',
              content: `Category: ${input.category}\nOptimization Type: ${input.optimizationType}\n\nOriginal Prompt:\n${input.prompt}`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize prompt');
      }

      const data = await response.json();
      
      return {
        originalPrompt: input.prompt,
        optimizedPrompt: data.completion.trim(),
        optimizationType: input.optimizationType,
        improvements: [
          'Enhanced clarity and structure',
          'Added specific instructions',
          'Improved context setting',
          'Better output formatting guidance'
        ],
        score: Math.floor(Math.random() * 20) + 80, // Mock score 80-100
      };
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      throw new Error('Failed to optimize prompt');
    }
  });