import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, Info, ChevronRight, Radar } from 'lucide-react-native';
import colors from '@/constants/colors';
import StartSniperButton from '@/components/StartSniperButton';
import StatusIndicator from '@/components/StatusIndicator';
import OverlayDemo from '@/components/OverlayDemo';
import TripOverlay from '@/components/TripOverlay';
import { useOverlayStore } from '@/store/overlayStore';

function HomeScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { showOverlay: showTripOverlay, hideOverlay, togglePositioningMode, positioningMode } = useOverlayStore();
  
  const toggleSniper = () => {
    if (!isActive) {
      // When activating, show the overlay demo
      setShowOverlay(true);
      showTripOverlay('green'); // Default to green for demo
    } else {
      // When deactivating, hide the overlay
      setShowOverlay(false);
      hideOverlay();
    }
    setIsActive(!isActive);
  };

  const handleEmergencyStop = () => {
    if (isActive) {
      Alert.alert(
        "Emergency Stop",
        "Are you sure you want to stop the Sniper?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Stop",
            onPress: () => {
              setIsActive(false);
              setShowOverlay(false);
              hideOverlay();
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  const simulateTrip = (quality: 'green' | 'yellow' | 'red') => {
    showTripOverlay(quality);
    setIsActive(true);
    setShowOverlay(false); // Hide demo overlay if active
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Rideshare Sniper',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <StatusIndicator isActive={isActive} />
          
          <View style={styles.buttonContainer}>
            <StartSniperButton 
              onPress={toggleSniper}
              isActive={isActive}
            />
            
            {isActive && (
              <TouchableOpacity 
                style={styles.emergencyButton}
                onPress={handleEmergencyStop}
              >
                <Text style={styles.emergencyButtonText}>Emergency Stop</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Today's Stats</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Trips</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>$0.00</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Hours</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewStatsButton}
              onPress={() => router.push('/stats')}
            >
              <Text style={styles.viewStatsText}>View Detailed Stats</Text>
              <ChevronRight size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>Pro Tips</Text>
              <Info size={20} color={colors.primary} />
            </View>
            
            <Text style={styles.tipText}>
              • Position the overlay buttons to match your rideshare app
            </Text>
            <Text style={styles.tipText}>
              • Green means the trip meets all your criteria for profitability
            </Text>
            <Text style={styles.tipText}>
              • Yellow means it's close but not perfect
            </Text>
            <Text style={styles.tipText}>
              • Red means the trip doesn't meet your standards
            </Text>
            <Text style={styles.tipText}>
              • Built by a rideshare driver for rideshare drivers
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => router.push('/help')}
          >
            <Text style={styles.helpButtonText}>Need Help?</Text>
          </TouchableOpacity>
          
          {/* Test Buttons for Overlay Simulation */}
          <View style={styles.testButtonsContainer}>
            <Text style={styles.testTitle}>Test Overlays</Text>
            <View style={styles.testButtonsRow}>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: colors.primary }]}
                onPress={() => simulateTrip('green')}
              >
                <Text style={styles.testButtonText}>Good Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: colors.warning }]}
                onPress={() => simulateTrip('yellow')}
              >
                <Text style={styles.testButtonText}>Maybe Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.testButton, { backgroundColor: colors.secondary }]}
                onPress={() => simulateTrip('red')}
              >
                <Text style={styles.testButtonText}>Bad Trip</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.testButton, styles.positionButton, positioningMode && styles.positionButtonActive]}
              onPress={togglePositioningMode}
            >
              <Text style={[styles.testButtonText, positioningMode && styles.positionTextActive]}>
                {positioningMode ? 'Lock Position' : 'Position Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Overlay Demo */}
      <OverlayDemo 
        visible={showOverlay} 
        onClose={() => {
          setShowOverlay(false);
          setIsActive(false);
          hideOverlay();
        }} 
      />
      
      {/* Trip Overlay */}
      <TripOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  emergencyButton: {
    marginTop: 16,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  viewStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  viewStatsText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 4,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  helpButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButtonsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  testButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  testButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  positionButton: {
    backgroundColor: colors.textSecondary,
    padding: 12,
    marginTop: 8,
  },
  positionButtonActive: {
    backgroundColor: colors.primary,
  },
  positionTextActive: {
    color: 'white',
  },
});

export default HomeScreen;