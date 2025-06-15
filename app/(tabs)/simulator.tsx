import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Play, Pause, RefreshCw, Info, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import TripCard from '@/components/TripCard';
import ProfileSelector from '@/components/ProfileSelector';
import MinimalModeIndicator from '@/components/MinimalModeIndicator';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { TripRequest } from '@/types';
import { evaluateTrip } from '@/utils/tripEvaluator';
import * as Haptics from 'expo-haptics';
import OverlayDemo from '@/components/OverlayDemo';

// Mock pickup and dropoff locations
const pickupLocations = [
  "Downtown",
  "Airport",
  "Shopping Mall",
  "Hotel District",
  "Convention Center",
  "University Campus",
  "Business Park",
  "Residential Area",
  "Train Station",
  "Entertainment District"
];

const dropoffLocations = [
  "City Center",
  "Suburban Area",
  "Beach Resort",
  "Industrial Zone",
  "Sports Stadium",
  "Medical Center",
  "Tech Campus",
  "Financial District",
  "Restaurant Row",
  "Apartment Complex"
];

const passengerNames = [
  "Alex",
  "Jamie",
  "Taylor",
  "Jordan",
  "Casey",
  "Morgan",
  "Riley",
  "Avery",
  "Quinn",
  "Dakota"
];

const platforms = ["uber", "lyft", "other"] as const;

// Mock trip generator
const generateRandomTrip = (): TripRequest => {
  const id = Date.now().toString();
  const estimatedFare = Math.round(Math.random() * 30 + 5);
  const pickupDistance = Math.round(Math.random() * 10 * 10) / 10;
  const dropoffDistance = Math.round(Math.random() * 15 * 10) / 10;
  const estimatedDuration = Math.round((dropoffDistance / 0.5) + 5);
  const passengerRating = Math.round(Math.random() * 2 * 10 + 30) / 10;
  
  // Get random items from arrays
  const pickupLocation = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
  const dropoffLocation = dropoffLocations[Math.floor(Math.random() * dropoffLocations.length)];
  const passengerName = passengerNames[Math.floor(Math.random() * passengerNames.length)];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  return {
    id,
    estimatedFare,
    pickupDistance,
    dropoffDistance,
    estimatedDuration,
    passengerRating,
    timestamp: Date.now(),
    pickupLocation,
    dropoffLocation,
    passengerName,
    platform
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
  const [showMinimalMode, setShowMinimalMode] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { getActiveProfile } = useProfileStore();
  const { minimalMode } = useSettingsStore();
  
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
  
  const toggleMinimalMode = () => {
    setShowMinimalMode(!showMinimalMode);
  };
  
  const navigateBack = () => {
    router.back();
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
  
  const averageFare = acceptedTrips.length > 0
    ? totalEarnings / acceptedTrips.length
    : 0;
  
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
            <Pressable onPress={navigateBack} style={styles.backButton}>
              <ArrowLeft size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>TRIP SIMULATOR</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ACTIVE PROFILE</Text>
            <ProfileSelector />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{acceptedTrips.length + rejectedTrips.length}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{acceptedTrips.length}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${totalEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${averageFare.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Avg. Fare</Text>
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
          
          <Pressable 
            style={styles.displayModeButton}
            onPress={toggleMinimalMode}
          >
            <Text style={styles.displayModeButtonText}>
              {showMinimalMode ? 'SHOW FULL PANEL' : 'SHOW MINIMAL MODE'}
            </Text>
          </Pressable>
          
          {currentTrip && tripEvaluation ? (
            showMinimalMode ? (
              <View style={styles.minimalModeContainer}>
                <Text style={styles.minimalModeLabel}>MINIMAL MODE INDICATOR</Text>
                <View style={styles.minimalModeDemo}>
                  <MinimalModeIndicator
                    recommendation={tripEvaluation.recommendation}
                    fare={currentTrip.estimatedFare}
                    pickupDistance={currentTrip.pickupDistance}
                    dropoffDistance={currentTrip.dropoffDistance}
                  />
                  <Text style={styles.minimalModeHint}>Tap to expand</Text>
                </View>
                
                <View style={styles.minimalModeActions}>
                  <Pressable
                    style={[styles.minimalModeAction, styles.rejectAction]}
                    onPress={handleRejectTrip}
                  >
                    <Text style={styles.minimalModeActionText}>REJECT</Text>
                  </Pressable>
                  
                  <Pressable
                    style={[styles.minimalModeAction, styles.acceptAction]}
                    onPress={handleAcceptTrip}
                  >
                    <Text style={styles.minimalModeActionText}>ACCEPT</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <TripCard
                trip={currentTrip}
                evaluation={tripEvaluation}
                onAccept={handleAcceptTrip}
                onReject={handleRejectTrip}
                remainingTime={remainingTime}
              />
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {acceptedTrips.length > 0 || rejectedTrips.length > 0
                  ? "No active trip request"
                  : "Press START to begin simulation"}
              </Text>
            </View>
          )}
          
          <View style={styles.demoSection}>
            <View style={styles.demoHeader}>
              <Text style={styles.demoTitle}>OVERLAY DEMOS</Text>
              <Info size={16} color={colors.textSecondary} />
            </View>
            
            <Text style={styles.demoDescription}>
              See how Rideshare Sniper would appear as an overlay on your rideshare app. 
              Each element can be positioned exactly where you need it.
            </Text>
            
            <View style={styles.demoButtons}>
              <Pressable 
                style={[styles.demoButton, styles.acceptDemoButton]}
                onPress={() => showDemo('accept')}
              >
                <Text style={styles.demoButtonText}>GREEN CROSSHAIR</Text>
                <Text style={styles.demoButtonSubtext}>Place exactly where the Accept button is</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, styles.considerDemoButton]}
                onPress={() => showDemo('consider')}
              >
                <Text style={styles.demoButtonText}>YELLOW WARNING</Text>
                <Text style={styles.demoButtonSubtext}>Place directly above the trip details</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, styles.rejectDemoButton]}
                onPress={() => showDemo('reject')}
              >
                <Text style={styles.demoButtonText}>RED X</Text>
                <Text style={styles.demoButtonSubtext}>Place precisely over the decline button</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>HOW TO USE THE SIMULATOR</Text>
            <Text style={styles.infoText}>
              This simulator helps you test your profile settings with random trip requests. 
              Press Start to begin receiving simulated trip requests, then Accept or Reject 
              based on the recommendation. Adjust your profile settings to see how they 
              affect trip evaluations.
            </Text>
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
    width: 60, // Match the width of the back button for centering
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
  displayModeButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  displayModeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  minimalModeContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  minimalModeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  minimalModeDemo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  minimalModeHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  minimalModeActions: {
    flexDirection: 'row',
    width: '100%',
  },
  minimalModeAction: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rejectAction: {
    backgroundColor: colors.secondary,
  },
  acceptAction: {
    backgroundColor: colors.primary,
  },
  minimalModeActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
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
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  demoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  demoButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  demoButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonSubtext: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 4,
    opacity: 0.8,
  },
  acceptDemoButton: {
    backgroundColor: colors.primary,
  },
  considerDemoButton: {
    backgroundColor: colors.warning,
  },
  rejectDemoButton: {
    backgroundColor: colors.secondary,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});