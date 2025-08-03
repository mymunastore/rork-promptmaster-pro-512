import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Wand2, Sparkles, Target, Zap, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { PromptCategory } from '@/types/prompt';
import { trpc } from '@/lib/trpc';

interface AdvancedPromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  testID?: string;
}

const AdvancedPromptGenerator: React.FC<AdvancedPromptGeneratorProps> = ({ 
  onPromptGenerated, 
  testID 
}) => {
  const { theme } = useTheme();
  const [purpose, setPurpose] = useState<string>('');
  const [category, setCategory] = useState<PromptCategory>('writing');
  const [tone, setTone] = useState<'professional' | 'casual' | 'creative' | 'technical' | 'friendly'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const generatePromptMutation = trpc.ai.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedPrompt(data.prompt);
    },
    onError: (error) => {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    },
  });

  const handleGenerate = () => {
    if (!purpose.trim()) {
      Alert.alert('Missing Information', 'Please describe the purpose of your prompt.');
      return;
    }

    const keywordArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    generatePromptMutation.mutate({
      category,
      purpose: purpose.trim(),
      tone,
      length,
      keywords: keywordArray,
    });
  };

  const handleUsePrompt = () => {
    if (generatedPrompt) {
      onPromptGenerated(generatedPrompt);
      Alert.alert('Success', 'Generated prompt has been applied!');
    }
  };

  const handleRegenerate = () => {
    if (purpose.trim()) {
      handleGenerate();
    }
  };

  const renderCategoryButton = (categoryId: PromptCategory, label: string) => (
    <TouchableOpacity
      key={categoryId}
      style={[
        styles.optionButton,
        category === categoryId && styles.optionButtonActive,
      ]}
      onPress={() => setCategory(categoryId)}
    >
      <Text
        style={[
          styles.optionButtonText,
          category === categoryId && styles.optionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderToneButton = (toneId: typeof tone, label: string) => (
    <TouchableOpacity
      key={toneId}
      style={[
        styles.optionButton,
        tone === toneId && styles.optionButtonActive,
      ]}
      onPress={() => setTone(toneId)}
    >
      <Text
        style={[
          styles.optionButtonText,
          tone === toneId && styles.optionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLengthButton = (lengthId: typeof length, label: string) => (
    <TouchableOpacity
      key={lengthId}
      style={[
        styles.optionButton,
        length === lengthId && styles.optionButtonActive,
      ]}
      onPress={() => setLength(lengthId)}
    >
      <Text
        style={[
          styles.optionButtonText,
          length === lengthId && styles.optionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    optionButton: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
      borderWidth: 1,
      borderColor: theme.border,
    },
    optionButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    optionButtonText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500' as const,
    },
    optionButtonTextActive: {
      color: theme.card,
    },
    generateButton: {
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
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
    },
    regenerateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.background,
    },
    regenerateButtonText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    resultText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
      marginBottom: layout.spacing.md,
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
        <Wand2 size={24} color={theme.primary} />
        <Text style={styles.title}>AI Prompt Generator</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose</Text>
          <Input
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Describe what you want your prompt to accomplish..."
            multiline
            numberOfLines={3}
            testID="purpose-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionsContainer}>
            {renderCategoryButton('writing', 'Writing')}
            {renderCategoryButton('marketing', 'Marketing')}
            {renderCategoryButton('development', 'Development')}
            {renderCategoryButton('design', 'Design')}
            {renderCategoryButton('business', 'Business')}
            {renderCategoryButton('education', 'Education')}
            {renderCategoryButton('personal', 'Personal')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tone</Text>
          <View style={styles.optionsContainer}>
            {renderToneButton('professional', 'Professional')}
            {renderToneButton('casual', 'Casual')}
            {renderToneButton('creative', 'Creative')}
            {renderToneButton('technical', 'Technical')}
            {renderToneButton('friendly', 'Friendly')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Length</Text>
          <View style={styles.optionsContainer}>
            {renderLengthButton('short', 'Short')}
            {renderLengthButton('medium', 'Medium')}
            {renderLengthButton('long', 'Long')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keywords (Optional)</Text>
          <Input
            value={keywords}
            onChangeText={setKeywords}
            placeholder="Enter keywords separated by commas..."
            testID="keywords-input"
          />
        </View>

        <Button
          title="Generate Prompt"
          onPress={handleGenerate}
          variant="primary"
          style={styles.generateButton}
          disabled={generatePromptMutation.isPending || !purpose.trim()}
          testID="generate-button"
        />

        {generatePromptMutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={styles.loadingText}>Generating your perfect prompt...</Text>
          </View>
        )}

        {generatedPrompt && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Generated Prompt</Text>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleRegenerate}
                disabled={generatePromptMutation.isPending}
              >
                <RefreshCw size={14} color={theme.textSecondary} />
                <Text style={styles.regenerateButtonText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.resultText}>{generatedPrompt}</Text>
            
            <View style={styles.resultActions}>
              <Button
                title="Use This Prompt"
                onPress={handleUsePrompt}
                variant="primary"
                style={styles.useButton}
                testID="use-prompt-button"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </Card>
  );
};

export default AdvancedPromptGenerator;