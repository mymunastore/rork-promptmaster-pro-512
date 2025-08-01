import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { PromptTemplate } from '@/types/prompt';
import Card from './Card';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import { ChevronRight } from 'lucide-react-native';

interface TemplateCardProps {
  template: PromptTemplate;
  onPress: (template: PromptTemplate) => void;
  testID?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPress, testID }) => {
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
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

export default TemplateCard;