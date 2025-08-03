import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart3, TrendingUp, Eye, Heart, Share2, Calendar, Filter } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import { trpc } from '@/lib/trpc';

interface AdvancedAnalyticsProps {
  testID?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ testID }) => {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const analyticsQuery = trpc.analytics.usage.useQuery({
    timeframe,
    category: selectedCategory as any,
  });

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - (layout.spacing.lg * 4);

  const timeframeOptions = [
    { id: 'day' as const, label: 'Today' },
    { id: 'week' as const, label: 'This Week' },
    { id: 'month' as const, label: 'This Month' },
    { id: 'year' as const, label: 'This Year' },
  ];

  const renderMetricCard = (title: string, value: number, icon: any, color: string, change?: string) => {
    const IconComponent = icon;
    return (
      <Card style={[styles.metricCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <View style={styles.metricHeader}>
          <IconComponent size={20} color={color} />
          <Text style={styles.metricTitle}>{title}</Text>
        </View>
        <Text style={styles.metricValue}>{value.toLocaleString()}</Text>
        {change && (
          <Text style={[styles.metricChange, { color: change.startsWith('+') ? theme.success : theme.error }]}>
            {change}
          </Text>
        )}
      </Card>
    );
  };

  const renderSimpleChart = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.prompts_created + d.prompts_used));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Activity Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chart}>
            {data.map((item, index) => {
              const totalHeight = 120;
              const createdHeight = (item.prompts_created / maxValue) * totalHeight;
              const usedHeight = (item.prompts_used / maxValue) * totalHeight;
              
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height: usedHeight, backgroundColor: theme.primary }]} />
                    <View style={[styles.bar, { height: createdHeight, backgroundColor: theme.accent2 }]} />
                  </View>
                  <Text style={styles.barLabel}>
                    {new Date(item.date).toLocaleDateString('en', { weekday: 'short' })}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.primary }]} />
            <Text style={styles.legendText}>Prompts Used</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.accent2 }]} />
            <Text style={styles.legendText}>Prompts Created</Text>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: layout.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.backgroundLight,
    },
    filterText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    content: {
      padding: layout.spacing.lg,
    },
    timeframeSelector: {
      flexDirection: 'row',
      marginBottom: layout.spacing.lg,
      backgroundColor: theme.backgroundLight,
      borderRadius: layout.borderRadius.md,
      padding: layout.spacing.xs,
    },
    timeframeButton: {
      flex: 1,
      paddingVertical: layout.spacing.sm,
      alignItems: 'center',
      borderRadius: layout.borderRadius.sm,
    },
    timeframeButtonActive: {
      backgroundColor: theme.primary,
    },
    timeframeButtonText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500' as const,
    },
    timeframeButtonTextActive: {
      color: theme.card,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: layout.spacing.md,
      marginBottom: layout.spacing.lg,
    },
    metricCard: {
      width: '48%',
      padding: layout.spacing.md,
      backgroundColor: theme.backgroundLight,
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.sm,
    },
    metricTitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
      fontWeight: '500' as const,
    },
    metricValue: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: theme.text,
      marginBottom: layout.spacing.xs,
    },
    metricChange: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
    chartContainer: {
      marginBottom: layout.spacing.lg,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 140,
      paddingHorizontal: layout.spacing.md,
    },
    chartBar: {
      alignItems: 'center',
      marginHorizontal: layout.spacing.xs,
    },
    barContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 120,
      width: 30,
    },
    bar: {
      width: 12,
      marginHorizontal: 1,
      borderRadius: 2,
    },
    barLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: layout.spacing.xs,
      textAlign: 'center',
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: layout.spacing.md,
      gap: layout.spacing.lg,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 2,
      marginRight: layout.spacing.xs,
    },
    legendText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    categoryBreakdown: {
      marginBottom: layout.spacing.lg,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: layout.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    categoryName: {
      fontSize: 14,
      color: theme.text,
      textTransform: 'capitalize',
    },
    categoryStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryCount: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginRight: layout.spacing.sm,
    },
    categoryPercentage: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    insightsContainer: {
      backgroundColor: theme.backgroundLight,
      padding: layout.spacing.lg,
      borderRadius: layout.borderRadius.lg,
    },
    insightsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.md,
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: layout.spacing.sm,
    },
    insightBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.primary,
      marginTop: 6,
      marginRight: layout.spacing.sm,
    },
    insightText: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
      lineHeight: 18,
    },
  });

  if (analyticsQuery.isLoading) {
    return (
      <Card style={styles.container} testID={testID}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BarChart3 size={24} color={theme.primary} />
            <Text style={styles.title}>Analytics</Text>
          </View>
        </View>
        <View style={[styles.content, { alignItems: 'center', justifyContent: 'center', height: 200 }]}>
          <Text style={{ color: theme.textSecondary }}>Loading analytics...</Text>
        </View>
      </Card>
    );
  }

  const data = analyticsQuery.data;
  if (!data) return null;

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BarChart3 size={24} color={theme.primary} />
          <Text style={styles.title}>Analytics</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={14} color={theme.textSecondary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timeframeSelector}>
          {timeframeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.timeframeButton,
                timeframe === option.id && styles.timeframeButtonActive,
              ]}
              onPress={() => setTimeframe(option.id)}
            >
              <Text
                style={[
                  styles.timeframeButtonText,
                  timeframe === option.id && styles.timeframeButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsGrid}>
          {renderMetricCard('Prompts Created', data.totals.prompts_created, TrendingUp, theme.accent2, '+12%')}
          {renderMetricCard('Prompts Used', data.totals.prompts_used, Eye, theme.primary, '+8%')}
          {renderMetricCard('Templates Used', data.totals.templates_used, Heart, theme.accent3, '+15%')}
          {renderMetricCard('AI Optimizations', data.totals.ai_optimizations, Share2, theme.accent4, '+23%')}
        </View>

        {renderSimpleChart(data.dailyData)}

        <View style={styles.categoryBreakdown}>
          <Text style={styles.categoryTitle}>Category Breakdown</Text>
          {data.categoryBreakdown.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category.category}</Text>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryCount}>{category.count}</Text>
                <Text style={styles.categoryPercentage}>({category.percentage}%)</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          {data.insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <View style={styles.insightBullet} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
};

export default AdvancedAnalytics;