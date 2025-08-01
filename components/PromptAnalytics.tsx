import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';

interface PromptAnalyticsProps {
  content: string;
  testID?: string;
}

interface AnalyticsData {
  score: number;
  wordCount: number;
  readability: 'Easy' | 'Medium' | 'Hard';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  suggestions: string[];
}

const PromptAnalytics: React.FC<PromptAnalyticsProps> = ({ content, testID }) => {
  const { theme } = useTheme();

  const analyzePrompt = (text: string): AnalyticsData => {
    const wordCount = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
    
    // Simple scoring algorithm
    let score = 50;
    
    // Word count scoring
    if (wordCount >= 10 && wordCount <= 100) score += 20;
    else if (wordCount > 100 && wordCount <= 200) score += 15;
    else if (wordCount < 10) score -= 20;
    
    // Sentence structure scoring
    if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) score += 15;
    
    // Keyword presence scoring
    const keywords = ['please', 'specific', 'detailed', 'explain', 'analyze', 'create', 'generate'];
    const keywordCount = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;
    score += keywordCount * 5;
    
    // Readability assessment
    let readability: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (avgWordsPerSentence < 12) readability = 'Easy';
    else if (avgWordsPerSentence > 20) readability = 'Hard';
    
    // Sentiment analysis (simplified)
    const positiveWords = ['please', 'help', 'create', 'generate', 'improve', 'enhance'];
    const negativeWords = ['don\'t', 'not', 'never', 'avoid', 'stop'];
    const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
    
    let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
    if (positiveCount > negativeCount) sentiment = 'Positive';
    else if (negativeCount > positiveCount) sentiment = 'Negative';
    
    // Generate suggestions
    const suggestions: string[] = [];
    if (wordCount < 10) suggestions.push('Add more detail to your prompt');
    if (wordCount > 200) suggestions.push('Consider making your prompt more concise');
    if (!text.includes('?') && !text.includes('please')) {
      suggestions.push('Add a clear question or request');
    }
    if (keywordCount < 2) suggestions.push('Include more specific action words');
    if (avgWordsPerSentence > 25) suggestions.push('Break down long sentences');
    
    return {
      score: Math.min(Math.max(score, 0), 100),
      wordCount,
      readability,
      sentiment,
      suggestions
    };
  };

  const analytics = analyzePrompt(content);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
  };
  
  const getReadabilityColor = (readability: string) => {
    switch (readability) {
      case 'Easy': return theme.success;
      case 'Medium': return theme.warning;
      case 'Hard': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: layout.spacing.md,
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    metric: {
      alignItems: 'center',
      flex: 1,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: '700' as const,
      marginBottom: layout.spacing.xs,
    },
    metricLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    scoreCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: layout.spacing.sm,
    },
    scoreText: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: theme.text,
    },
    scoreLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    suggestionsContainer: {
      marginTop: layout.spacing.sm,
    },
    suggestionsTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    suggestion: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: layout.spacing.xs,
      paddingLeft: layout.spacing.sm,
    },
  });

  if (!content.trim()) {
    return (
      <Card style={styles.container} testID={testID}>
        <View style={styles.header}>
          <BarChart3 size={20} color={theme.primary} />
          <Text style={styles.title}>Prompt Analytics</Text>
        </View>
        <Text style={[styles.metricLabel, { textAlign: 'center' }]}>
          Start typing to see analytics
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <BarChart3 size={20} color={theme.primary} />
        <Text style={styles.title}>Prompt Analytics</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(analytics.score) }]}>
          <Text style={styles.scoreText}>{analytics.score}</Text>
        </View>
        <Text style={styles.scoreLabel}>Quality Score</Text>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: theme.accent3 }]}>
            {analytics.wordCount}
          </Text>
          <Text style={styles.metricLabel}>Words</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: getReadabilityColor(analytics.readability) }]}>
            {analytics.readability}
          </Text>
          <Text style={styles.metricLabel}>Readability</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: theme.accent2 }]}>
            {analytics.sentiment}
          </Text>
          <Text style={styles.metricLabel}>Tone</Text>
        </View>
      </View>
      
      {analytics.suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 Suggestions</Text>
          {analytics.suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestion}>
              • {suggestion}
            </Text>
          ))}
        </View>
      )}
    </Card>
  );
};

export default PromptAnalytics;