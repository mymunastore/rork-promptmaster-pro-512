import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { TestTube, Play, Trophy, BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface PromptABTestingProps {
  promptA: string;
  promptB: string;
  onTestComplete: (winner: 'A' | 'B', results: TestResults) => void;
  testID?: string;
}

interface TestResults {
  promptA: {
    response: string;
    score: number;
    metrics: {
      clarity: number;
      relevance: number;
      creativity: number;
      completeness: number;
    };
  };
  promptB: {
    response: string;
    score: number;
    metrics: {
      clarity: number;
      relevance: number;
      creativity: number;
      completeness: number;
    };
  };
  winner: 'A' | 'B';
  confidence: number;
}

const PromptABTesting: React.FC<PromptABTestingProps> = ({ 
  promptA, 
  promptB, 
  onTestComplete, 
  testID 
}) => {
  const { theme } = useTheme();
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);


  const runABTest = async () => {
    if (!promptA.trim() || !promptB.trim()) {
      Alert.alert('Error', 'Both prompts must be provided for A/B testing');
      return;
    }

    setIsTesting(true);
    try {
      // Test both prompts with the same test query
      const testQuery = "Explain the concept of artificial intelligence in simple terms.";
      
      const [responseA, responseB] = await Promise.all([
        testPrompt(promptA + " " + testQuery),
        testPrompt(promptB + " " + testQuery)
      ]);

      // Analyze and score the responses
      const resultsA = analyzeResponse(responseA, promptA);
      const resultsB = analyzeResponse(responseB, promptB);

      const results: TestResults = {
        promptA: resultsA,
        promptB: resultsB,
        winner: resultsA.score > resultsB.score ? 'A' : 'B',
        confidence: Math.abs(resultsA.score - resultsB.score) / 100
      };

      setTestResults(results);
      onTestComplete(results.winner, results);
    } catch (error) {
      console.error('Error running A/B test:', error);
      Alert.alert('Error', 'Failed to run A/B test. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const testPrompt = async (prompt: string): Promise<string> => {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to test prompt');
    }

    const data = await response.json();
    return data.completion.trim();
  };

  const analyzeResponse = (response: string, originalPrompt: string) => {
    const wordCount = response.trim().split(/\s+/).length;
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Simple scoring metrics
    const clarity = Math.min(100, Math.max(0, 100 - (sentences.length > 0 ? 
      (response.length / sentences.length - 50) * 2 : 0)));
    
    const relevance = Math.min(100, Math.max(0, 
      originalPrompt.toLowerCase().split(' ').filter(word => 
        response.toLowerCase().includes(word) && word.length > 3
      ).length * 10));
    
    const creativity = Math.min(100, Math.max(0, 
      (new Set(response.toLowerCase().split(/\s+/)).size / wordCount) * 100));
    
    const completeness = Math.min(100, Math.max(0, 
      wordCount >= 50 ? 100 : (wordCount / 50) * 100));
    
    const score = (clarity + relevance + creativity + completeness) / 4;

    return {
      response,
      score: Math.round(score),
      metrics: {
        clarity: Math.round(clarity),
        relevance: Math.round(relevance),
        creativity: Math.round(creativity),
        completeness: Math.round(completeness)
      }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
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
    promptsContainer: {
      marginBottom: layout.spacing.md,
    },
    promptCard: {
      backgroundColor: theme.backgroundLight,
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.sm,
    },
    promptLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    promptText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    testButton: {
      marginBottom: layout.spacing.md,
    },
    loadingContainer: {
      alignItems: 'center',
      padding: layout.spacing.lg,
    },
    loadingText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: layout.spacing.sm,
    },
    resultsContainer: {
      marginTop: layout.spacing.md,
    },
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    resultsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    winnerBanner: {
      backgroundColor: theme.success + '20',
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.md,
      alignItems: 'center',
    },
    winnerText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.success,
      marginBottom: layout.spacing.xs,
    },
    confidenceText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    resultCard: {
      backgroundColor: theme.backgroundLight,
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.md,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    resultLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
    },
    scoreContainer: {
      alignItems: 'center',
    },
    scoreText: {
      fontSize: 18,
      fontWeight: '700' as const,
    },
    scoreLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: layout.spacing.sm,
    },
    metric: {
      alignItems: 'center',
      flex: 1,
    },
    metricValue: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.accent3,
    },
    metricLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    responseText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
      marginTop: layout.spacing.sm,
    },
  });

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <TestTube size={20} color={theme.primary} />
        <Text style={styles.title}>A/B Prompt Testing</Text>
      </View>

      <View style={styles.promptsContainer}>
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Prompt A</Text>
          <Text style={styles.promptText} numberOfLines={3}>
            {promptA || 'No prompt provided'}
          </Text>
        </View>
        
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Prompt B</Text>
          <Text style={styles.promptText} numberOfLines={3}>
            {promptB || 'No prompt provided'}
          </Text>
        </View>
      </View>

      <Button
        title={isTesting ? 'Running Test...' : 'Run A/B Test'}
        onPress={runABTest}
        variant="primary"
        style={styles.testButton}
        disabled={isTesting || !promptA.trim() || !promptB.trim()}
        icon={Play}
        testID="run-test-button"
      />

      {isTesting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>
            Testing both prompts with AI...
          </Text>
        </View>
      )}

      {testResults && !isTesting && (
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsHeader}>
            <BarChart3 size={20} color={theme.success} />
            <Text style={styles.resultsTitle}>Test Results</Text>
          </View>

          <View style={styles.winnerBanner}>
            <Trophy size={24} color={theme.success} />
            <Text style={styles.winnerText}>
              Prompt {testResults.winner} Wins!
            </Text>
            <Text style={styles.confidenceText}>
              Confidence: {Math.round(testResults.confidence * 100)}%
            </Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>Prompt A Results</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: getScoreColor(testResults.promptA.score) }]}>
                  {testResults.promptA.score}
                </Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptA.metrics.clarity}</Text>
                <Text style={styles.metricLabel}>Clarity</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptA.metrics.relevance}</Text>
                <Text style={styles.metricLabel}>Relevance</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptA.metrics.creativity}</Text>
                <Text style={styles.metricLabel}>Creativity</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptA.metrics.completeness}</Text>
                <Text style={styles.metricLabel}>Complete</Text>
              </View>
            </View>
            
            <Text style={styles.responseText} numberOfLines={4}>
              {testResults.promptA.response}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>Prompt B Results</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: getScoreColor(testResults.promptB.score) }]}>
                  {testResults.promptB.score}
                </Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptB.metrics.clarity}</Text>
                <Text style={styles.metricLabel}>Clarity</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptB.metrics.relevance}</Text>
                <Text style={styles.metricLabel}>Relevance</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptB.metrics.creativity}</Text>
                <Text style={styles.metricLabel}>Creativity</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{testResults.promptB.metrics.completeness}</Text>
                <Text style={styles.metricLabel}>Complete</Text>
              </View>
            </View>
            
            <Text style={styles.responseText} numberOfLines={4}>
              {testResults.promptB.response}
            </Text>
          </View>
        </ScrollView>
      )}
    </Card>
  );
};

export default PromptABTesting;