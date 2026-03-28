import { PromptTemplate } from '@/types/prompt';

const templates: PromptTemplate[] = [
  {
    id: '1',
    title: 'Blog Post Writer',
    description: 'Create engaging blog content with a structured format',
    template: 'Write a comprehensive blog post about [TOPIC]. Include an attention-grabbing introduction, [NUMBER] main points with supporting evidence, and a compelling conclusion. The tone should be [TONE] and target audience is [AUDIENCE]. Include [YES/NO] statistics and research.',
    category: 'writing',
    tags: ['blog', 'content', 'writing'],
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Product Description',
    description: 'Generate compelling product descriptions for e-commerce',
    template: 'Write a persuasive product description for [PRODUCT], which is a [PRODUCT_TYPE]. The key features include [FEATURE1], [FEATURE2], and [FEATURE3]. The target audience is [AUDIENCE]. The unique selling proposition is [USP]. Keep the tone [TONE] and include a call to action.',
    category: 'marketing',
    tags: ['ecommerce', 'product', 'sales'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Code Explainer',
    description: 'Explain complex code in simple terms',
    template: 'Explain the following [LANGUAGE] code in simple terms:\n\n```\n[CODE_BLOCK]\n```\n\nBreak down what each part does, explain any complex concepts, and suggest any potential improvements or best practices.',
    category: 'development',
    tags: ['coding', 'programming', 'technical'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Social Media Post',
    description: 'Create engaging social media content',
    template: 'Create a [PLATFORM] post about [TOPIC] that will engage [TARGET_AUDIENCE]. The post should be [TONE] and include [HASHTAGS/EMOJIS/CALL_TO_ACTION]. The goal of this post is to [GOAL].',
    category: 'marketing',
    tags: ['social media', 'engagement', 'content'],
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'UI/UX Design Brief',
    description: 'Generate a comprehensive design brief',
    template: 'Create a design brief for a [PRODUCT_TYPE] with the following requirements:\n\n- Target audience: [AUDIENCE]\n- Brand personality: [PERSONALITY]\n- Key features: [FEATURES]\n- Competitors: [COMPETITORS]\n- Design style preferences: [STYLE]\n- Technical constraints: [CONSTRAINTS]\n\nInclude specific goals for the user experience and any metrics for success.',
    category: 'design',
    tags: ['design', 'UX', 'brief'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Business Proposal',
    description: 'Draft a professional business proposal',
    template: 'Create a business proposal for [PROJECT_NAME] addressing [CLIENT]. Include the following sections:\n\n1. Executive Summary\n2. Problem Statement: [PROBLEM]\n3. Proposed Solution: [SOLUTION]\n4. Methodology\n5. Timeline: [TIMELINE]\n6. Budget: [BUDGET]\n7. Team Qualifications\n8. Expected Outcomes\n9. Next Steps\n\nThe tone should be [TONE] and emphasize [VALUE_PROPOSITION].',
    category: 'business',
    tags: ['proposal', 'business', 'professional'],
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Educational Lesson Plan',
    description: 'Create structured lesson plans for educators',
    template: 'Develop a detailed lesson plan for teaching [SUBJECT] to [GRADE_LEVEL] students. The lesson should cover [TOPIC] and take approximately [DURATION] minutes. Include:\n\n1. Learning objectives\n2. Required materials\n3. Introduction/hook\n4. Main activities\n5. Assessment methods\n6. Differentiation strategies for various learning needs\n7. Closure\n8. Homework/extension activities',
    category: 'education',
    tags: ['education', 'teaching', 'lesson plan'],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '8',
    title: 'Creative Story Starter',
    description: 'Generate creative writing prompts',
    template: 'Write the opening paragraph for a [GENRE] story that features a character who [CHARACTER_TRAIT]. The setting is [SETTING] and the main conflict involves [CONFLICT]. Include sensory details and establish a [MOOD/TONE] atmosphere.',
    category: 'writing',
    tags: ['creative', 'fiction', 'writing'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=300&auto=format&fit=crop'
  }
];

export default templates;