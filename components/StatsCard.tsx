import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface StatsCardProps {
  totalTrips: number;
  acceptedTrips: number;
  rejectedTrips: number;
  totalEarnings: number;
  averageFare: number;
}

export default function StatsCard({
  totalTrips,
  acceptedTrips,
  rejectedTrips,
  totalEarnings,
  averageFare,
}: StatsCardProps) {
  const acceptanceRate = totalTrips > 0 
    ? Math.round((acceptedTrips / totalTrips) * 100) 
    : 0;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODAY'S STATS</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${averageFare.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Avg. Fare</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalTrips}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{acceptedTrips}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{rejectedTrips}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>
      
      <View style={styles.acceptanceRateContainer}>
        <Text style={styles.acceptanceRateLabel}>Acceptance Rate</Text>
        <View style={styles.acceptanceRateBarContainer}>
          <View 
            style={[
              styles.acceptanceRateBar, 
              { width: `${acceptanceRate}%` },
              acceptanceRate < 50 ? styles.lowAcceptanceRate : {},
            ]} 
          />
        </View>
        <Text style={styles.acceptanceRateValue}>{acceptanceRate}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 16,
  },
  acceptanceRateContainer: {
    marginTop: 8,
  },
  acceptanceRateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  acceptanceRateBarContainer: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginBottom: 4,
  },
  acceptanceRateBar: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  lowAcceptanceRate: {
    backgroundColor: colors.warning,
  },
  acceptanceRateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    alignSelf: 'flex-end',
  },
});