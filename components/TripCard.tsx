import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Check, X, AlertTriangle, Navigation } from 'lucide-react-native';
import { TripRequest, TripEvaluation } from '@/types';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settingsStore';

interface TripCardProps {
  trip: TripRequest;
  evaluation: TripEvaluation;
  onAccept: () => void;
  onReject: () => void;
  remainingTime: number;
}

export default function TripCard({
  trip,
  evaluation,
  onAccept,
  onReject,
  remainingTime,
}: TripCardProps) {
  const { vibrationEnabled } = useSettingsStore();
  
  useEffect(() => {
    if (vibrationEnabled && Platform.OS !== 'web') {
      try {
        if (evaluation.recommendation === 'accept') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (evaluation.recommendation === 'reject') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  }, []);
  
  const getRecommendationColor = () => {
    switch (evaluation.recommendation) {
      case 'accept':
        return colors.primary;
      case 'reject':
        return colors.secondary;
      case 'consider':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Tactical Info Panel */}
      <View style={styles.tacticalPanel}>
        <Text style={styles.fareAmount}>${trip.estimatedFare.toFixed(2)}</Text>
        
        <View style={styles.distanceContainer}>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>PICKUP</Text>
            <Text style={styles.distanceValue}>{trip.pickupDistance.toFixed(1)} mi</Text>
          </View>
          
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>DRIVING</Text>
            <Text style={styles.distanceValue}>{trip.dropoffDistance.toFixed(1)} mi</Text>
          </View>
          
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>TOTAL</Text>
            <Text style={styles.distanceValue}>{(trip.pickupDistance + trip.dropoffDistance).toFixed(1)} mi</Text>
          </View>
        </View>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{remainingTime}s</Text>
        </View>
      </View>
      
      {/* Trip Details - Secondary Information */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{trip.estimatedDuration} min</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating</Text>
            <Text style={styles.detailValue}>{trip.passengerRating.toFixed(1)}★</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Score</Text>
            <Text style={styles.detailValue}>{evaluation.evaluationScore}</Text>
          </View>
        </View>
        
        <View style={styles.scoreBarContainer}>
          <View 
            style={[
              styles.scoreBar, 
              { width: `${evaluation.evaluationScore}%` },
              evaluation.recommendation === 'accept' ? styles.acceptScoreBar : 
              evaluation.recommendation === 'consider' ? styles.considerScoreBar : 
              styles.rejectScoreBar
            ]} 
          />
        </View>
      </View>
      
      {/* Tactical Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
        >
          <View style={styles.actionButtonContent}>
            <X size={32} color={colors.textPrimary} />
          </View>
        </Pressable>
        
        <Pressable
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <View style={styles.actionButtonContent}>
            {evaluation.recommendation === 'accept' ? (
              <View style={styles.crosshairContainer}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
            ) : evaluation.recommendation === 'consider' ? (
              <AlertTriangle size={32} color={colors.textPrimary} />
            ) : (
              <Check size={32} color={colors.textPrimary} />
            )}
          </View>
        </Pressable>
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
  tacticalPanel: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceItem: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timerContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scoreBarContainer: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
  },
  scoreBar: {
    height: 6,
    borderRadius: 3,
  },
  acceptScoreBar: {
    backgroundColor: colors.primary,
  },
  considerScoreBar: {
    backgroundColor: colors.warning,
  },
  rejectScoreBar: {
    backgroundColor: colors.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    height: 80,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionButtonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: colors.secondary,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  crosshairContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
});