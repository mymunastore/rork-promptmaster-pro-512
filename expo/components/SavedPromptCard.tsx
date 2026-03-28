import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SavedPrompt } from '@/types/prompt';
import Card from './Card';
import layout from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';
import { Heart, Edit, Share2 } from 'lucide-react-native';

interface SavedPromptCardProps {
  prompt: SavedPrompt;
  onPress: (prompt: SavedPrompt) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onShare: (prompt: SavedPrompt) => void;
  testID?: string;
}

const SavedPromptCard: React.FC<SavedPromptCardProps> = ({ 
  prompt, 
  onPress, 
  onToggleFavorite,
  onShare,
  testID 
}) => {
  const { theme } = useTheme();
  
  const formattedDate = new Date(prompt.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const styles = StyleSheet.create({
    card: {
      marginBottom: layout.spacing.md,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: layout.spacing.xs,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      flex: 1,
    },
    date: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
    },
    content: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: layout.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      marginBottom: layout.spacing.sm,
    },
    categoryTag: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs / 2,
      borderRadius: layout.borderRadius.sm,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
    },
    categoryText: {
      color: theme.background,
      fontSize: 12,
      fontWeight: '500' as const,
    },
    tag: {
      backgroundColor: theme.background,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs / 2,
      borderRadius: layout.borderRadius.sm,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    actions: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: layout.spacing.sm,
      marginTop: layout.spacing.xs,
    },
    actionButton: {
      padding: layout.spacing.xs,
      marginLeft: layout.spacing.sm,
    },
  });

  return (
    <Card style={styles.card} testID={testID}>
      <TouchableOpacity 
        onPress={() => onPress(prompt)} 
        activeOpacity={0.7}
        style={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{prompt.title}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <Text style={styles.content} numberOfLines={3}>
          {prompt.content}
        </Text>
        
        <View style={styles.tagsContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{prompt.category}</Text>
          </View>
          {prompt.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onToggleFavorite(prompt.id, !prompt.isFavorite)}
          testID={`favorite-button-${prompt.id}`}
        >
          <Heart 
            size={20} 
            color={prompt.isFavorite ? theme.error : theme.textSecondary}
            fill={prompt.isFavorite ? theme.error : 'transparent'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onPress(prompt)}
          testID={`edit-button-${prompt.id}`}
        >
          <Edit size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onShare(prompt)}
          testID={`share-button-${prompt.id}`}
        >
          <Share2 size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default SavedPromptCard;