import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { PromptTemplate } from '@/types/prompt';
import Card from './Card';
import layout from '@/constants/layout';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface TemplateCardProps {
  template: PromptTemplate;
  onPress: (template: PromptTemplate) => void;
  testID?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPress, testID }) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      marginBottom: layout.spacing.md,
    },
    content: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: layout.borderRadius.md,
      marginRight: layout.spacing.md,
    },
    textContainer: {
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
      marginBottom: layout.spacing.xs,
    },
    tagsContainer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
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
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs / 2,
      borderRadius: layout.borderRadius.sm,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
  });
  
  return (
    <TouchableOpacity 
      onPress={() => onPress(template)} 
      activeOpacity={0.7}
      testID={testID}
    >
      <Card style={styles.card}>
        <View style={styles.content}>
          {template.imageUrl && (
            <Image 
              source={{ uri: template.imageUrl }} 
              style={styles.image} 
              resizeMode="cover"
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{template.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {template.description}
            </Text>
            <View style={styles.tagsContainer}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{template.category}</Text>
              </View>
              {template.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};



export default TemplateCard;