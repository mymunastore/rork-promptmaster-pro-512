import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TopicSuggestion } from '@/types/prompt';
import Card from './Card';
import colors from '@/constants/colors';
import layout from '@/constants/layout';
import { Plus } from 'lucide-react-native';

interface TopicSuggestionCardProps {
  topic: TopicSuggestion;
  onPress: (topic: TopicSuggestion) => void;
  testID?: string;
}

const TopicSuggestionCard: React.FC<TopicSuggestionCardProps> = ({ 
  topic, 
  onPress,
  testID
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(topic)}
      activeOpacity={0.7}
      testID={testID}
    >
      <Card style={styles.card}>
        <Text style={styles.title}>{topic.topic}</Text>
        <Text style={styles.description}>{topic.description}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onPress(topic)}
        >
          <Plus size={16} color={colors.card} />
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.spacing.md,
    marginHorizontal: layout.spacing.xs,
    paddingRight: layout.spacing.xl,
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
  },
  addButton: {
    position: 'absolute',
    top: layout.spacing.md,
    right: layout.spacing.md,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.round,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopicSuggestionCard;