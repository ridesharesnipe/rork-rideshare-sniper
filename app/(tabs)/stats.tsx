import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react-native';
import colors from '@/constants/colors';

// Mock data for stats
const mockDailyStats = [
  { date: '2023-10-01', trips: 15, earnings: 245.75, avgFare: 16.38, acceptanceRate: 65 },
  { date: '2023-10-02', trips: 18, earnings: 312.50, avgFare: 17.36, acceptanceRate: 72 },
  { date: '2023-10-03', trips: 12, earnings: 187.25, avgFare: 15.60, acceptanceRate: 60 },
  { date: '2023-10-04', trips: 20, earnings: 356.80, avgFare: 17.84, acceptanceRate: 80 },
  { date: '2023-10-05', trips: 16, earnings: 278.40, avgFare: 17.40, acceptanceRate: 70 },
  { date: '2023-10-06', trips: 22, earnings: 398.75, avgFare: 18.13, acceptanceRate: 85 },
  { date: '2023-10-07', trips: 14, earnings: 224.50, avgFare: 16.04, acceptanceRate: 68 },
];

export default function StatsScreen() {
  const [selectedDateIndex, setSelectedDateIndex] = useState(6); // Default to latest day
  
  const selectedStats = mockDailyStats[selectedDateIndex];
  
  const handlePrevDay = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };
  
  const handleNextDay = () => {
    if (selectedDateIndex < mockDailyStats.length - 1) {
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };
  
  // Calculate week totals
  const weekTotals = {
    trips: mockDailyStats.reduce((sum, day) => sum + day.trips, 0),
    earnings: mockDailyStats.reduce((sum, day) => sum + day.earnings, 0),
    avgFare: mockDailyStats.reduce((sum, day) => sum + day.avgFare, 0) / mockDailyStats.length,
    acceptanceRate: mockDailyStats.reduce((sum, day) => sum + day.acceptanceRate, 0) / mockDailyStats.length,
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  // Compare with previous day
  const getPrevDayComparison = (key: 'trips' | 'earnings' | 'avgFare' | 'acceptanceRate') => {
    if (selectedDateIndex === 0) return null;
    
    const prevDayValue = mockDailyStats[selectedDateIndex - 1][key];
    const currentValue = selectedStats[key];
    const diff = currentValue - prevDayValue;
    const percentChange = (diff / prevDayValue) * 100;
    
    return {
      diff,
      percentChange,
      isPositive: diff > 0,
    };
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>
      
      <View style={styles.dateSelector}>
        <Pressable 
          style={styles.dateButton} 
          onPress={handlePrevDay}
          disabled={selectedDateIndex === 0}
        >
          <ChevronLeft 
            size={24} 
            color={selectedDateIndex === 0 ? colors.textMuted : colors.textSecondary} 
          />
        </Pressable>
        
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.textSecondary} style={styles.dateIcon} />
          <Text style={styles.dateText}>{formatDate(selectedStats.date)}</Text>
        </View>
        
        <Pressable 
          style={styles.dateButton} 
          onPress={handleNextDay}
          disabled={selectedDateIndex === mockDailyStats.length - 1}
        >
          <ChevronRight 
            size={24} 
            color={selectedDateIndex === mockDailyStats.length - 1 ? colors.textMuted : colors.textSecondary} 
          />
        </Pressable>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Trips</Text>
          <Text style={styles.statValue}>{selectedStats.trips}</Text>
          
          {getPrevDayComparison('trips') && (
            <View style={styles.comparisonContainer}>
              {getPrevDayComparison('trips')!.isPositive ? (
                <TrendingUp size={14} color={colors.primary} />
              ) : (
                <TrendingDown size={14} color={colors.secondary} />
              )}
              <Text 
                style={[
                  styles.comparisonText,
                  { color: getPrevDayComparison('trips')!.isPositive ? colors.primary : colors.secondary }
                ]}
              >
                {Math.abs(getPrevDayComparison('trips')!.diff)} 
                ({Math.abs(getPrevDayComparison('trips')!.percentChange).toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Earnings</Text>
          <Text style={styles.statValue}>${selectedStats.earnings.toFixed(2)}</Text>
          
          {getPrevDayComparison('earnings') && (
            <View style={styles.comparisonContainer}>
              {getPrevDayComparison('earnings')!.isPositive ? (
                <TrendingUp size={14} color={colors.primary} />
              ) : (
                <TrendingDown size={14} color={colors.secondary} />
              )}
              <Text 
                style={[
                  styles.comparisonText,
                  { color: getPrevDayComparison('earnings')!.isPositive ? colors.primary : colors.secondary }
                ]}
              >
                ${Math.abs(getPrevDayComparison('earnings')!.diff).toFixed(2)} 
                ({Math.abs(getPrevDayComparison('earnings')!.percentChange).toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg. Fare</Text>
          <Text style={styles.statValue}>${selectedStats.avgFare.toFixed(2)}</Text>
          
          {getPrevDayComparison('avgFare') && (
            <View style={styles.comparisonContainer}>
              {getPrevDayComparison('avgFare')!.isPositive ? (
                <TrendingUp size={14} color={colors.primary} />
              ) : (
                <TrendingDown size={14} color={colors.secondary} />
              )}
              <Text 
                style={[
                  styles.comparisonText,
                  { color: getPrevDayComparison('avgFare')!.isPositive ? colors.primary : colors.secondary }
                ]}
              >
                ${Math.abs(getPrevDayComparison('avgFare')!.diff).toFixed(2)} 
                ({Math.abs(getPrevDayComparison('avgFare')!.percentChange).toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Acceptance</Text>
          <Text style={styles.statValue}>{selectedStats.acceptanceRate}%</Text>
          
          {getPrevDayComparison('acceptanceRate') && (
            <View style={styles.comparisonContainer}>
              {getPrevDayComparison('acceptanceRate')!.isPositive ? (
                <TrendingUp size={14} color={colors.primary} />
              ) : (
                <TrendingDown size={14} color={colors.secondary} />
              )}
              <Text 
                style={[
                  styles.comparisonText,
                  { color: getPrevDayComparison('acceptanceRate')!.isPositive ? colors.primary : colors.secondary }
                ]}
              >
                {Math.abs(getPrevDayComparison('acceptanceRate')!.diff)}% 
                ({Math.abs(getPrevDayComparison('acceptanceRate')!.percentChange).toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.weekSummaryCard}>
        <Text style={styles.weekSummaryTitle}>Weekly Summary</Text>
        
        <View style={styles.weekSummaryRow}>
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Total Trips</Text>
            <Text style={styles.weekSummaryValue}>{weekTotals.trips}</Text>
          </View>
          
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Total Earnings</Text>
            <Text style={styles.weekSummaryValue}>${weekTotals.earnings.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.weekSummaryRow}>
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Avg. Fare</Text>
            <Text style={styles.weekSummaryValue}>${weekTotals.avgFare.toFixed(2)}</Text>
          </View>
          
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Avg. Acceptance</Text>
            <Text style={styles.weekSummaryValue}>{weekTotals.acceptanceRate.toFixed(1)}%</Text>
          </View>
        </View>
        
        <View style={styles.weekSummaryRow}>
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Daily Average</Text>
            <Text style={styles.weekSummaryValue}>${(weekTotals.earnings / 7).toFixed(2)}</Text>
          </View>
          
          <View style={styles.weekSummaryItem}>
            <Text style={styles.weekSummaryLabel}>Trips per Day</Text>
            <Text style={styles.weekSummaryValue}>{(weekTotals.trips / 7).toFixed(1)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Insights</Text>
        <Text style={styles.infoText}>
          Your highest earning day this week was Friday with $398.75.
          Your acceptance rate is 5% higher than last week, which may be
          improving your overall earnings. Consider adjusting your profile
          settings to optimize for higher fares.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 8,
  },
  dateButton: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginVertical: 8,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  weekSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  weekSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekSummaryItem: {
    width: '48%',
  },
  weekSummaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  weekSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});