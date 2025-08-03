import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, BookOpen, Brain, Rocket, Zap, Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TemplateCard from '@/components/TemplateCard';
import CategorySelector from '@/components/CategorySelector';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ScrollableScreen } from '@/components/ScreenWrapper';
import { useToast } from '@/components/Toast';
import { usePerformanceMonitor, useInteractionTracking } from '@/hooks/usePerformanceMonitor';
import { PromptCategory, PromptTemplate } from '@/types/prompt';
import templates from '@/mocks/templates';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const { trackOperation, trackNavigation } = usePerformanceMonitor('HomeScreen');
  const { trackButtonPress, trackScreenView } = useInteractionTracking();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Track screen view
  React.useEffect(() => {
    trackScreenView('home');
  }, [trackScreenView]);

  const filteredTemplates = selectedCategory 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const featuredTemplates = filteredTemplates.slice(0, 3);

  const handleTemplatePress = useCallback((template: PromptTemplate) => {
    const endTiming = trackNavigation('prompt-editor');
    trackButtonPress('template-select', { templateId: template.id, category: template.category });
    
    router.push({
      pathname: '/prompt/editor',
      params: { templateId: template.id }
    });
    
    endTiming();
  }, [router, trackNavigation, trackButtonPress]);

  const navigateToNewPrompt = useCallback(() => {
    const endTiming = trackNavigation('new-prompt');
    trackButtonPress('create-new-prompt');
    
    router.push('/prompt/editor');
    endTiming();
  }, [router, trackNavigation, trackButtonPress]);

  const navigateToTemplates = useCallback(() => {
    const endTiming = trackNavigation('templates');
    trackButtonPress('browse-templates');
    
    router.push('/(tabs)/templates');
    endTiming();
  }, [router, trackNavigation, trackButtonPress]);

  const handleRefresh = useCallback(async () => {
    const endTiming = trackOperation('refresh-home');
    setRefreshing(true);
    
    try {
      // Simulate refresh operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Refreshed', 'Content has been updated');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
      endTiming();
    }
  }, [trackOperation, showSuccess]);

  const handleCategoryChange = useCallback((category: PromptCategory | null) => {
    trackButtonPress('category-filter', { category });
    setSelectedCategory(category);
  }, [trackButtonPress]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    heroSection: {
      paddingTop: layout.spacing.xxl + layout.spacing.lg,
      paddingBottom: layout.spacing.xl,
      paddingHorizontal: layout.spacing.lg,
      alignItems: 'center',
    },
    heroContent: {
      alignItems: 'center',
      maxWidth: 400,
    },
    heroIconContainer: {
      backgroundColor: theme.primary + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.md,
      marginBottom: layout.spacing.lg,
    },
    heroTitle: {
      fontSize: layout.typography.sizes.largeTitle + 4,
      fontWeight: layout.typography.weights.heavy,
      color: theme.text,
      textAlign: 'center',
      marginBottom: layout.spacing.sm,
      letterSpacing: -0.8,
    },
    heroSubtitle: {
      fontSize: layout.typography.sizes.subheadline,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: layout.spacing.xl,
      lineHeight: 24,
      letterSpacing: -0.3,
      opacity: 0.9,
    },
    heroButtons: {
      flexDirection: 'row',
      gap: layout.spacing.md,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    primaryButton: {
      minWidth: 140,
    },
    secondaryButton: {
      minWidth: 140,
    },
    featuresSection: {
      padding: layout.spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      marginHorizontal: layout.spacing.lg,
      borderRadius: layout.borderRadius.xl + 4,
      marginBottom: layout.spacing.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sectionTitle: {
      fontSize: layout.typography.sizes.title2,
      fontWeight: layout.typography.weights.bold,
      color: theme.text,
      marginBottom: layout.spacing.lg,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    featureCard: {
      width: '48%',
      marginBottom: layout.spacing.lg,
      alignItems: 'center',
      padding: layout.spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: layout.borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    featureIconContainer: {
      width: 64,
      height: 64,
      borderRadius: layout.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: layout.spacing.md,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    featureTitle: {
      fontSize: layout.typography.sizes.callout,
      fontWeight: layout.typography.weights.semibold,
      color: theme.text,
      marginBottom: layout.spacing.sm,
      textAlign: 'center',
      letterSpacing: -0.2,
    },
    featureDescription: {
      fontSize: layout.typography.sizes.footnote,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      letterSpacing: -0.1,
    },
    templatesSection: {
      paddingHorizontal: layout.spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      marginHorizontal: layout.spacing.lg,
      borderRadius: layout.borderRadius.xl + 4,
      paddingVertical: layout.spacing.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.lg,
    },
    viewAllText: {
      fontSize: layout.typography.sizes.subheadline,
      color: theme.primary,
      fontWeight: layout.typography.weights.semibold,
      letterSpacing: -0.1,
    },
    templatesList: {
      marginTop: layout.spacing.sm,
    },
    createNewCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: layout.borderRadius.xl,
      padding: layout.spacing.xl,
      marginBottom: layout.spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary + '30',
      borderStyle: 'dashed',
    },
    createNewIconContainer: {
      backgroundColor: theme.primary + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.sm,
      marginBottom: layout.spacing.md,
    },
    createNewText: {
      fontSize: layout.typography.sizes.callout,
      fontWeight: layout.typography.weights.semibold,
      color: theme.text,
      marginTop: layout.spacing.md,
      marginBottom: layout.spacing.xs,
      letterSpacing: -0.2,
    },
    createNewDescription: {
      fontSize: layout.typography.sizes.footnote,
      color: theme.textSecondary,
      textAlign: 'center',
      letterSpacing: -0.1,
    },
  });

  return (
    <AnimatedBackground variant="cosmic">
      <ScrollableScreen
        refreshing={refreshing}
        onRefresh={handleRefresh}
        testID="home-screen"
        safeArea={false}
        backgroundColor="transparent"
      >
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Zap size={32} color={theme.primary} />
            </View>
            <Text style={styles.heroTitle}>AI Prompt Studio</Text>
            <Text style={styles.heroSubtitle}>
              Create world-class AI prompts with professional templates, smart optimization, and advanced features
            </Text>
            <View style={styles.heroButtons}>
              <Button 
                title="Start Creating" 
                onPress={navigateToNewPrompt}
                variant="primary"
                style={styles.primaryButton}
                testID="create-prompt-button"
              />
              <Button 
                title="Browse Templates" 
                onPress={navigateToTemplates}
                variant="outline"
                style={styles.secondaryButton}
                testID="browse-templates-button"
              />
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>
          <View style={styles.featuresGrid}>
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent1 + '15' }]}>
                <Brain size={32} color={theme.accent1} />
              </View>
              <Text style={styles.featureTitle}>Smart Templates</Text>
              <Text style={styles.featureDescription}>
                AI-powered templates for every industry and use case
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent2 + '15' }]}>
                <Rocket size={32} color={theme.accent2} />
              </View>
              <Text style={styles.featureTitle}>Optimization</Text>
              <Text style={styles.featureDescription}>
                Real-time suggestions to maximize AI performance
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent3 + '15' }]}>
                <Sparkles size={32} color={theme.accent3} />
              </View>
              <Text style={styles.featureTitle}>Advanced Tools</Text>
              <Text style={styles.featureDescription}>
                Keyword analysis, topic suggestions, and more
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent4 + '15' }]}>
                <BookOpen size={32} color={theme.accent4} />
              </View>
              <Text style={styles.featureTitle}>Smart Library</Text>
              <Text style={styles.featureDescription}>
                Organize, search, and manage your prompt collection
              </Text>
            </Card>
          </View>
        </View>

        <View style={styles.templatesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Templates</Text>
            <TouchableOpacity onPress={navigateToTemplates}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <CategorySelector 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            testID="category-selector"
          />
          
          <View style={styles.templatesList}>
            {featuredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onPress={handleTemplatePress}
                testID={`template-card-${template.id}`}
              />
            ))}
            
            <TouchableOpacity 
              style={styles.createNewCard}
              onPress={navigateToNewPrompt}
              testID="create-new-card"
            >
              <View style={styles.createNewIconContainer}>
                <Star size={24} color={theme.primary} />
              </View>
              <Text style={styles.createNewText}>Create Custom Prompt</Text>
              <Text style={styles.createNewDescription}>
                Start from scratch with your own prompt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollableScreen>
    </AnimatedBackground>
  );
}