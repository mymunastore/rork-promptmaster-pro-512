import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PromptTemplate } from '@/types/prompt';
import Card from './Card';
import layout from '@/constants/layout';
import { ChevronRight, Sparkles } from 'lucide-react-native';
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
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    imageContainer: {
      width: 64,
      height: 64,
      borderRadius: layout.borderRadius.lg,
      marginRight: layout.spacing.md,
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: layout.typography.sizes.callout,
      fontWeight: layout.typography.weights.bold,
      color: theme.text,
      marginBottom: layout.spacing.xs,
      letterSpacing: -0.2,
    },
    description: {
      fontSize: layout.typography.sizes.footnote,
      color: theme.textSecondary,
      marginBottom: layout.spacing.sm,
      lineHeight: 18,
      letterSpacing: -0.1,
    },
    tagsContainer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      alignItems: 'center',
    },
    categoryTag: {
      borderRadius: layout.borderRadius.lg,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
      overflow: 'hidden',
    },
    categoryGradient: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryText: {
      color: '#FFFFFF',
      fontSize: layout.typography.sizes.caption1,
      fontWeight: layout.typography.weights.semibold,
      marginLeft: layout.spacing.xs / 2,
      letterSpacing: -0.1,
    },
    tag: {
      backgroundColor: theme.backgroundAccent + '80',
      borderWidth: 1,
      borderColor: theme.border + '40',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs / 2,
      borderRadius: layout.borderRadius.md,
      marginRight: layout.spacing.xs,
      marginBottom: layout.spacing.xs,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: layout.typography.sizes.caption1,
      fontWeight: layout.typography.weights.medium,
      letterSpacing: -0.1,
    },
    chevronContainer: {
      backgroundColor: theme.primary + '20',
      borderRadius: layout.borderRadius.round,
      padding: layout.spacing.xs,
    },
  });
  
  return (
    <TouchableOpacity 
      onPress={() => onPress(template)} 
      activeOpacity={0.8}
      testID={testID}
    >
      <Card variant="elevated" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {template.imageUrl ? (
              <>
                <Image 
                  source={{ uri: template.imageUrl }} 
                  style={styles.image} 
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Sparkles size={20} color="#FFFFFF" />
                </View>
              </>
            ) : (
              <LinearGradient
                colors={theme.gradient.primary}
                style={styles.image}
              >
                <View style={styles.imageOverlay}>
                  <Sparkles size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{template.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {template.description}
            </Text>
            <View style={styles.tagsContainer}>
              <View style={styles.categoryTag}>
                <LinearGradient
                  colors={theme.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryGradient}
                >
                  <Sparkles size={10} color="#FFFFFF" />
                  <Text style={styles.categoryText}>{template.category}</Text>
                </LinearGradient>
              </View>
              {template.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <ChevronRight size={18} color={theme.primary} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};



export default TemplateCard;