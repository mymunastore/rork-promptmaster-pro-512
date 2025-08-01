import { KeywordSuggestion, TopicSuggestion } from '@/types/prompt';

export const keywordSuggestions: Record<string, KeywordSuggestion[]> = {
  'writing': [
    { keyword: 'engaging', relevance: 0.9 },
    { keyword: 'compelling', relevance: 0.85 },
    { keyword: 'narrative', relevance: 0.8 },
    { keyword: 'concise', relevance: 0.75 },
    { keyword: 'persuasive', relevance: 0.7 },
    { keyword: 'informative', relevance: 0.65 },
    { keyword: 'descriptive', relevance: 0.6 },
    { keyword: 'structured', relevance: 0.55 },
  ],
  'marketing': [
    { keyword: 'conversion', relevance: 0.9 },
    { keyword: 'audience', relevance: 0.85 },
    { keyword: 'persuasive', relevance: 0.8 },
    { keyword: 'benefits', relevance: 0.75 },
    { keyword: 'call-to-action', relevance: 0.7 },
    { keyword: 'value proposition', relevance: 0.65 },
    { keyword: 'engagement', relevance: 0.6 },
    { keyword: 'brand voice', relevance: 0.55 },
  ],
  'development': [
    { keyword: 'efficient', relevance: 0.9 },
    { keyword: 'scalable', relevance: 0.85 },
    { keyword: 'maintainable', relevance: 0.8 },
    { keyword: 'optimized', relevance: 0.75 },
    { keyword: 'secure', relevance: 0.7 },
    { keyword: 'documented', relevance: 0.65 },
    { keyword: 'tested', relevance: 0.6 },
    { keyword: 'modular', relevance: 0.55 },
  ],
  'design': [
    { keyword: 'intuitive', relevance: 0.9 },
    { keyword: 'accessible', relevance: 0.85 },
    { keyword: 'consistent', relevance: 0.8 },
    { keyword: 'responsive', relevance: 0.75 },
    { keyword: 'minimalist', relevance: 0.7 },
    { keyword: 'user-centered', relevance: 0.65 },
    { keyword: 'aesthetic', relevance: 0.6 },
    { keyword: 'interactive', relevance: 0.55 },
  ],
};

export const topicSuggestions: Record<string, TopicSuggestion[]> = {
  'writing': [
    { topic: 'Character Development', description: 'Creating memorable characters with depth' },
    { topic: 'Plot Structure', description: 'Crafting engaging narratives with proper pacing' },
    { topic: 'World Building', description: 'Creating immersive settings for your stories' },
    { topic: 'Dialogue Writing', description: 'Writing realistic and purposeful conversations' },
  ],
  'marketing': [
    { topic: 'Content Marketing Strategy', description: 'Planning content that drives business results' },
    { topic: 'Social Media Campaigns', description: 'Creating engaging social media content' },
    { topic: 'Email Marketing Sequences', description: 'Designing effective email funnels' },
    { topic: 'Brand Storytelling', description: 'Connecting with audiences through narrative' },
  ],
  'development': [
    { topic: 'API Design', description: 'Creating intuitive and efficient APIs' },
    { topic: 'Performance Optimization', description: 'Improving application speed and efficiency' },
    { topic: 'Security Best Practices', description: 'Protecting applications from vulnerabilities' },
    { topic: 'Code Architecture', description: 'Designing maintainable software structures' },
  ],
  'design': [
    { topic: 'User Interface Patterns', description: 'Common UI solutions for usability problems' },
    { topic: 'Color Theory', description: 'Using color effectively in design' },
    { topic: 'Typography', description: 'Selecting and using fonts for readability and style' },
    { topic: 'Design Systems', description: 'Creating consistent design languages' },
  ],
};