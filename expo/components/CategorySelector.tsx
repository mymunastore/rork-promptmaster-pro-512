import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PromptCategory } from '@/types/prompt';
import layout from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';
import { 
  PenLine, 
  Megaphone, 
  Code, 
  Palette, 
  Briefcase, 
  GraduationCap, 
  User,
  Sparkles 
} from 'lucide-react-native';

interface CategorySelectorProps {
  selectedCategory: PromptCategory | null;
  onSelectCategory: (category: PromptCategory | null) => void;
  testID?: string;
}



const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  testID
}) => {
  const { theme } = useTheme();
  
  const categories: { id: PromptCategory; label: string; icon: React.ReactNode; gradient: readonly [string, string] }[] = [
    { id: 'writing', label: 'Writing', icon: <PenLine size={18} color="#FFFFFF" />, gradient: ['#8B5CF6', '#A855F7'] as const },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone size={18} color="#FFFFFF" />, gradient: ['#EC4899', '#F472B6'] as const },
    { id: 'development', label: 'Development', icon: <Code size={18} color="#FFFFFF" />, gradient: ['#06B6D4', '#22D3EE'] as const },
    { id: 'design', label: 'Design', icon: <Palette size={18} color="#FFFFFF" />, gradient: ['#F59E0B', '#FBBF24'] as const },
    { id: 'business', label: 'Business', icon: <Briefcase size={18} color="#FFFFFF" />, gradient: ['#10B981', '#34D399'] as const },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} color="#FFFFFF" />, gradient: ['#3B82F6', '#60A5FA'] as const },
    { id: 'personal', label: 'Personal', icon: <User size={18} color="#FFFFFF" />, gradient: ['#EF4444', '#F87171'] as const },
  ];
  
  const styles = StyleSheet.create({
    container: {
      paddingVertical: layout.spacing.lg,
      paddingHorizontal: layout.spacing.sm,
    },
    categoryItem: {
      borderRadius: layout.borderRadius.xl,
      marginRight: layout.spacing.sm,
      overflow: 'hidden',
      ...layout.shadows.small,
    },
    categoryContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm + 2,
    },
    selectedItem: {
      transform: [{ scale: 1.05 }],
      ...layout.shadows.medium,
    },
    iconContainer: {
      marginRight: layout.spacing.xs,
    },
    categoryText: {
      color: '#FFFFFF',
      fontWeight: layout.typography.weights.semibold,
      fontSize: layout.typography.sizes.footnote,
      letterSpacing: -0.1,
    },
    selectedText: {
      fontWeight: layout.typography.weights.bold,
    },
    allCategoryItem: {
      backgroundColor: theme.backgroundAccent + 'CC',
      borderWidth: 1,
      borderColor: theme.border + '60',
    },
    allCategoryText: {
      color: theme.text,
      fontWeight: layout.typography.weights.semibold,
      fontSize: layout.typography.sizes.footnote,
      letterSpacing: -0.1,
    },
    allCategorySelectedText: {
      fontWeight: layout.typography.weights.bold,
    },
  });
  
  return (
    <View testID={testID}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === null && styles.selectedItem,
          ]}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.8}
        >
          {selectedCategory === null ? (
            <LinearGradient
              colors={theme.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.categoryContent}
            >
              <View style={styles.iconContainer}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryText, styles.selectedText]}>
                All
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.categoryContent, styles.allCategoryItem]}>
              <View style={styles.iconContainer}>
                <Sparkles size={16} color={theme.textSecondary} />
              </View>
              <Text style={styles.allCategoryText}>
                All
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedItem,
            ]}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={category.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.categoryContent}
            >
              <View style={styles.iconContainer}>
                {category.icon}
              </View>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedText
              ]}>
                {category.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};





export default CategorySelector;