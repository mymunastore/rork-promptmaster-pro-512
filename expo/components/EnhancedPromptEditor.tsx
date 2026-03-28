import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  Vibration
} from 'react-native';
import {
  Sparkles,
  Wand2,
  Target,
  TrendingUp,
  Eye,
  Copy,
  Share2,
  Save,
  RotateCcw,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Timer,
  BarChart3
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PromptCategory, PromptAnalytics } from '@/types/prompt';
import { trpc } from '@/lib/trpc';

interface EnhancedPromptEditorProps {
  initialPrompt?: string;
  category?: PromptCategory;
  onSave?: (prompt: string, analytics: PromptAnalytics) => void;
  onShare?: (prompt: string) => void;
  testID?: string;
}

interface RealTimeAnalytics {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  readabilityScore: number;
  complexityLevel: 'Simple' | 'Moderate' | 'Complex' | 'Advanced';
  estimatedTokens: number;
  keywordDensity: { [key: string]: number };
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}

const EnhancedPromptEditor: React.FC<EnhancedPromptEditorProps> = ({
  initialPrompt = '',
  category = 'writing',
  onSave,
  onShare,
  testID
}) => {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<RealTimeAnalytics | null>(null);
  const [showAdvancedMode, setShowAdvancedMode] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [writingTimer, setWritingTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [wordGoal, setWordGoal] = useState<number>(100);
  const [showWordGoal, setShowWordGoal] = useState<boolean>(false);
  
  const fadeAnim = useMemo(() => new Animated.Value(1), []);
  const screenWidth = Dimensions.get('window').width;
  
  // Real-time analytics calculation
  const calculateAnalytics = useCallback((text: string): RealTimeAnalytics => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chars = text.length;
    
    // Calculate readability score (simplified Flesch Reading Ease)
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    const avgSyllablesPerWord = words.reduce((acc, word) => {
      return acc + Math.max(1, word.toLowerCase().replace(/[^aeiou]/g, '').length);
    }, 0) / Math.max(1, words.length);
    
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));
    
    // Determine complexity
    let complexityLevel: RealTimeAnalytics['complexityLevel'] = 'Simple';
    if (readabilityScore < 30) complexityLevel = 'Advanced';
    else if (readabilityScore < 50) complexityLevel = 'Complex';
    else if (readabilityScore < 70) complexityLevel = 'Moderate';
    
    // Estimate tokens (rough approximation)
    const estimatedTokens = Math.ceil(words.length * 1.3);
    
    // Calculate keyword density
    const keywordDensity: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 3) {
        keywordDensity[cleanWord] = (keywordDensity[cleanWord] || 0) + 1;
      }
    });
    
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'best', 'love', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'disappointing', 'poor', 'failed'];
    
    const positiveCount = words.filter(word => 
      positiveWords.includes(word.toLowerCase().replace(/[^a-z]/g, ''))
    ).length;
    const negativeCount = words.filter(word => 
      negativeWords.includes(word.toLowerCase().replace(/[^a-z]/g, ''))
    ).length;
    
    let sentiment: RealTimeAnalytics['sentiment'] = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Generate suggestions
    const suggestions: string[] = [];
    if (words.length < 10) suggestions.push('Consider adding more detail to your prompt');
    if (sentences.length === 1 && words.length > 20) suggestions.push('Break long sentences into shorter ones');
    if (readabilityScore < 30) suggestions.push('Simplify complex sentences for better clarity');
    if (estimatedTokens > 1000) suggestions.push('Consider shortening to reduce token usage');
    if (Object.keys(keywordDensity).length < 3) suggestions.push('Add more specific keywords');
    
    return {
      wordCount: words.length,
      charCount: chars,
      sentenceCount: sentences.length,
      readabilityScore: Math.round(readabilityScore),
      complexityLevel,
      estimatedTokens,
      keywordDensity,
      sentiment,
      suggestions
    };
  }, []);
  
  // Update analytics when prompt changes
  useEffect(() => {
    if (prompt.trim()) {
      const newAnalytics = calculateAnalytics(prompt);
      setAnalytics(newAnalytics);
    } else {
      setAnalytics(null);
    }
  }, [prompt, calculateAnalytics]);
  
  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && prompt.trim() && prompt !== initialPrompt) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
        // Here you would typically save to storage
        console.log('Auto-saved prompt');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [prompt, autoSaveEnabled, initialPrompt]);
  
  // Writing timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => {
        setWritingTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);
  
  // Undo/Redo functionality
  const handleTextChange = useCallback((text: string) => {
    if (text !== prompt) {
      setUndoStack(prev => [...prev.slice(-9), prompt]); // Keep last 10 states
      setRedoStack([]);
      setPrompt(text);
    }
  }, [prompt]);
  
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [prompt, ...prev.slice(0, 9)]);
      setUndoStack(prev => prev.slice(0, -1));
      setPrompt(previousState);
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    }
  }, [undoStack, prompt]);
  
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, prompt]);
      setRedoStack(prev => prev.slice(1));
      setPrompt(nextState);
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    }
  }, [redoStack, prompt]);
  
  // AI Optimization
  const optimizePromptMutation = trpc.ai.optimize.useMutation({
    onSuccess: (data) => {
      setOptimizationSuggestions(data.improvements || []);
      setIsOptimizing(false);
    },
    onError: (error) => {
      console.error('Optimization error:', error);
      setIsOptimizing(false);
      Alert.alert('Error', 'Failed to optimize prompt');
    }
  });
  
  const handleOptimize = useCallback(() => {
    if (!prompt.trim()) {
      Alert.alert('No Content', 'Please enter some text to optimize');
      return;
    }
    
    setIsOptimizing(true);
    optimizePromptMutation.mutate({
      prompt: prompt.trim(),
      category,
      optimizationType: 'performance'
    });
  }, [prompt, category, optimizePromptMutation]);
  
  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(prompt);
      } else {
        // For mobile, you'd use @react-native-clipboard/clipboard
        console.log('Copied to clipboard:', prompt);
      }
      
      // Visual feedback
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
      
      Alert.alert('Copied!', 'Prompt copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  }, [prompt, fadeAnim]);
  
  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Get progress towards word goal
  const wordProgress = useMemo(() => {
    if (!analytics || !showWordGoal) return 0;
    return Math.min(100, (analytics.wordCount / wordGoal) * 100);
  }, [analytics, wordGoal, showWordGoal]);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: focusMode ? theme.background : 'transparent',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    toolbarButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
    },
    toolbarButtonActive: {
      backgroundColor: theme.primary,
    },
    editorContainer: {
      flex: 1,
      padding: layout.spacing.lg,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.lg,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 200,
    },
    focusModeInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      fontSize: 18,
      lineHeight: 28,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    toolbarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    toolbarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    analyticsPanel: {
      backgroundColor: theme.backgroundLight,
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.md,
      marginBottom: layout.spacing.md,
    },
    analyticsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    analyticsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
      marginBottom: layout.spacing.md,
    },
    metricCard: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.sm,
      minWidth: (screenWidth - layout.spacing.lg * 2 - layout.spacing.sm * 3) / 4,
      alignItems: 'center',
    },
    metricValue: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: theme.text,
    },
    metricLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: layout.spacing.xs,
    },
    complexityBadge: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.round,
      alignSelf: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    complexityText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: theme.card,
    },
    suggestionsList: {
      marginTop: layout.spacing.sm,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.xs,
    },
    suggestionText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
      flex: 1,
    },
    wordGoalContainer: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.md,
      marginBottom: layout.spacing.md,
    },
    wordGoalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.sm,
    },
    wordGoalTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: layout.spacing.xs,
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.xs,
    },
    autoSaveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    autoSaveText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    optimizationPanel: {
      backgroundColor: theme.accent1 + '10',
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.md,
      marginBottom: layout.spacing.md,
      borderWidth: 1,
      borderColor: theme.accent1 + '30',
    },
    optimizationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    optimizationTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    optimizationSuggestion: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.sm,
      marginBottom: layout.spacing.xs,
    },
    optimizationText: {
      fontSize: 14,
      color: theme.text,
    },
  });
  
  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Simple': return theme.success;
      case 'Moderate': return theme.accent2;
      case 'Complex': return theme.accent3;
      case 'Advanced': return theme.error;
      default: return theme.textSecondary;
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID={testID}
    >
      {!focusMode && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Brain size={24} color={theme.primary} />
            <Text style={styles.headerTitle}>Enhanced Editor</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.toolbarButton, timerActive && styles.toolbarButtonActive]}
              onPress={() => setTimerActive(!timerActive)}
            >
              <Timer size={18} color={timerActive ? theme.card : theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolbarButton, focusMode && styles.toolbarButtonActive]}
              onPress={() => setFocusMode(!focusMode)}
            >
              <Eye size={18} color={focusMode ? theme.card : theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <ScrollView style={styles.editorContainer} showsVerticalScrollIndicator={false}>
        {!focusMode && showWordGoal && (
          <View style={styles.wordGoalContainer}>
            <View style={styles.wordGoalHeader}>
              <Text style={styles.wordGoalTitle}>Word Goal: {wordGoal}</Text>
              <Text style={styles.wordGoalTitle}>
                {analytics?.wordCount || 0} / {wordGoal}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${wordProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {wordProgress >= 100 ? '🎉 Goal achieved!' : `${Math.round(wordProgress)}% complete`}
            </Text>
          </View>
        )}
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <TextInput
            style={[styles.textInput, focusMode && styles.focusModeInput]}
            value={prompt}
            onChangeText={handleTextChange}
            placeholder="Start writing your enhanced prompt..."
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            autoFocus={focusMode}
          />
        </Animated.View>
        
        {!focusMode && analytics && (
          <View style={styles.analyticsPanel}>
            <View style={styles.analyticsHeader}>
              <Text style={styles.analyticsTitle}>Real-time Analytics</Text>
              <View style={[
                styles.complexityBadge,
                { backgroundColor: getComplexityColor(analytics.complexityLevel) }
              ]}>
                <Text style={styles.complexityText}>{analytics.complexityLevel}</Text>
              </View>
            </View>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.wordCount}</Text>
                <Text style={styles.metricLabel}>Words</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.charCount}</Text>
                <Text style={styles.metricLabel}>Characters</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.readabilityScore}</Text>
                <Text style={styles.metricLabel}>Readability</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.estimatedTokens}</Text>
                <Text style={styles.metricLabel}>Est. Tokens</Text>
              </View>
            </View>
            
            {analytics.suggestions.length > 0 && (
              <View style={styles.suggestionsList}>
                {analytics.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Lightbulb size={12} color={theme.accent3} />
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {!focusMode && optimizationSuggestions.length > 0 && (
          <View style={styles.optimizationPanel}>
            <View style={styles.optimizationHeader}>
              <Sparkles size={20} color={theme.accent1} />
              <Text style={styles.optimizationTitle}>AI Optimization Suggestions</Text>
            </View>
            {optimizationSuggestions.map((suggestion, index) => (
              <View key={index} style={styles.optimizationSuggestion}>
                <Text style={styles.optimizationText}>{suggestion}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={handleUndo}
            disabled={undoStack.length === 0}
          >
            <RotateCcw size={18} color={undoStack.length > 0 ? theme.text : theme.textSecondary} />
          </TouchableOpacity>
          
          {timerActive && (
            <View style={styles.timerContainer}>
              <Timer size={14} color={theme.primary} />
              <Text style={styles.timerText}>{formatTime(writingTimer)}</Text>
            </View>
          )}
          
          {lastSaved && (
            <View style={styles.autoSaveIndicator}>
              <CheckCircle size={12} color={theme.success} />
              <Text style={styles.autoSaveText}>
                Saved {formatTime(Math.floor((Date.now() - lastSaved.getTime()) / 1000))} ago
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.toolbarRight}>
          <TouchableOpacity style={styles.toolbarButton} onPress={handleCopy}>
            <Copy size={18} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={handleOptimize}
            disabled={isOptimizing || !prompt.trim()}
          >
            {isOptimizing ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Wand2 size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => onShare?.(prompt)}
            disabled={!prompt.trim()}
          >
            <Share2 size={18} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: theme.primary }]}
            onPress={() => analytics && onSave?.(prompt, analytics as any)}
            disabled={!prompt.trim()}
          >
            <Save size={18} color={theme.card} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EnhancedPromptEditor;