import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Star, Download, User, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import { CommunityTemplate } from '@/types/prompt';

interface CommunityTemplateCardProps {
  template: CommunityTemplate;
  onPress: (template: CommunityTemplate) => void;
  onDownload?: (template: CommunityTemplate) => void;
  testID?: string;
}

const CommunityTemplateCard: React.FC<CommunityTemplateCardProps> = ({ 
  template, 
  onPress, 
  onDownload,
  testID 
}) => {
  const { theme } = useTheme();

  const handleDownload = (e: any) => {
    e.stopPropagation();
    onDownload?.(template);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: layout.spacing.md,
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    imageContainer: {
      width: 60,
      height: 60,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
      marginRight: layout.spacing.md,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary + '20',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: layout.spacing.sm,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    authorIcon: {
      marginRight: layout.spacing.xs,
    },
    authorName: {
      fontSize: 13,
      color: theme.textSecondary,
      marginRight: layout.spacing.xs,
    },
    verifiedIcon: {
      marginLeft: layout.spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: layout.spacing.md,
    },
    statText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    downloadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '15',
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
    },
    downloadButtonText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600' as const,
      marginLeft: layout.spacing.xs,
    },
    categoryTag: {
      backgroundColor: theme.accent1 + '20',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      alignSelf: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    categoryText: {
      fontSize: 11,
      color: theme.accent1,
      fontWeight: '600' as const,
      textTransform: 'uppercase',
    },
  });

  return (
    <TouchableOpacity onPress={() => onPress(template)} testID={testID}>
      <Card style={styles.container}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{template.category}</Text>
        </View>
        
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {template.imageUrl ? (
              <Image source={{ uri: template.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: theme.primary, fontSize: 24, fontWeight: 'bold' }}>
                  {template.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {template.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {template.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.authorContainer}>
          <User size={14} color={theme.textSecondary} style={styles.authorIcon} />
          <Text style={styles.authorName}>{template.author}</Text>
          {template.isVerified && (
            <CheckCircle size={14} color={theme.success} style={styles.verifiedIcon} />
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.leftStats}>
            <View style={styles.statItem}>
              <Star size={14} color={theme.warning} />
              <Text style={styles.statText}>{template.rating.toFixed(1)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Download size={14} color={theme.accent3} />
              <Text style={styles.statText}>{formatNumber(template.downloads)}</Text>
            </View>
          </View>
          
          {onDownload && (
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={handleDownload}
              testID={`${testID}-download`}
            >
              <Download size={14} color={theme.primary} />
              <Text style={styles.downloadButtonText}>Use</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default CommunityTemplateCard;