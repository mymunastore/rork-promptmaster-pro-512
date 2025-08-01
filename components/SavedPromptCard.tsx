import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SavedPrompt } from '@/types/prompt';
import Card from './Card';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
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
  const formattedDate = new Date(prompt.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
        >
          <Heart 
            size={20} 
            color={prompt.isFavorite ? colors.error : colors.textSecondary}
            fill={prompt.isFavorite ? colors.error : 'transparent'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onPress(prompt)}
        >
          <Edit size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onShare(prompt)}
        >
          <Share2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: layout.spacing.sm,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: layout.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: layout.spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs / 2,
    borderRadius: layout.borderRadius.sm,
    marginRight: layout.spacing.xs,
    marginBottom: layout.spacing.xs,
  },
  categoryText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '500',
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs / 2,
    borderRadius: layout.borderRadius.sm,
    marginRight: layout.spacing.xs,
    marginBottom: layout.spacing.xs,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.spacing.sm,
    marginTop: layout.spacing.xs,
  },
  actionButton: {
    padding: layout.spacing.xs,
    marginLeft: layout.spacing.sm,
  },
});

export default SavedPromptCard;