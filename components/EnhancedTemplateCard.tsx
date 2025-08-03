import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Star, Clock, Users, TrendingUp, Eye } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import { PromptTemplate } from '@/types/prompt';

interface EnhancedTemplateCardProps {
  template: PromptTemplate & {
    rating?: number;
    usageCount?: number;
    estimatedTime?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  onPress: (template: any) => void;
  testID?: string;
}

const EnhancedTemplateCard: React.FC<EnhancedTemplateCardProps> = ({ 
  template, 
  onPress, 
  testID 
}) => {
  const { theme } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.success;
      case 'intermediate': return theme.warning;
      case 'advanced': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} color={theme.warning} fill={theme.warning} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} color={theme.warning} fill={theme.warning} opacity={0.5} />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} color={theme.border} />
      );
    }
    
    return stars;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: layout.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginRight: layout.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    category: {
      fontSize: 12,
      color: theme.primary,
      textTransform: 'uppercase',
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
    difficultyBadge: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.backgroundLight,
    },
    difficultyText: {
      fontSize: 10,
      fontWeight: '600' as const,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: layout.spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: layout.spacing.md,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: layout.spacing.md,
    },
    tag: {
      backgroundColor: theme.backgroundLight,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
    },
    tagText: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '500' as const,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    usageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    usageText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
  });

  return (
    <TouchableOpacity onPress={() => onPress(template)} testID={testID}>
      <Card variant="elevated" style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{template.title}</Text>
            <Text style={styles.category}>{template.category}</Text>
          </View>
          {template.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={[
                styles.difficultyText,
                { color: getDifficultyColor(template.difficulty) }
              ]}>
                {template.difficulty}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.description}>{template.description}</Text>

        <View style={styles.statsContainer}>
          {template.rating && (
            <View style={styles.ratingContainer}>
              {renderStars(template.rating)}
              <Text style={styles.ratingText}>{template.rating.toFixed(1)}</Text>
            </View>
          )}
          
          {template.usageCount && (
            <View style={styles.statItem}>
              <TrendingUp size={12} color={theme.textSecondary} />
              <Text style={styles.statText}>{template.usageCount.toLocaleString()} uses</Text>
            </View>
          )}
        </View>

        <View style={styles.tagsContainer}>
          {template.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {template.tags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{template.tags.length - 3} more</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {template.estimatedTime && (
            <View style={styles.timeContainer}>
              <Clock size={12} color={theme.textSecondary} />
              <Text style={styles.timeText}>{template.estimatedTime}</Text>
            </View>
          )}
          
          <View style={styles.usageContainer}>
            <Eye size={12} color={theme.textSecondary} />
            <Text style={styles.usageText}>Preview</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default EnhancedTemplateCard;