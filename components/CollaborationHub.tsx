import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  Share,
  Platform
} from 'react-native';
import {
  Users,
  MessageCircle,
  Share2,
  Star,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  TrendingUp,
  Award,
  Heart,
  BookOpen,
  Zap,
  Crown,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PromptCategory, CommunityTemplate } from '@/types/prompt';
import { trpc } from '@/lib/trpc';

interface CollaborationHubProps {
  testID?: string;
}

interface CommunityPrompt extends CommunityTemplate {
  comments: Comment[];
  likes: number;
  isLiked: boolean;
  collaborators: string[];
  forkCount: number;
  lastUpdated: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface CollaborationRequest {
  id: string;
  promptId: string;
  promptTitle: string;
  requester: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ testID }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'discover' | 'collaborate' | 'requests' | 'my-shared'>('discover');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'popular' | 'rating'>('trending');
  const [communityPrompts, setCommunityPrompts] = useState<CommunityPrompt[]>([]);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<CommunityPrompt | null>(null);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [showCollabModal, setShowCollabModal] = useState<boolean>(false);
  const [collabMessage, setCollabMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      // Mock community prompts
      const mockPrompts: CommunityPrompt[] = [
        {
          id: '1',
          title: 'Advanced Marketing Copy Generator',
          description: 'Create compelling marketing copy for any product or service with psychological triggers',
          template: 'Create marketing copy for [PRODUCT] targeting [AUDIENCE] with [TONE]. Include emotional triggers and call-to-action.',
          category: 'marketing',
          tags: ['marketing', 'copywriting', 'psychology', 'conversion'],
          author: 'MarketingPro',
          authorId: 'user1',
          rating: 4.8,
          downloads: 1250,
          isVerified: true,
          publishedAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z',
          comments: [
            {
              id: 'c1',
              author: 'ContentCreator',
              content: 'This template has increased my conversion rates by 40%! Amazing work.',
              timestamp: '2024-01-18T09:15:00Z',
              likes: 12,
              isLiked: false
            }
          ],
          likes: 89,
          isLiked: false,
          collaborators: ['MarketingPro', 'CopyExpert', 'ConversionGuru'],
          forkCount: 23,
          lastUpdated: '2024-01-20T15:30:00Z'
        },
        {
          id: '2',
          title: 'Technical Documentation Assistant',
          description: 'Generate clear, comprehensive technical documentation for any software project',
          template: 'Create technical documentation for [PROJECT] including [SECTIONS]. Use clear language and include code examples.',
          category: 'development',
          tags: ['documentation', 'technical-writing', 'software', 'development'],
          author: 'DevDocMaster',
          authorId: 'user2',
          rating: 4.6,
          downloads: 890,
          isVerified: true,
          publishedAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-22T11:45:00Z',
          comments: [
            {
              id: 'c2',
              author: 'TechWriter',
              content: 'Perfect for API documentation. Saved me hours of work!',
              timestamp: '2024-01-21T16:30:00Z',
              likes: 8,
              isLiked: true
            }
          ],
          likes: 67,
          isLiked: true,
          collaborators: ['DevDocMaster', 'APIExpert'],
          forkCount: 15,
          lastUpdated: '2024-01-22T11:45:00Z'
        }
      ];

      const mockRequests: CollaborationRequest[] = [
        {
          id: 'req1',
          promptId: '1',
          promptTitle: 'Advanced Marketing Copy Generator',
          requester: 'NewMarketer',
          message: 'I\'d love to collaborate on adding e-commerce specific variations to this template.',
          status: 'pending',
          timestamp: '2024-01-23T10:30:00Z'
        }
      ];

      setCommunityPrompts(mockPrompts);
      setCollaborationRequests(mockRequests);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePrompt = useCallback((promptId: string) => {
    setCommunityPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, isLiked: !prompt.isLiked, likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1 }
        : prompt
    ));
  }, []);

  const handleForkPrompt = useCallback((prompt: CommunityPrompt) => {
    Alert.alert(
      'Fork Prompt',
      `Create your own version of "${prompt.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fork',
          onPress: () => {
            // In real app, this would create a copy in user's prompts
            Alert.alert('Success', 'Prompt forked to your collection!');
            setCommunityPrompts(prev => prev.map(p => 
              p.id === prompt.id ? { ...p, forkCount: p.forkCount + 1 } : p
            ));
          }
        }
      ]
    );
  }, []);

  const handleRequestCollaboration = useCallback(() => {
    if (!selectedPrompt || !collabMessage.trim()) {
      Alert.alert('Error', 'Please enter a collaboration message');
      return;
    }

    // In real app, this would send a request to the prompt author
    Alert.alert('Success', 'Collaboration request sent!');
    setShowCollabModal(false);
    setCollabMessage('');
  }, [selectedPrompt, collabMessage]);

  const handleSharePrompt = useCallback(async (prompt: CommunityPrompt) => {
    try {
      const shareContent = `Check out this amazing AI prompt: "${prompt.title}" by ${prompt.author}. Rating: ${prompt.rating}⭐`;
      
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(shareContent);
        Alert.alert('Copied!', 'Prompt details copied to clipboard');
      } else {
        await Share.share({
          message: shareContent,
          title: prompt.title
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share prompt');
    }
  }, []);

  const handleAddComment = useCallback(() => {
    if (!selectedPrompt || !newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: 'You',
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setCommunityPrompts(prev => prev.map(prompt => 
      prompt.id === selectedPrompt.id 
        ? { ...prompt, comments: [...prompt.comments, comment] }
        : prompt
    ));

    setNewComment('');
  }, [selectedPrompt, newComment]);

  const filteredPrompts = communityPrompts.filter(prompt => {
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.downloads) - (a.likes + a.downloads);
      case 'recent':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const renderPromptCard = ({ item }: { item: CommunityPrompt }) => (
    <Card style={styles.promptCard}>
      <TouchableOpacity
        onPress={() => {
          setSelectedPrompt(item);
          setShowPromptModal(true);
        }}
      >
        <View style={styles.promptHeader}>
          <View style={styles.promptTitleContainer}>
            <Text style={styles.promptTitle}>{item.title}</Text>
            {item.isVerified && <CheckCircle size={16} color={theme.success} />}
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color={theme.accent3} fill={theme.accent3} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.promptDescription}>{item.description}</Text>
        
        <View style={styles.promptMeta}>
          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>by {item.author}</Text>
            {item.isVerified && <Crown size={12} color={theme.accent3} />}
          </View>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        
        <View style={styles.promptStats}>
          <View style={styles.statItem}>
            <Download size={14} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.downloads}</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={14} color={theme.error} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={14} color={theme.primary} />
            <Text style={styles.statText}>{item.collaborators.length}</Text>
          </View>
          <View style={styles.statItem}>
            <BookOpen size={14} color={theme.accent2} />
            <Text style={styles.statText}>{item.forkCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.promptActions}>
        <TouchableOpacity
          style={[styles.actionButton, item.isLiked && styles.actionButtonActive]}
          onPress={() => handleLikePrompt(item.id)}
        >
          <Heart size={16} color={item.isLiked ? theme.card : theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleForkPrompt(item)}
        >
          <BookOpen size={16} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedPrompt(item);
            setShowCollabModal(true);
          }}
        >
          <Users size={16} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSharePrompt(item)}
        >
          <Share2 size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderCollabRequest = ({ item }: { item: CollaborationRequest }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.promptTitle}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'pending' ? theme.accent2 + '20' : theme.success + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'pending' ? theme.accent2 : theme.success }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.requesterText}>From: {item.requester}</Text>
      <Text style={styles.requestMessage}>{item.message}</Text>
      
      <View style={styles.requestActions}>
        <Button
          title="Accept"
          variant="primary"
          style={styles.requestActionButton}
          onPress={() => {
            Alert.alert('Success', 'Collaboration request accepted!');
            setCollaborationRequests(prev => prev.map(req => 
              req.id === item.id ? { ...req, status: 'accepted' } : req
            ));
          }}
        />
        <Button
          title="Decline"
          variant="outline"
          style={styles.requestActionButton}
          onPress={() => {
            Alert.alert('Request declined');
            setCollaborationRequests(prev => prev.map(req => 
              req.id === item.id ? { ...req, status: 'declined' } : req
            ));
          }}
        />
      </View>
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.lg,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      paddingVertical: layout.spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme.textSecondary,
    },
    activeTabText: {
      color: theme.primary,
      fontWeight: '600' as const,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      gap: layout.spacing.sm,
    },
    searchInput: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: layout.borderRadius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    content: {
      flex: 1,
      padding: layout.spacing.md,
    },
    promptCard: {
      marginBottom: layout.spacing.md,
      padding: layout.spacing.lg,
    },
    promptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    promptTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: layout.spacing.xs,
    },
    promptTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme.text,
    },
    promptDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: layout.spacing.md,
    },
    promptMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.md,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    authorText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    categoryText: {
      fontSize: 12,
      color: theme.primary,
      backgroundColor: theme.primary + '20',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.round,
      textTransform: 'capitalize',
    },
    promptStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    statText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    promptActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: layout.spacing.md,
    },
    actionButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
    },
    actionButtonActive: {
      backgroundColor: theme.error,
    },
    requestCard: {
      marginBottom: layout.spacing.md,
      padding: layout.spacing.lg,
    },
    requestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    requestTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.round,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600' as const,
      textTransform: 'capitalize',
    },
    requesterText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: layout.spacing.sm,
    },
    requestMessage: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      marginBottom: layout.spacing.lg,
    },
    requestActions: {
      flexDirection: 'row',
      gap: layout.spacing.sm,
    },
    requestActionButton: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: layout.borderRadius.xl,
      padding: layout.spacing.xl,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: layout.spacing.lg,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
    },
    commentInput: {
      backgroundColor: theme.background,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.md,
      fontSize: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: layout.spacing.sm,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: layout.spacing.xxl,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: layout.spacing.md,
    },
  });

  const tabs = [
    { id: 'discover' as const, label: 'Discover', icon: Globe },
    { id: 'collaborate' as const, label: 'Collaborate', icon: Users },
    { id: 'requests' as const, label: 'Requests', icon: MessageCircle },
    { id: 'my-shared' as const, label: 'My Shared', icon: Share2 },
  ];

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Users size={24} color={theme.primary} />
        <Text style={styles.headerTitle}>Collaboration Hub</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconComponent 
                size={18} 
                color={activeTab === tab.id ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'discover' && (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search community prompts..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.content}
            data={filteredPrompts}
            renderItem={renderPromptCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Search size={48} color={theme.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No prompts found. Try adjusting your search or filters.
                </Text>
              </View>
            }
          />
        </>
      )}

      {activeTab === 'requests' && (
        <FlatList
          style={styles.content}
          data={collaborationRequests}
          renderItem={renderCollabRequest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MessageCircle size={48} color={theme.textSecondary} />
              <Text style={styles.emptyStateText}>
                No collaboration requests yet.
              </Text>
            </View>
          }
        />
      )}

      {/* Prompt Detail Modal */}
      <Modal
        visible={showPromptModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPromptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPrompt?.title}</Text>
              <TouchableOpacity onPress={() => setShowPromptModal(false)}>
                <Text style={{ color: theme.primary }}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.promptDescription}>{selectedPrompt?.description}</Text>
              
              <View style={styles.commentInput}>
                <Text style={{ color: theme.text }}>{selectedPrompt?.template}</Text>
              </View>
              
              <Text style={[styles.modalTitle, { fontSize: 16, marginBottom: layout.spacing.md }]}>
                Comments ({selectedPrompt?.comments.length || 0})
              </Text>
              
              {selectedPrompt?.comments.map((comment) => (
                <View key={comment.id} style={[styles.requestCard, { marginBottom: layout.spacing.sm }]}>
                  <Text style={styles.authorText}>{comment.author}</Text>
                  <Text style={styles.requestMessage}>{comment.content}</Text>
                  <Text style={styles.requesterText}>
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))}
              
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor={theme.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              
              <Button
                title="Add Comment"
                variant="primary"
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Collaboration Request Modal */}
      <Modal
        visible={showCollabModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCollabModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Collaboration</Text>
              <TouchableOpacity onPress={() => setShowCollabModal(false)}>
                <Text style={{ color: theme.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.promptDescription}>
              Send a collaboration request to {selectedPrompt?.author} for "{selectedPrompt?.title}"
            </Text>
            
            <TextInput
              style={[styles.commentInput, { minHeight: 100 }]}
              placeholder="Describe how you'd like to collaborate..."
              placeholderTextColor={theme.textSecondary}
              value={collabMessage}
              onChangeText={setCollabMessage}
              multiline
              textAlignVertical="top"
            />
            
            <Button
              title="Send Request"
              variant="primary"
              onPress={handleRequestCollaboration}
              disabled={!collabMessage.trim()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CollaborationHub;