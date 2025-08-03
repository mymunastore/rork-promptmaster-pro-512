import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Zap, TrendingUp, Target, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PromptCategory } from '@/types/prompt';
import { trpc } from '@/lib/trpc';

interface PromptOptimizerProps {
  prompt: string;
  category: PromptCategory;
  onOptimizedPrompt: (optimizedPrompt: string) => void;
  testID?: string;
}

const PromptOptimizer: React.FC<PromptOptimizerProps> = ({ 
  prompt, 
  category, 
  onOptimizedPrompt, 
  testID 
}) => {
  const { theme } = useTheme();
  const [selectedOptimization, setSelectedOptimization] = useState<'clarity' | 'specificity' | 'creativity' | 'performance'>('performance');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const optimizePromptMutation = trpc.ai.optimize.useMutation({
    onSuccess: (data: any) => {
      setOptimizationResult(data);
    },
    onError: (error: any) => {
      console.error('Error optimizing prompt:', error);
      Alert.alert('Error', 'Failed to optimize prompt. Please try again.');
    },
  });

  const handleOptimize = () => {
    if (!prompt.trim()) {
      Alert.alert('No Prompt', 'Please enter a prompt to optimize.');
      return;
    }

    optimizePromptMutation.mutate({
      prompt: prompt.trim(),
      category,
      optimizationType: selectedOptimization,
    });
  };

  const handleUseOptimized = () => {
    if (optimizationResult?.optimizedPrompt) {
      onOptimizedPrompt(optimizationResult.optimizedPrompt);
      Alert.alert('Success', 'Optimized prompt has been applied!');
    }
  };

  const optimizationTypes = [
    {
      id: 'clarity' as const,
      title: 'Clarity',
      description: 'Make the prompt clearer and more understandable',
      icon: Lightbulb,
      color: theme.accent1,
    },
    {
      id: 'specificity' as const,
      title: 'Specificity',
      description: 'Add specific details and constraints',
      icon: Target,
      color: theme.accent2,
    },
    {
      id: 'creativity' as const,
      title: 'Creativity',
      description: 'Enhance creative elements and inspiration',
      icon: Zap,
      color: theme.accent3,
    },
    {
      id: 'performance' as const,
      title: 'Performance',
      description: 'Optimize for better AI model performance',
      icon: TrendingUp,
      color: theme.accent4,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    content: {
      padding: layout.spacing.lg,
    },
    section: {
      marginBottom: layout.spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
    },
    optimizationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    optimizationCard: {
      width: '48%',
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.lg,
      backgroundColor: theme.backgroundLight,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optimizationCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    optimizationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    optimizationTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    optimizationDescription: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    optimizeButton: {
      marginTop: layout.spacing.md,
    },
    resultContainer: {
      marginTop: layout.spacing.lg,
      padding: layout.spacing.lg,
      backgroundColor: theme.backgroundLight,
      borderRadius: layout.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    comparisonContainer: {
      marginBottom: layout.spacing.lg,
    },
    promptContainer: {
      marginBottom: layout.spacing.md,
    },
    promptLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    promptText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
      backgroundColor: theme.background,
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    arrowContainer: {
      alignItems: 'center',
      marginVertical: layout.spacing.sm,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.success + '20',
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.md,
    },
    scoreText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.success,
      marginLeft: layout.spacing.sm,
    },
    improvementsContainer: {
      marginBottom: layout.spacing.lg,
    },
    improvementsTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    improvementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.xs,
    },
    improvementText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
      flex: 1,
    },
    resultActions: {
      flexDirection: 'row',
      gap: layout.spacing.sm,
    },
    useButton: {
      flex: 1,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: layout.spacing.xl,
    },
    loadingText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
    },
  });

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <TrendingUp size={24} color={theme.primary} />
        <Text style={styles.title}>Prompt Optimizer</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optimization Type</Text>
          <View style={styles.optimizationGrid}>
            {optimizationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optimizationCard,
                    selectedOptimization === type.id && styles.optimizationCardActive,
                  ]}
                  onPress={() => setSelectedOptimization(type.id)}
                >
                  <View style={styles.optimizationHeader}>
                    <IconComponent size={18} color={type.color} />
                    <Text style={styles.optimizationTitle}>{type.title}</Text>
                  </View>
                  <Text style={styles.optimizationDescription}>{type.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Button
          title={`Optimize for ${optimizationTypes.find(t => t.id === selectedOptimization)?.title}`}
          onPress={handleOptimize}
          variant="primary"
          style={styles.optimizeButton}
          disabled={optimizePromptMutation.isPending || !prompt.trim()}
          testID="optimize-button"
        />

        {optimizePromptMutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={styles.loadingText}>Optimizing your prompt...</Text>
          </View>
        )}

        {optimizationResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <CheckCircle size={20} color={theme.success} />
              <Text style={styles.resultTitle}>Optimization Complete</Text>
            </View>

            <View style={styles.scoreContainer}>
              <TrendingUp size={16} color={theme.success} />
              <Text style={styles.scoreText}>
                Quality Score: {optimizationResult.score}/100
              </Text>
            </View>

            <View style={styles.comparisonContainer}>
              <View style={styles.promptContainer}>
                <Text style={styles.promptLabel}>Original Prompt:</Text>
                <Text style={styles.promptText}>{optimizationResult.originalPrompt}</Text>
              </View>

              <View style={styles.arrowContainer}>
                <ArrowRight size={20} color={theme.primary} />
              </View>

              <View style={styles.promptContainer}>
                <Text style={styles.promptLabel}>Optimized Prompt:</Text>
                <Text style={styles.promptText}>{optimizationResult.optimizedPrompt}</Text>
              </View>
            </View>

            <View style={styles.improvementsContainer}>
              <Text style={styles.improvementsTitle}>Key Improvements:</Text>
              {optimizationResult.improvements.map((improvement: string, index: number) => (
                <View key={index} style={styles.improvementItem}>
                  <CheckCircle size={12} color={theme.success} />
                  <Text style={styles.improvementText}>{improvement}</Text>
                </View>
              ))}
            </View>

            <View style={styles.resultActions}>
              <Button
                title="Use Optimized Prompt"
                onPress={handleUseOptimized}
                variant="primary"
                style={styles.useButton}
                testID="use-optimized-button"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </Card>
  );
};

export default PromptOptimizer;