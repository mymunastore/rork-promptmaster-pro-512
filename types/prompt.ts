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