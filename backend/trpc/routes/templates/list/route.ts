import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const listTemplatesSchema = z.object({
  category: z.enum(['writing', 'marketing', 'development', 'design', 'business', 'education', 'personal']).optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const listTemplatesProcedure = protectedProcedure
  .input(listTemplatesSchema)
  .query(async ({ input }: { input: z.infer<typeof listTemplatesSchema> }) => {
    // Mock templates data
    const mockTemplates = [
      {
        id: 'template-1',
        title: 'Blog Post Writer',
        description: 'Create engaging blog posts with proper structure and SEO optimization',
        template: 'Write a comprehensive blog post about [TOPIC]. Include an engaging introduction, 3-5 main points with examples, and a compelling conclusion. Use a conversational tone and optimize for SEO.',
        category: 'writing' as const,
        tags: ['blog', 'content', 'seo'],
        featured: true,
        difficulty: 'beginner' as const,
        estimatedTime: '5-10 minutes',
        rating: 4.8,
        usageCount: 1250,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'template-2',
        title: 'Product Description Generator',
        description: 'Create compelling product descriptions that convert browsers into buyers',
        template: 'Create a persuasive product description for [PRODUCT NAME]. Highlight key features, benefits, and unique selling points. Use emotional triggers and include a clear call-to-action. Target audience: [TARGET AUDIENCE].',
        category: 'marketing' as const,
        tags: ['ecommerce', 'sales', 'conversion'],
        featured: true,
        difficulty: 'intermediate' as const,
        estimatedTime: '3-5 minutes',
        rating: 4.6,
        usageCount: 890,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
      },
      {
        id: 'template-3',
        title: 'Code Documentation Assistant',
        description: 'Generate clear and comprehensive code documentation',
        template: 'Create detailed documentation for the following code: [CODE]. Include purpose, parameters, return values, usage examples, and any important notes or warnings.',
        category: 'development' as const,
        tags: ['documentation', 'code', 'technical'],
        featured: false,
        difficulty: 'advanced' as const,
        estimatedTime: '10-15 minutes',
        rating: 4.7,
        usageCount: 456,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-13T12:00:00Z',
      },
    ];

    // Apply filters
    let filteredTemplates = mockTemplates.filter(template => {
      if (input.category && template.category !== input.category) return false;
      if (input.featured !== undefined && template.featured !== input.featured) return false;
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        return (
          template.title.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });

    // Apply pagination
    const paginatedTemplates = filteredTemplates.slice(input.offset, input.offset + input.limit);

    return {
      templates: paginatedTemplates,
      total: filteredTemplates.length,
      hasMore: input.offset + input.limit < filteredTemplates.length,
    };
  });