import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const analyzePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']),
});

export const analyzePromptProcedure = protectedProcedure
  .input(analyzePromptSchema)
  .query(async ({ input }: { input: z.infer<typeof analyzePromptSchema> }) => {
    // Mock analysis - in a real app, this would use AI to analyze the prompt
    const wordCount = input.prompt.split(/\s+/).length;
    const charCount = input.prompt.length;
    const sentenceCount = input.prompt.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
    
    // Mock complexity analysis
    const complexity = wordCount > 100 ? 'High' : wordCount > 50 ? 'Medium' : 'Low';
    const clarity = charCount > 500 ? 85 : charCount > 200 ? 75 : 65;
    const specificity = input.prompt.includes('specific') || input.prompt.includes('detailed') ? 90 : 70;
    const creativity = input.prompt.includes('creative') || input.prompt.includes('innovative') ? 85 : 60;
    
    // Mock keyword extraction
    const keywords = input.prompt
      .toLowerCase()
      .split(/\W+/)
      .filter((word: string) => word.length > 3)
      .slice(0, 10);
    
    // Mock sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor'];
    
    const positiveCount = positiveWords.filter(word => input.prompt.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => input.prompt.toLowerCase().includes(word)).length;
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Mock readability score (Flesch Reading Ease approximation)
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence)));
    
    return {
      metrics: {
        wordCount,
        charCount,
        sentenceCount,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        readabilityScore: Math.round(readabilityScore),
      },
      scores: {
        overall: Math.round((clarity + specificity + creativity) / 3),
        clarity,
        specificity,
        creativity,
        complexity,
      },
      keywords,
      sentiment,
      suggestions: [
        wordCount < 20 ? 'Consider adding more detail to your prompt' : null,
        specificity < 80 ? 'Try to be more specific about desired outcomes' : null,
        creativity < 70 ? 'Add creative elements to inspire better responses' : null,
        clarity < 80 ? 'Simplify language for better clarity' : null,
      ].filter(Boolean),
      categoryMatch: input.category,
      estimatedTokens: Math.ceil(wordCount * 1.3), // Rough token estimation
    };
  });