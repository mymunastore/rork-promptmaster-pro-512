import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Switch,
  ActivityIndicator
} from 'react-native';
import {
  Folder,
  Plus,
  Edit3,
  Trash2,
  Star,
  Users,
  Lock,
  Unlock,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Share2,
  Download,
  Upload,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag,
  Archive,
  Copy
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PromptCategory, SavedPrompt } from '@/types/prompt';
import { usePromptStore } from '@/hooks/usePromptStore';

interface WorkspaceManagerProps {
  testID?: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isPrivate: boolean;
  isFavorite: boolean;
  promptCount: number;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category?: PromptCategory;
}

interface WorkspacePrompt extends SavedPrompt {
  workspaceId: string;
  position: number;
  isArchived: boolean;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ testID }) => {
  const { theme } = useTheme();
  const { savedPrompts } = usePromptStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspacePrompts, setWorkspacePrompts] = useState<WorkspacePrompt[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'private' | 'shared'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'prompts'>('updated');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form states
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [workspaceDescription, setWorkspaceDescription] = useState<string>('');
  const [workspaceColor, setWorkspaceColor] = useState<string>(theme.primary);
  const [workspaceIcon, setWorkspaceIcon] = useState<string>('folder');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [workspaceTags, setWorkspaceTags] = useState<string>('');

  const workspaceColors = [
    theme.primary,
    theme.accent1,
    theme.accent2,
    theme.accent3,
    theme.accent4,
    theme.success,
    theme.error,
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7'
  ];

  const workspaceIcons = [
    'folder',
    'star',
    'users',
    'tag',
    'calendar',
    'archive',
    'settings'
  ];

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      // Mock workspaces - in real app, load from storage/API
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'Marketing Campaigns',
          description: 'All marketing-related prompts and templates',
          color: theme.accent1,
          icon: 'star',
          isPrivate: false,
          isFavorite: true,
          promptCount: 15,
          collaborators: ['user1', 'user2'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-23T14:30:00Z',
          tags: ['marketing', 'campaigns', 'social-media'],
          category: 'marketing'
        },
        {
          id: '2',
          name: 'Development Docs',
          description: 'Technical documentation and code prompts',
          color: theme.accent2,
          icon: 'folder',
          isPrivate: true,
          isFavorite: false,
          promptCount: 8,
          collaborators: ['user1'],
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-22T16:45:00Z',
          tags: ['development', 'documentation', 'code'],
          category: 'development'
        },
        {
          id: '3',
          name: 'Creative Writing',
          description: 'Story ideas, character development, and creative prompts',
          color: theme.accent3,
          icon: 'users',
          isPrivate: false,
          isFavorite: true,
          promptCount: 23,
          collaborators: ['user1', 'user2', 'user3'],
          createdAt: '2024-01-05T11:30:00Z',
          updatedAt: '2024-01-24T09:15:00Z',
          tags: ['writing', 'creative', 'stories'],
          category: 'writing'
        }
      ];
      
      setWorkspaces(mockWorkspaces);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      Alert.alert('Error', 'Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkspace = useCallback(async () => {
    if (!workspaceName.trim()) {
      Alert.alert('Error', 'Please enter a workspace name');
      return;
    }

    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name: workspaceName.trim(),
      description: workspaceDescription.trim(),
      color: workspaceColor,
      icon: workspaceIcon,
      isPrivate,
      isFavorite: false,
      promptCount: 0,
      collaborators: ['user1'], // Current user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: workspaceTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setShowCreateModal(false);
    resetForm();
    Alert.alert('Success', 'Workspace created successfully!');
  }, [workspaceName, workspaceDescription, workspaceColor, workspaceIcon, isPrivate, workspaceTags]);

  const updateWorkspace = useCallback(async () => {
    if (!selectedWorkspace || !workspaceName.trim()) {
      Alert.alert('Error', 'Please enter a workspace name');
      return;
    }

    const updatedWorkspace: Workspace = {
      ...selectedWorkspace,
      name: workspaceName.trim(),
      description: workspaceDescription.trim(),
      color: workspaceColor,
      icon: workspaceIcon,
      isPrivate,
      updatedAt: new Date().toISOString(),
      tags: workspaceTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    setWorkspaces(prev => prev.map(ws => ws.id === selectedWorkspace.id ? updatedWorkspace : ws));
    setShowEditModal(false);
    setSelectedWorkspace(null);
    resetForm();
    Alert.alert('Success', 'Workspace updated successfully!');
  }, [selectedWorkspace, workspaceName, workspaceDescription, workspaceColor, workspaceIcon, isPrivate, workspaceTags]);

  const deleteWorkspace = useCallback((workspace: Workspace) => {
    Alert.alert(
      'Delete Workspace',
      `Are you sure you want to delete "${workspace.name}"? This will also remove all prompts in this workspace.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWorkspaces(prev => prev.filter(ws => ws.id !== workspace.id));
            Alert.alert('Success', 'Workspace deleted successfully');
          }
        }
      ]
    );
  }, []);

  const toggleFavorite = useCallback((workspaceId: string) => {
    setWorkspaces(prev => prev.map(ws => 
      ws.id === workspaceId ? { ...ws, isFavorite: !ws.isFavorite } : ws
    ));
  }, []);

  const duplicateWorkspace = useCallback((workspace: Workspace) => {
    const duplicatedWorkspace: Workspace = {
      ...workspace,
      id: `workspace-${Date.now()}`,
      name: `${workspace.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };

    setWorkspaces(prev => [...prev, duplicatedWorkspace]);
    Alert.alert('Success', 'Workspace duplicated successfully!');
  }, []);

  const resetForm = () => {
    setWorkspaceName('');
    setWorkspaceDescription('');
    setWorkspaceColor(theme.primary);
    setWorkspaceIcon('folder');
    setIsPrivate(false);
    setWorkspaceTags('');
  };

  const openEditModal = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setWorkspaceName(workspace.name);
    setWorkspaceDescription(workspace.description);
    setWorkspaceColor(workspace.color);
    setWorkspaceIcon(workspace.icon);
    setIsPrivate(workspace.isPrivate);
    setWorkspaceTags(workspace.tags.join(', '));
    setShowEditModal(true);
  };

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = searchQuery === '' || 
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'favorites' && workspace.isFavorite) ||
      (filterBy === 'private' && workspace.isPrivate) ||
      (filterBy === 'shared' && !workspace.isPrivate);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'prompts':
        return b.promptCount - a.promptCount;
      default:
        return 0;
    }
  });

  const renderWorkspaceCard = ({ item }: { item: Workspace }) => (
    <Card style={[styles.workspaceCard, viewMode === 'list' && styles.workspaceCardList]}>
      <TouchableOpacity
        style={styles.workspaceContent}
        onPress={() => {
          setSelectedWorkspace(item);
          setShowPromptModal(true);
        }}
      >
        <View style={styles.workspaceHeader}>
          <View style={[styles.workspaceIcon, { backgroundColor: item.color + '20' }]}>
            <Folder size={24} color={item.color} />
          </View>
          <View style={styles.workspaceInfo}>
            <View style={styles.workspaceTitleRow}>
              <Text style={styles.workspaceTitle}>{item.name}</Text>
              <View style={styles.workspaceStatus}>
                {item.isFavorite && <Star size={14} color={theme.accent3} fill={theme.accent3} />}
                {item.isPrivate ? (
                  <Lock size={14} color={theme.textSecondary} />
                ) : (
                  <Users size={14} color={theme.textSecondary} />
                )}
              </View>
            </View>
            <Text style={styles.workspaceDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.workspaceMeta}>
              <Text style={styles.workspaceMetaText}>
                {item.promptCount} prompts • {item.collaborators.length} collaborators
              </Text>
              <Text style={styles.workspaceDate}>
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        
        {item.tags.length > 0 && (
          <View style={styles.workspaceTags}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.workspaceTag, { backgroundColor: item.color + '15' }]}>
                <Text style={[styles.workspaceTagText, { color: item.color }]}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.workspaceTagMore}>+{item.tags.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.workspaceActions}>
        <TouchableOpacity
          style={styles.workspaceActionButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Star size={16} color={item.isFavorite ? theme.accent3 : theme.textSecondary} fill={item.isFavorite ? theme.accent3 : 'none'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.workspaceActionButton}
          onPress={() => openEditModal(item)}
        >
          <Edit3 size={16} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.workspaceActionButton}
          onPress={() => duplicateWorkspace(item)}
        >
          <Copy size={16} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.workspaceActionButton}
          onPress={() => deleteWorkspace(item)}
        >
          <Trash2 size={16} color={theme.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text style={styles.formLabel}>Color</Text>
      <View style={styles.colorGrid}>
        {workspaceColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              workspaceColor === color && styles.colorOptionSelected
            ]}
            onPress={() => setWorkspaceColor(color)}
          />
        ))}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: layout.spacing.lg,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    headerButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
    },
    createButton: {
      backgroundColor: theme.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
    workspaceCard: {
      marginBottom: layout.spacing.md,
      padding: layout.spacing.lg,
    },
    workspaceCardList: {
      marginBottom: layout.spacing.sm,
    },
    workspaceContent: {
      marginBottom: layout.spacing.md,
    },
    workspaceHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    workspaceIcon: {
      width: 48,
      height: 48,
      borderRadius: layout.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: layout.spacing.md,
    },
    workspaceInfo: {
      flex: 1,
    },
    workspaceTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.xs,
    },
    workspaceTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      flex: 1,
    },
    workspaceStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.xs,
    },
    workspaceDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: layout.spacing.sm,
    },
    workspaceMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    workspaceMetaText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    workspaceDate: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    workspaceTags: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: layout.spacing.xs,
    },
    workspaceTag: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.round,
    },
    workspaceTagText: {
      fontSize: 11,
      fontWeight: '500' as const,
    },
    workspaceTagMore: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    workspaceActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: layout.spacing.md,
    },
    workspaceActionButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
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
    formGroup: {
      marginBottom: layout.spacing.lg,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    formInput: {
      backgroundColor: theme.background,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.md,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    formTextArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    switchLabel: {
      fontSize: 16,
      color: theme.text,
    },
    colorPicker: {
      marginBottom: layout.spacing.lg,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.sm,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: theme.text,
    },
    modalActions: {
      flexDirection: 'row',
      gap: layout.spacing.sm,
      marginTop: layout.spacing.lg,
    },
    modalButton: {
      flex: 1,
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
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.emptyStateText, { marginTop: layout.spacing.md }]}>
          Loading workspaces...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Folder size={24} color={theme.primary} />
          <Text style={styles.headerTitle}>Workspaces</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, viewMode === 'grid' && { backgroundColor: theme.primary }]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={18} color={viewMode === 'grid' ? theme.card : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, viewMode === 'list' && { backgroundColor: theme.primary }]}
            onPress={() => setViewMode('list')}
          >
            <List size={18} color={viewMode === 'list' ? theme.card : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.createButton]}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={18} color={theme.card} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search workspaces..."
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
        data={filteredWorkspaces}
        renderItem={renderWorkspaceCard}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 1 : 1}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Folder size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              No workspaces found. Create your first workspace to organize your prompts.
            </Text>
            <Button
              title="Create Workspace"
              variant="primary"
              onPress={() => setShowCreateModal(true)}
              style={{ marginTop: layout.spacing.lg }}
            />
          </View>
        }
      />

      {/* Create Workspace Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Workspace</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={{ color: theme.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter workspace name"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceName}
                  onChangeText={setWorkspaceName}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Describe your workspace"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceDescription}
                  onChangeText={setWorkspaceDescription}
                  multiline
                />
              </View>
              
              {renderColorPicker()}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tags</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter tags separated by commas"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceTags}
                  onChangeText={setWorkspaceTags}
                />
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Private Workspace</Text>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: theme.border, true: theme.primaryLight }}
                    thumbColor={isPrivate ? theme.primary : theme.card}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowCreateModal(false)}
              />
              <Button
                title="Create"
                variant="primary"
                style={styles.modalButton}
                onPress={createWorkspace}
                disabled={!workspaceName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Workspace</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={{ color: theme.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter workspace name"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceName}
                  onChangeText={setWorkspaceName}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Describe your workspace"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceDescription}
                  onChangeText={setWorkspaceDescription}
                  multiline
                />
              </View>
              
              {renderColorPicker()}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tags</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter tags separated by commas"
                  placeholderTextColor={theme.textSecondary}
                  value={workspaceTags}
                  onChangeText={setWorkspaceTags}
                />
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Private Workspace</Text>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: theme.border, true: theme.primaryLight }}
                    thumbColor={isPrivate ? theme.primary : theme.card}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowEditModal(false)}
              />
              <Button
                title="Update"
                variant="primary"
                style={styles.modalButton}
                onPress={updateWorkspace}
                disabled={!workspaceName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WorkspaceManager;