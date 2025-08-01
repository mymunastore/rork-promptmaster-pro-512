import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Wand2, Copy, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface PromptRewriterProps {
  originalPrompt: string;
  onRewrittenPrompt: (rewrittenPrompt: string) => void;
  testID?: string;
}

type RewriteStyle = 'professional' | 'casual' | 'creative' | 'technical' | 'concise';

const PromptRewriter: React.FC<PromptRewriterProps> = ({ 
  originalPrompt, 
  onRewrittenPrompt, 
  testID 
}) => {
  const { theme } = useTheme();
  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle>('professional');
  const [copied, setCopied] = useState<boolean>(false);

  const rewriteStyles: { key: RewriteStyle; label: string; description: string }[] = [
    { key: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
    { key: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { key: 'creative', label: 'Creative', description: 'Imaginative and engaging' },
    { key: 'technical', label: 'Technical', description: 'Precise and detailed' },
    { key: 'concise', label: 'Concise', description: 'Brief and to the point' },
  ];

  const rewritePrompt = async () => {
    if (!originalPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt to rewrite');
      return;
    }

    setIsRewriting(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert prompt engineer. Rewrite the user's prompt to be more effective for AI tools. Make it ${selectedStyle} in tone. Keep the core intent but improve clarity, specificity, and effectiveness. Return only the rewritten prompt without explanations.`
            },
            {
              role: 'user',
              content: `Rewrite this prompt in a ${selectedStyle} style: "${originalPrompt}"`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite prompt');
      }

      const data = await response.json();
      const rewritten = data.completion.trim();
      setRewrittenPrompt(rewritten);
    } catch (error) {
      console.error('Error rewriting prompt:', error);
      Alert.alert('Error', 'Failed to rewrite prompt. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // For web compatibility
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(rewrittenPrompt);
      } else {
        // For React Native, we'll use a simple alert as fallback
        Alert.alert('Copy Text', rewrittenPrompt, [
          { text: 'OK', style: 'default' }
        ]);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Copy Text', rewrittenPrompt, [
        { text: 'OK', style: 'default' }
      ]);
    }
  };

  const useRewrittenPrompt = () => {
    onRewrittenPrompt(rewrittenPrompt);
    Alert.alert('Success', 'Rewritten prompt has been applied!');
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
    stylesContainer: {
      marginBottom: layout.spacing.md,
    },
    stylesLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    styleButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    styleButton: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    styleButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    styleButtonText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '500' as const,
    },
    styleButtonTextActive: {
      color: theme.card,
    },
    rewriteButton: {
      marginBottom: layout.spacing.md,
    },
    resultContainer: {
      marginTop: layout.spacing.md,
    },
    resultLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    resultText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      backgroundColor: theme.backgroundLight,
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.md,
    },
    resultActions: {
      flexDirection: 'row',
      gap: layout.spacing.sm,
    },
    copyButton: {
      flex: 1,
    },
    useButton: {
      flex: 1,
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
  });

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Wand2 size={20} color={theme.primary} />
        <Text style={styles.title}>AI Prompt Rewriter</Text>
      </View>

      <View style={styles.stylesContainer}>
        <Text style={styles.stylesLabel}>Rewrite Style</Text>
        <View style={styles.styleButtons}>
          {rewriteStyles.map((style) => (
            <TouchableOpacity
              key={style.key}
              style={[
                styles.styleButton,
                selectedStyle === style.key && styles.styleButtonActive,
              ]}
              onPress={() => setSelectedStyle(style.key)}
              testID={`style-${style.key}`}
            >
              <Text
                style={[
                  styles.styleButtonText,
                  selectedStyle === style.key && styles.styleButtonTextActive,
                ]}
              >
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        title={isRewriting ? 'Rewriting...' : 'Rewrite Prompt'}
        onPress={rewritePrompt}
        variant="primary"
        style={styles.rewriteButton}
        disabled={isRewriting || !originalPrompt.trim()}
        testID="rewrite-button"
      />

      {isRewriting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>
            Rewriting your prompt with AI...
          </Text>
        </View>
      )}

      {rewrittenPrompt && !isRewriting && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Rewritten Prompt</Text>
          <Text style={styles.resultText}>{rewrittenPrompt}</Text>
          
          <View style={styles.resultActions}>
            <Button
              title={copied ? 'Copied!' : 'Copy'}
              onPress={copyToClipboard}
              variant="outline"
              style={styles.copyButton}
              icon={copied ? <Check size={16} color={theme.primary} /> : <Copy size={16} color={theme.primary} />}
              testID="copy-button"
            />
            <Button
              title="Use This"
              onPress={useRewrittenPrompt}
              variant="primary"
              style={styles.useButton}
              testID="use-button"
            />
          </View>
        </View>
      )}
    </Card>
  );
};

export default PromptRewriter;