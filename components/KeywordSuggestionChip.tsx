import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeywordSuggestion } from '@/types/prompt';
import colors from '@/constants/colors';
import layout from '@/constants/layout';

interface KeywordSuggestionChipProps {
  keyword: KeywordSuggestion;
  onPress: (keyword: string) => void;
  testID?: string;
}

const KeywordSuggestionChip: React.FC<KeywordSuggestionChipProps> = ({ 
  keyword, 
  onPress,
  testID
}) => {
  // Calculate background opacity based on relevance
  const opacity = 0.3 + (keyword.relevance * 0.7);
  
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: `rgba(98, 0, 238, ${opacity})` }
      ]}
      onPress={() => onPress(keyword.keyword)}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text style={styles.text}>{keyword.keyword}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.round,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
  },
  text: {
    color: colors.card,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default KeywordSuggestionChip;