import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Sparkles, 
  BookOpen, 
  Brain, 
  Rocket, 
  Zap, 
  Star, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Folder, 
  BarChart3, 
  Settings, 
  Plus, 
  Eye, 
  Heart, 
  Clock, 
  Target,
  Lightbulb,
  Award,
  Globe
} from 'lucide-react-native';
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
import { usePromptStore } from '@/hooks/usePromptStore';
import templates from '@/mocks/templates';
import EnhancedPromptEditor from '@/components/EnhancedPromptEditor';
import AIAssistant from '@/components/AIAssistant';
import CollaborationHub from '@/components/CollaborationHub';
import WorkspaceManager from '@/components/WorkspaceManager';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';

interface QuickStat {
  id: string;
  title: string;
  value: number;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface RecentActivity {
  id: string;
  type: 'created' | 'edited' | 'shared' | 'collaborated';
  title: string;
  timestamp: string;
  icon: any;
  color: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const { trackOperation, trackNavigation } = usePerformanceMonitor('HomeScreen');
  const { trackButtonPress, trackScreenView } = useInteractionTracking();
  const { savedPrompts } = usePromptStore();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'editor' | 'assistant' | 'collaboration' | 'workspace' | 'analytics' | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [greeting, setGreeting] = useState<string>('');
  
  const screenWidth = Dimensions.get('window').width;

  // Track screen view and initialize data
  useEffect(() => {
    trackScreenView('home');
    initializeDashboard();
  }, [trackScreenView]);
  
  const initializeDashboard = useCallback(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    let greetingText = 'Good morning';
    if (hour >= 12 && hour < 17) greetingText = 'Good afternoon';
    else if (hour >= 17) greetingText = 'Good evening';
    setGreeting(greetingText);
    
    // Initialize quick stats
    const stats: QuickStat[] = [
      {
        id: 'prompts',
        title: 'Total Prompts',
        value: savedPrompts.length,
        change: '+12%',
        icon: BookOpen,
        color: theme.primary,
        trend: 'up'
      },
      {
        id: 'templates',
        title: 'Templates Used',
        value: 23,
        change: '+8%',
        icon: Star,
        color: theme.accent1,
        trend: 'up'
      },
      {
        id: 'collaborations',
        title: 'Collaborations',
        value: 7,
        change: '+15%',
        icon: Users,
        color: theme.accent2,
        trend: 'up'
      },
      {
        id: 'optimizations',
        title: 'AI Optimizations',
        value: 34,
        change: '+23%',
        icon: Zap,
        color: theme.accent3,
        trend: 'up'
      }
    ];
    setQuickStats(stats);
    
    // Initialize recent activity
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'created',
        title: 'Marketing Campaign Prompt',
        timestamp: '2 hours ago',
        icon: Plus,
        color: theme.success
      },
      {
        id: '2',
        type: 'collaborated',
        title: 'Technical Documentation Template',
        timestamp: '4 hours ago',
        icon: Users,
        color: theme.accent2
      },
      {
        id: '3',
        type: 'edited',
        title: 'Creative Writing Prompt',
        timestamp: '1 day ago',
        icon: Brain,
        color: theme.accent1
      },
      {
        id: '4',
        type: 'shared',
        title: 'Business Strategy Template',
        timestamp: '2 days ago',
        icon: Globe,
        color: theme.accent4
      }
    ];
    setRecentActivity(activities);
  }, [savedPrompts.length, theme]);

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
    
    setActiveModal('editor');
    endTiming();
  }, [trackNavigation, trackButtonPress]);
  
  const openAIAssistant = useCallback(() => {
    const endTiming = trackNavigation('ai-assistant');
    trackButtonPress('open-ai-assistant');
    
    setActiveModal('assistant');
    endTiming();
  }, [trackNavigation, trackButtonPress]);
  
  const openCollaboration = useCallback(() => {
    const endTiming = trackNavigation('collaboration');
    trackButtonPress('open-collaboration');
    
    setActiveModal('collaboration');
    endTiming();
  }, [trackNavigation, trackButtonPress]);
  
  const openWorkspaces = useCallback(() => {
    const endTiming = trackNavigation('workspaces');
    trackButtonPress('open-workspaces');
    
    setActiveModal('workspace');
    endTiming();
  }, [trackNavigation, trackButtonPress]);
  
  const openAnalytics = useCallback(() => {
    const endTiming = trackNavigation('analytics');
    trackButtonPress('open-analytics');
    
    setActiveModal('analytics');
    endTiming();
  }, [trackNavigation, trackButtonPress]);

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
  
  const handlePromptSave = useCallback((prompt: string, analytics: any) => {
    console.log('Saving prompt:', prompt, analytics);
    setActiveModal(null);
    showSuccess('Prompt saved successfully!');
  }, [showSuccess]);
  
  const handlePromptShare = useCallback((prompt: string) => {
    console.log('Sharing prompt:', prompt);
    showSuccess('Prompt shared!');
  }, [showSuccess]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    heroSection: {
      paddingTop: layout.spacing.xl,
      paddingBottom: layout.spacing.lg,
      paddingHorizontal: layout.spacing.lg,
    },
    greetingContainer: {
      marginBottom: layout.spacing.xl,
    },
    greetingText: {
      fontSize: layout.typography.sizes.title1,
      fontWeight: layout.typography.weights.bold,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    greetingSubtext: {
      fontSize: layout.typography.sizes.body,
      color: theme.textSecondary,
      opacity: 0.8,
    },
    quickStatsContainer: {
      marginBottom: layout.spacing.xl,
    },
    quickStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.md,
    },
    quickStatCard: {
      width: (screenWidth - layout.spacing.lg * 2 - layout.spacing.md) / 2,
      padding: layout.spacing.lg,
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.border,
    },
    quickStatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.sm,
    },
    quickStatIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickStatValue: {
      fontSize: layout.typography.sizes.title2,
      fontWeight: layout.typography.weights.bold,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    quickStatTitle: {
      fontSize: layout.typography.sizes.footnote,
      color: theme.textSecondary,
      marginBottom: layout.spacing.xs,
    },
    quickStatChange: {
      fontSize: layout.typography.sizes.caption1,
      fontWeight: layout.typography.weights.semibold,
      color: theme.success,
    },
    quickActionsContainer: {
      marginBottom: layout.spacing.xl,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    quickActionCard: {
      width: (screenWidth - layout.spacing.lg * 2 - layout.spacing.sm * 2) / 3,
      aspectRatio: 1,
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    quickActionIcon: {
      marginBottom: layout.spacing.sm,
    },
    quickActionText: {
      fontSize: layout.typography.sizes.caption1,
      fontWeight: layout.typography.weights.medium,
      color: theme.text,
      textAlign: 'center',
    },
    recentActivityContainer: {
      marginBottom: layout.spacing.xl,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.lg,
      marginBottom: layout.spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: layout.spacing.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: layout.typography.sizes.subheadline,
      fontWeight: layout.typography.weights.medium,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    activityTime: {
      fontSize: layout.typography.sizes.caption1,
      color: theme.textSecondary,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
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
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}! 👋</Text>
            <Text style={styles.greetingSubtext}>
              Ready to create amazing prompts? Let&apos;s get started.
            </Text>
          </View>
          
          <View style={styles.quickStatsContainer}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.quickStatsGrid}>
              {quickStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.id} style={styles.quickStatCard}>
                    <View style={styles.quickStatHeader}>
                      <View style={[styles.quickStatIcon, { backgroundColor: stat.color + '20' }]}>
                        <IconComponent size={18} color={stat.color} />
                      </View>
                      <TrendingUp size={14} color={theme.success} />
                    </View>
                    <Text style={styles.quickStatValue}>{stat.value}</Text>
                    <Text style={styles.quickStatTitle}>{stat.title}</Text>
                    <Text style={styles.quickStatChange}>{stat.change}</Text>
                  </Card>
                );
              })}
            </View>
          </View>
          
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} onPress={navigateToNewPrompt}>
                <View style={styles.quickActionIcon}>
                  <Plus size={24} color={theme.primary} />
                </View>
                <Text style={styles.quickActionText}>New Prompt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={openAIAssistant}>
                <View style={styles.quickActionIcon}>
                  <MessageCircle size={24} color={theme.accent1} />
                </View>
                <Text style={styles.quickActionText}>AI Assistant</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={navigateToTemplates}>
                <View style={styles.quickActionIcon}>
                  <BookOpen size={24} color={theme.accent2} />
                </View>
                <Text style={styles.quickActionText}>Templates</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={openWorkspaces}>
                <View style={styles.quickActionIcon}>
                  <Folder size={24} color={theme.accent3} />
                </View>
                <Text style={styles.quickActionText}>Workspaces</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={openCollaboration}>
                <View style={styles.quickActionIcon}>
                  <Users size={24} color={theme.accent4} />
                </View>
                <Text style={styles.quickActionText}>Collaborate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={openAnalytics}>
                <View style={styles.quickActionIcon}>
                  <BarChart3 size={24} color={theme.success} />
                </View>
                <Text style={styles.quickActionText}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.recentActivityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                    <IconComponent size={18} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.timestamp}</Text>
                  </View>
                </View>
              );
            })}
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
      
      {/* Enhanced Prompt Editor Modal */}
      <Modal
        visible={activeModal === 'editor'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalContainer}>
          <EnhancedPromptEditor
            onSave={(prompt, analytics) => {
              console.log('Prompt saved:', prompt, analytics);
              setActiveModal(null);
              showSuccess('Prompt saved successfully!');
            }}
            onShare={(prompt) => {
              console.log('Prompt shared:', prompt);
              showSuccess('Prompt shared!');
            }}
          />
        </View>
      </Modal>
      
      {/* AI Assistant Modal */}
      <Modal
        visible={activeModal === 'assistant'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalContainer}>
          <AIAssistant
            onPromptSuggestion={(prompt) => {
              console.log('AI suggested prompt:', prompt);
              setActiveModal('editor');
            }}
            category={selectedCategory || 'writing'}
          />
        </View>
      </Modal>
      
      {/* Collaboration Hub Modal */}
      <Modal
        visible={activeModal === 'collaboration'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalContainer}>
          <CollaborationHub />
        </View>
      </Modal>
      
      {/* Workspace Manager Modal */}
      <Modal
        visible={activeModal === 'workspace'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalContainer}>
          <WorkspaceManager />
        </View>
      </Modal>
      
      {/* Advanced Analytics Modal */}
      <Modal
        visible={activeModal === 'analytics'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalContainer}>
          <AdvancedAnalytics />
        </View>
      </Modal>
    </AnimatedBackground>
  );
}