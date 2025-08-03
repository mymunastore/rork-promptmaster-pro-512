export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: PromptCategory;
  tags: string[];
  imageUrl?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  isFavorite: boolean;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  analytics?: {
    views: number;
    uses: number;
    shares: number;
    rating: number;
    ratingCount: number;
  };
}

export interface PromptAnalytics {
  metrics: {
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    readabilityScore: number;
  };
  scores: {
    overall: number;
    clarity: number;
    specificity: number;
    creativity: number;
    complexity: string;
  };
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
  categoryMatch: PromptCategory;
  estimatedTokens: number;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  optimizationType: 'clarity' | 'specificity' | 'creativity' | 'performance';
  improvements: string[];
  score: number;
}

export interface GeneratedPrompt {
  prompt: string;
  category: PromptCategory;
  purpose: string;
  tone: 'professional' | 'casual' | 'creative' | 'technical' | 'friendly';
  length: 'short' | 'medium' | 'long';
  keywords: string[];
  generatedAt: string;
}

export type PromptCategory = 
  | 'writing'
  | 'marketing'
  | 'development'
  | 'design'
  | 'business'
  | 'education'
  | 'personal';

export interface KeywordSuggestion {
  keyword: string;
  relevance: number;
}

export interface TopicSuggestion {
  topic: string;
  description: string;
}

export interface CommunityTemplate extends PromptTemplate {
  author: string;
  authorId: string;
  rating: number;
  downloads: number;
  isVerified: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface PromptRating {
  id: string;
  templateId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface PromptUsageStats {
  templateId: string;
  totalUses: number;
  successRate: number;
  avgRating: number;
  trendingScore: number;
}