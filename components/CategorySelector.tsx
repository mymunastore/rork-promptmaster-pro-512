import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { PromptCategory } from '@/types/prompt';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import { 
  PenLine, 
  Megaphone, 
  Code, 
  Palette, 
  Briefcase, 
  GraduationCap, 
  User 
} from 'lucide-react-native';

interface CategorySelectorProps {
  selectedCategory: PromptCategory | null;
  onSelectCategory: (category: PromptCategory | null) => void;
  testID?: string;
}

const categories: { id: PromptCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'writing', label: 'Writing', icon: <PenLine size={20} color={colors.card} /> },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone size={20} color={colors.card} /> },
  { id: 'development', label: 'Development', icon: <Code size={20} color={colors.card} /> },
  { id: 'design', label: 'Design', icon: <Palette size={20} color={colors.card} /> },
  { id: 'business', label: 'Business', icon: <Briefcase size={20} color={colors.card} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={20} color={colors.card} /> },
  { id: 'personal', label: 'Personal', icon: <User size={20} color={colors.card} /> },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  testID
}) => {
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
            { backgroundColor: colors.background }
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === null && styles.selectedText,
            { color: colors.text }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedItem,
              { backgroundColor: getCategoryColor(category.id) }
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <View style={styles.iconContainer}>
              {category.icon}
            </View>
            <Text style={styles.categoryText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getCategoryColor = (category: PromptCategory): string => {
  const colorMap: Record<PromptCategory, string> = {
    writing: '#6200EE',
    marketing: '#03DAC6',
    development: '#3700B3',
    design: '#BB86FC',
    business: '#018786',
    education: '#9D4EDD',
    personal: '#CF6679',
  };
  
  return colorMap[category];
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.round,
    marginRight: layout.spacing.sm,
  },
  selectedItem: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginRight: layout.spacing.xs,
  },
  categoryText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    fontWeight: '700',
  },
});

export default CategorySelector;