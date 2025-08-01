import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircle, Sparkles, BookOpen, Wand2, Brain, Rocket } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TemplateCard from '@/components/TemplateCard';
import CategorySelector from '@/components/CategorySelector';
import AnimatedBackground from '@/components/AnimatedBackground';
import { PromptCategory, PromptTemplate } from '@/types/prompt';
import templates from '@/mocks/templates';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);

  const filteredTemplates = selectedCategory 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const featuredTemplates = filteredTemplates.slice(0, 3);

  const handleTemplatePress = (template: PromptTemplate) => {
    router.push({
      pathname: '/prompt/editor',
      params: { templateId: template.id }
    });
  };

  const navigateToNewPrompt = () => {
    router.push('/prompt/editor');
  };

  const navigateToTemplates = () => {
    router.push('/(tabs)/templates');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    contentContainer: {
      paddingBottom: layout.spacing.xxl,
    },
    heroSection: {
      paddingTop: layout.spacing.xxl,
      paddingBottom: layout.spacing.xl,
      paddingHorizontal: layout.spacing.lg,
      alignItems: 'center',
    },
    heroContent: {
      alignItems: 'center',
      maxWidth: 400,
    },
    heroIcon: {
      marginBottom: layout.spacing.md,
    },
    heroTitle: {
      fontSize: layout.typography.sizes.largeTitle,
      fontWeight: layout.typography.weights.heavy,
      color: theme.text,
      textAlign: 'center',
      marginBottom: layout.spacing.sm,
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: layout.typography.sizes.callout,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: layout.spacing.xl,
      lineHeight: 22,
      letterSpacing: -0.2,
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
      padding: layout.spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginHorizontal: layout.spacing.lg,
      borderRadius: layout.borderRadius.xl,
      marginBottom: layout.spacing.lg,
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
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: layout.borderRadius.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    featureIconContainer: {
      width: 56,
      height: 56,
      borderRadius: layout.borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: layout.spacing.md,
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
      paddingHorizontal: layout.spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      marginHorizontal: layout.spacing.lg,
      borderRadius: layout.borderRadius.xl,
      paddingVertical: layout.spacing.lg,
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
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.lg,
      marginBottom: layout.spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary + '40',
      borderStyle: 'dashed',
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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="home-screen"
      >
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Wand2 size={48} color={theme.primary} style={styles.heroIcon} />
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
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent1 + '20' }]}>
                <Brain size={28} color={theme.accent1} />
              </View>
              <Text style={styles.featureTitle}>Smart Templates</Text>
              <Text style={styles.featureDescription}>
                AI-powered templates for every industry and use case
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent2 + '20' }]}>
                <Rocket size={28} color={theme.accent2} />
              </View>
              <Text style={styles.featureTitle}>Optimization</Text>
              <Text style={styles.featureDescription}>
                Real-time suggestions to maximize AI performance
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent3 + '20' }]}>
                <Sparkles size={28} color={theme.accent3} />
              </View>
              <Text style={styles.featureTitle}>Advanced Tools</Text>
              <Text style={styles.featureDescription}>
                Keyword analysis, topic suggestions, and more
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accent4 + '20' }]}>
                <BookOpen size={28} color={theme.accent4} />
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
            onSelectCategory={setSelectedCategory}
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
              <PlusCircle size={32} color={theme.primary} />
              <Text style={styles.createNewText}>Create Custom Prompt</Text>
              <Text style={styles.createNewDescription}>
                Start from scratch with your own prompt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
}