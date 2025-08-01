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
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
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