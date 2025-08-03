import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Tag, 
  Sparkles, 
  X,
  Plus
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import KeywordSuggestionChip from '@/components/KeywordSuggestionChip';
import TopicSuggestionCard from '@/components/TopicSuggestionCard';
import PromptAnalytics from '@/components/PromptAnalytics';
import PromptRewriter from '@/components/PromptRewriter';
import PromptABTesting from '@/components/PromptABTesting';
import PromptChatCompanion from '@/components/PromptChatCompanion';
import AdvancedPromptGenerator from '@/components/AdvancedPromptGenerator';
import PromptOptimizer from '@/components/PromptOptimizer';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { PromptCategory, TopicSuggestion } from '@/types/prompt';
import { usePromptStore } from '@/hooks/usePromptStore';
import templates from '@/mocks/templates';
import { keywordSuggestions, topicSuggestions } from '@/mocks/keywords';

export default function PromptEditorScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { templateId, promptId } = useLocalSearchParams<{ templateId?: string; promptId?: string }>();
  const { savePrompt, updatePrompt, getPromptById } = usePromptStore();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<PromptCategory>('writing');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showRewriter, setShowRewriter] = useState<boolean>(false);
  const [showABTesting, setShowABTesting] = useState<boolean>(false);
  const [showChatCompanion, setShowChatCompanion] = useState<boolean>(false);
  const [showAdvancedGenerator, setShowAdvancedGenerator] = useState<boolean>(false);
  const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState<boolean>(false);
  const [promptB, setPromptB] = useState<string>('');

  // Initialize from template or saved prompt
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setTitle(`New ${template.title}`);
        setContent(template.template);
        setCategory(template.category);
        setTags(template.tags);
      }
    } else if (promptId) {
      const savedPrompt = getPromptById(promptId);
      if (savedPrompt) {
        setTitle(savedPrompt.title);
        setContent(savedPrompt.content);
        setCategory(savedPrompt.category);
        setTags(savedPrompt.tags);
        setIsEditing(true);
      }
    }
  }, [templateId, promptId, getPromptById]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCategoryChange = (newCategory: PromptCategory) => {
    setCategory(newCategory);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your prompt');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content for your prompt');
      return;
    }

    try {
      if (isEditing && promptId) {
        updatePrompt(promptId, {
          title,
          content,
          category,
          tags,
        });
        Alert.alert('Success', 'Prompt updated successfully');
      } else {
        savePrompt({
          title,
          content,
          category,
          tags,
          isFavorite: false,
        });
        Alert.alert('Success', 'Prompt saved successfully');
      }
      router.back();
    } catch (error) {
      console.error('Error saving prompt:', error);
      Alert.alert('Error', 'Failed to save prompt');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${content}`,
      });
    } catch (error) {
      console.error('Error sharing prompt:', error);
      Alert.alert('Error', 'Failed to share prompt');
    }
  };

  const handleAddKeyword = (keyword: string) => {
    setContent(prevContent => {
      if (prevContent.includes(keyword)) {
        return prevContent;
      }
      return prevContent + (prevContent.endsWith(' ') ? '' : ' ') + keyword;
    });
  };

  const handleAddTopic = (topic: TopicSuggestion) => {
    setContent(prevContent => {
      if (prevContent.includes(topic.topic)) {
        return prevContent;
      }
      return prevContent + (prevContent.endsWith('\n\n') ? '' : '\n\n') + 
        `Topic: ${topic.topic}\n${topic.description}`;
    });
  };

  const handleRewrittenPrompt = (rewrittenPrompt: string) => {
    setContent(rewrittenPrompt);
  };

  const handleABTestComplete = (winner: 'A' | 'B', results: any) => {
    console.log('A/B Test completed:', { winner, results });
    Alert.alert(
      'A/B Test Complete',
      `Prompt ${winner} performed better with a score of ${winner === 'A' ? results.promptA.score : results.promptB.score}!`,
      [{ text: 'OK' }]
    );
  };

  const handleChatSuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  const handleGeneratedPrompt = (generatedPrompt: string) => {
    setContent(generatedPrompt);
  };

  const handleOptimizedPrompt = (optimizedPrompt: string) => {
    setContent(optimizedPrompt);
  };

  const renderCategoryButton = (categoryId: PromptCategory, label: string) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        category === categoryId && styles.categoryButtonActive,
      ]}
      onPress={() => handleCategoryChange(categoryId)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          category === categoryId && styles.categoryButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: layout.spacing.lg,
      paddingBottom: 100, // Extra padding for footer
    },
    section: {
      marginBottom: layout.spacing.lg,
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    titleInput: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.md,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingVertical: layout.spacing.xs,
    },
    categoryButton: {
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.round,
      backgroundColor: theme.background,
      marginRight: layout.spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryButtonText: {
      color: theme.text,
      fontWeight: '500' as const,
    },
    categoryButtonTextActive: {
      color: theme.card,
    },
    contentInput: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.md,
      fontSize: 16,
      color: theme.text,
      minHeight: 200,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagInput: {
      backgroundColor: theme.card,
      borderTopLeftRadius: layout.borderRadius.md,
      borderBottomLeftRadius: layout.borderRadius.md,
      padding: layout.spacing.sm,
      paddingHorizontal: layout.spacing.md,
      fontSize: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRightWidth: 0,
      width: 120,
    },
    addTagButton: {
      backgroundColor: theme.primary,
      borderTopRightRadius: layout.borderRadius.md,
      borderBottomRightRadius: layout.borderRadius.md,
      padding: layout.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.round,
      paddingVertical: layout.spacing.xs,
      paddingHorizontal: layout.spacing.md,
      marginRight: layout.spacing.sm,
      marginBottom: layout.spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagIcon: {
      marginRight: layout.spacing.xs,
    },
    tagText: {
      fontSize: 14,
      color: theme.text,
      marginRight: layout.spacing.sm,
    },
    suggestionsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    suggestionsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.primary,
      marginLeft: layout.spacing.sm,
    },
    suggestionsCard: {
      padding: layout.spacing.md,
    },
    suggestionsSubtitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    topicTitle: {
      marginTop: layout.spacing.md,
    },
    keywordsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    topicsContainer: {
      paddingBottom: layout.spacing.sm,
    },
    abTestingInputContainer: {
      marginBottom: layout.spacing.md,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      flexDirection: 'row',
      padding: layout.spacing.md,
    },
    saveButton: {
      flex: 1,
      marginRight: layout.spacing.sm,
    },
    shareButton: {
      width: 100,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="prompt-editor-screen"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter prompt title..."
            placeholderTextColor={theme.textSecondary}
            testID="title-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {renderCategoryButton('writing', 'Writing')}
            {renderCategoryButton('marketing', 'Marketing')}
            {renderCategoryButton('development', 'Development')}
            {renderCategoryButton('design', 'Design')}
            {renderCategoryButton('business', 'Business')}
            {renderCategoryButton('education', 'Education')}
            {renderCategoryButton('personal', 'Personal')}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Prompt Content</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Write your prompt here..."
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            testID="content-input"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.tagsHeader}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Add tag..."
                placeholderTextColor={theme.textSecondary}
                onSubmitEditing={handleAddTag}
                testID="tag-input"
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
                testID="add-tag-button"
              >
                <Plus size={20} color={theme.card} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Tag size={14} color={theme.text} style={styles.tagIcon} />
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={14} color={theme.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowSuggestions(!showSuggestions)}
            testID="toggle-suggestions-button"
          >
            <Sparkles size={20} color={theme.primary} />
            <Text style={styles.suggestionsTitle}>
              {showSuggestions ? 'Hide Suggestions' : 'Show Optimization Suggestions'}
            </Text>
          </TouchableOpacity>
          
          {showSuggestions && (
            <Card style={styles.suggestionsCard}>
              <Text style={styles.suggestionsSubtitle}>Keyword Suggestions</Text>
              <View style={styles.keywordsContainer}>
                {keywordSuggestions[category]?.map((keyword, index) => (
                  <KeywordSuggestionChip
                    key={index}
                    keyword={keyword}
                    onPress={handleAddKeyword}
                    testID={`keyword-chip-${index}`}
                  />
                ))}
              </View>
              
              <Text style={[styles.suggestionsSubtitle, styles.topicTitle]}>Topic Ideas</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topicsContainer}
              >
                {topicSuggestions[category]?.map((topic, index) => (
                  <TopicSuggestionCard
                    key={index}
                    topic={topic}
                    onPress={handleAddTopic}
                    testID={`topic-card-${index}`}
                  />
                ))}
              </ScrollView>
            </Card>
          )}
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowAnalytics(!showAnalytics)}
            testID="toggle-analytics-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showAnalytics ? 'Hide Analytics' : 'Show Prompt Analytics'}
            </Text>
          </TouchableOpacity>
          
          {showAnalytics && (
            <PromptAnalytics 
              content={content}
              testID="prompt-analytics"
            />
          )}
        </View>

        {/* AI Rewriter Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowRewriter(!showRewriter)}
            testID="toggle-rewriter-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showRewriter ? 'Hide AI Rewriter' : 'Show AI Rewriter'}
            </Text>
          </TouchableOpacity>
          
          {showRewriter && (
            <PromptRewriter 
              originalPrompt={content}
              onRewrittenPrompt={handleRewrittenPrompt}
              testID="prompt-rewriter"
            />
          )}
        </View>

        {/* A/B Testing Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowABTesting(!showABTesting)}
            testID="toggle-ab-testing-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showABTesting ? 'Hide A/B Testing' : 'Show A/B Testing'}
            </Text>
          </TouchableOpacity>
          
          {showABTesting && (
            <View>
              <View style={styles.abTestingInputContainer}>
                <Text style={styles.label}>Prompt B (for comparison)</Text>
                <TextInput
                  style={styles.contentInput}
                  value={promptB}
                  onChangeText={setPromptB}
                  placeholder="Enter alternative prompt for A/B testing..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  textAlignVertical="top"
                  testID="prompt-b-input"
                />
              </View>
              
              <PromptABTesting 
                promptA={content}
                promptB={promptB}
                onTestComplete={handleABTestComplete}
                testID="prompt-ab-testing"
              />
            </View>
          )}
        </View>

        {/* Advanced Prompt Generator Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowAdvancedGenerator(!showAdvancedGenerator)}
            testID="toggle-advanced-generator-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showAdvancedGenerator ? 'Hide AI Generator' : 'Show AI Generator'}
            </Text>
          </TouchableOpacity>
          
          {showAdvancedGenerator && (
            <View style={{ height: 500 }}>
              <AdvancedPromptGenerator 
                onPromptGenerated={handleGeneratedPrompt}
                testID="advanced-prompt-generator"
              />
            </View>
          )}
        </View>

        {/* Prompt Optimizer Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowOptimizer(!showOptimizer)}
            testID="toggle-optimizer-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showOptimizer ? 'Hide Optimizer' : 'Show Optimizer'}
            </Text>
          </TouchableOpacity>
          
          {showOptimizer && (
            <View style={{ height: 600 }}>
              <PromptOptimizer 
                prompt={content}
                category={category}
                onOptimizedPrompt={handleOptimizedPrompt}
                testID="prompt-optimizer"
              />
            </View>
          )}
        </View>

        {/* Advanced Analytics Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            testID="toggle-advanced-analytics-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showAdvancedAnalytics ? 'Hide Advanced Analytics' : 'Show Advanced Analytics'}
            </Text>
          </TouchableOpacity>
          
          {showAdvancedAnalytics && (
            <View style={{ height: 500 }}>
              <AdvancedAnalytics testID="advanced-analytics" />
            </View>
          )}
        </View>

        {/* AI Chat Companion Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.suggestionsHeader}
            onPress={() => setShowChatCompanion(!showChatCompanion)}
            testID="toggle-chat-companion-button"
          >
            <Text style={styles.suggestionsTitle}>
              {showChatCompanion ? 'Hide AI Assistant' : 'Show AI Assistant'}
            </Text>
          </TouchableOpacity>
          
          {showChatCompanion && (
            <View style={{ height: 400 }}>
              <PromptChatCompanion 
                onPromptSuggestion={handleChatSuggestion}
                testID="prompt-chat-companion"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Prompt"
          onPress={handleSave}
          variant="primary"
          style={styles.saveButton}
          testID="save-button"
        />
        <Button
          title="Share"
          onPress={handleShare}
          variant="outline"
          style={styles.shareButton}
          testID="share-button"
        />
      </View>
    </KeyboardAvoidingView>
  );
}