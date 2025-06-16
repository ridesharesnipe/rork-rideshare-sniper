import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Play, Pause, RefreshCw, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import TripCard from '@/components/TripCard';
import ProfileSelector from '@/components/ProfileSelector';
import { useProfileStore } from '@/store/profileStore';
import { TripRequest } from '@/types';
import { evaluateTrip } from '@/utils/tripEvaluator';
import * as Haptics from 'expo-haptics';
import OverlayDemo from '@/components/OverlayDemo';

// Mock data generators
const generateRandomTrip = (): TripRequest => {
  const id = Date.now().toString();
  const estimatedFare = Math.round(Math.random() * 30 + 5);
  const pickupDistance = Math.round(Math.random() * 10 * 10) / 10;
  const dropoffDistance = Math.round(Math.random() * 15 * 10) / 10;
  const estimatedDuration = Math.round((dropoffDistance / 0.5) + 5);
  const passengerRating = Math.round(Math.random() * 2 * 10 + 30) / 10;
  
  return {
    id,
    estimatedFare,
    pickupDistance,
    dropoffDistance,
    estimatedDuration,
    passengerRating,
    timestamp: Date.now(),
    pickupLocation: "Downtown",
    dropoffLocation: "Airport",
    passengerName: "Alex",
    platform: "uber"
  };
};

export default function SimulatorScreen() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripRequest | null>(null);
  const [remainingTime, setRemainingTime] = useState(15);
  const [acceptedTrips, setAcceptedTrips] = useState<TripRequest[]>([]);
  const [rejectedTrips, setRejectedTrips] = useState<TripRequest[]>([]);
  const [showOverlayDemo, setShowOverlayDemo] = useState(false);
  const [demoType, setDemoType] = useState<'accept' | 'reject' | 'consider'>('accept');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { getActiveProfile } = useProfileStore();
  
  const startSimulation = () => {
    setIsRunning(true);
    generateNewTrip();
  };
  
  const stopSimulation = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetSimulation = () => {
    stopSimulation();
    setCurrentTrip(null);
    setAcceptedTrips([]);
    setRejectedTrips([]);
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };
  
  const generateNewTrip = () => {
    const newTrip = generateRandomTrip();
    setCurrentTrip(newTrip);
    setRemainingTime(15);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleRejectTrip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleAcceptTrip = () => {
    if (!currentTrip) return;
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    setAcceptedTrips((prev) => [...prev, currentTrip]);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isRunning) {
      setTimeout(() => {
        generateNewTrip();
      }, 1000);
    } else {
      setCurrentTrip(null);
    }
  };
  
  const handleRejectTrip = () => {
    if (!currentTrip) return;
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    setRejectedTrips((prev) => [...prev, currentTrip]);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isRunning) {
      setTimeout(() => {
        generateNewTrip();
      }, 1000);
    } else {
      setCurrentTrip(null);
    }
  };
  
  const showDemo = (type: 'accept' | 'reject' | 'consider') => {
    setDemoType(type);
    setShowOverlayDemo(true);
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const activeProfile = getActiveProfile();
  const tripEvaluation = currentTrip && activeProfile 
    ? evaluateTrip(currentTrip, activeProfile)
    : null;
  
  const totalEarnings = acceptedTrips.reduce(
    (sum, trip) => sum + trip.estimatedFare,
    0
  );
  
  return (
    <View style={styles.container}>
      {showOverlayDemo ? (
        <OverlayDemo 
          recommendation={demoType} 
          onClose={() => setShowOverlayDemo(false)} 
        />
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>SIMULATOR</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ACTIVE PROFILE</Text>
            <ProfileSelector />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{acceptedTrips.length + rejectedTrips.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{acceptedTrips.length}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${totalEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
          
          <View style={styles.controlsContainer}>
            <Pressable
              style={[styles.controlButton, styles.resetButton]}
              onPress={resetSimulation}
            >
              <RefreshCw size={20} color={colors.textPrimary} />
              <Text style={styles.controlButtonText}>RESET</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.controlButton,
                isRunning ? styles.pauseButton : styles.playButton,
              ]}
              onPress={isRunning ? stopSimulation : startSimulation}
            >
              {isRunning ? (
                <Pause size={20} color={colors.textPrimary} />
              ) : (
                <Play size={20} color={colors.textPrimary} />
              )}
              <Text style={styles.controlButtonText}>
                {isRunning ? 'PAUSE' : 'START'}
              </Text>
            </Pressable>
          </View>
          
          {currentTrip && tripEvaluation ? (
            <TripCard
              trip={currentTrip}
              evaluation={tripEvaluation}
              onAccept={handleAcceptTrip}
              onReject={handleRejectTrip}
              remainingTime={remainingTime}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Press START to begin simulation
              </Text>
            </View>
          )}
          
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>OVERLAY DEMOS</Text>
            
            <View style={styles.demoButtons}>
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.primary }]}
                onPress={() => showDemo('accept')}
              >
                <View style={styles.miniCrosshair}>
                  <View style={styles.miniCrosshairH} />
                  <View style={styles.miniCrosshairV} />
                </View>
                <Text style={styles.demoButtonText}>GREEN CROSSHAIR</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.warning }]}
                onPress={() => showDemo('consider')}
              >
                <Text style={styles.demoIcon}>!</Text>
                <Text style={styles.demoButtonText}>YELLOW WARNING</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.secondary }]}
                onPress={() => showDemo('reject')}
              >
                <Text style={styles.demoIcon}>×</Text>
                <Text style={styles.demoButtonText}>RED X</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 4,
  },
  placeholder: {
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  resetButton: {
    backgroundColor: colors.surfaceLight,
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  demoSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  demoButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  demoButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  miniCrosshair: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  miniCrosshairH: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairV: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#FFFFFF',
  },
  demoIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});