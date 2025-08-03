import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const usageAnalyticsSchema = z.object({
  timeframe: z.enum(['day', 'week', 'month', 'year']).default('week'),
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']).optional(),
});

export const usageAnalyticsProcedure = protectedProcedure
  .input(usageAnalyticsSchema)
  .query(async ({ input }) => {
    // Mock analytics data
    const generateMockData = (days: number) => {
      const data = [];
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          prompts_created: Math.floor(Math.random() * 20) + 5,
          prompts_used: Math.floor(Math.random() * 50) + 10,
          templates_used: Math.floor(Math.random() * 15) + 3,
          ai_optimizations: Math.floor(Math.random() * 10) + 2,
        });
      }
      
      return data;
    };

    const timeframeDays = {
      day: 1,
      week: 7,
      month: 30,
      year: 365,
    };

    const dailyData = generateMockData(timeframeDays[input.timeframe]);
    
    // Calculate totals
    const totals = dailyData.reduce(
      (acc, day) => ({
        prompts_created: acc.prompts_created + day.prompts_created,
        prompts_used: acc.prompts_used + day.prompts_used,
        templates_used: acc.templates_used + day.templates_used,
        ai_optimizations: acc.ai_optimizations + day.ai_optimizations,
      }),
      { prompts_created: 0, prompts_used: 0, templates_used: 0, ai_optimizations: 0 }
    );

    // Mock category breakdown
    const categoryBreakdown = [
      { category: 'writing', count: 45, percentage: 30 },
      { category: 'marketing', count: 38, percentage: 25 },
      { category: 'business', count: 30, percentage: 20 },
      { category: 'development', count: 23, percentage: 15 },
      { category: 'design', count: 15, percentage: 10 },
    ];

    // Mock popular templates
    const popularTemplates = [
      { id: 'template-1', title: 'Blog Post Writer', uses: 156 },
      { id: 'template-2', title: 'Product Description', uses: 134 },
      { id: 'template-3', title: 'Email Campaign', uses: 98 },
      { id: 'template-4', title: 'Social Media Post', uses: 87 },
      { id: 'template-5', title: 'Code Documentation', uses: 76 },
    ];

    return {
      timeframe: input.timeframe,
      dailyData,
      totals,
      categoryBreakdown: input.category 
        ? categoryBreakdown.filter(item => item.category === input.category)
        : categoryBreakdown,
      popularTemplates,
      insights: [
        'Your prompt creation has increased 23% this week',
        'Marketing prompts are your most used category',
        'AI optimization usage is trending upward',
        'Blog Post Writer is your top performing template',
      ],
    };
  });