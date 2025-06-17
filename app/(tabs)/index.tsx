import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, Info, ChevronRight, Radar } from 'lucide-react-native';
import colors from '@/constants/colors';
import StartSniperButton from '@/components/StartSniperButton';
import StatusIndicator from '@/components/StatusIndicator';
import OverlayDemo from '@/components/OverlayDemo';

export default function HomeScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const toggleSniper = () => {
    if (!isActive) {
      // When activating, show the overlay demo
      setShowOverlay(true);
    } else {
      // When deactivating, hide the overlay
      setShowOverlay(false);
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
            },
            style: "destructive"
          }
        ]
      );
    }
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
              • Green means the trip meets all your criteria
            </Text>
            <Text style={styles.tipText}>
              • Yellow means it's close but not perfect
            </Text>
            <Text style={styles.tipText}>
              • Red means the trip doesn't meet your standards
            </Text>
            <Text style={styles.tipText}>
              • Made by a rideshare driver for rideshare drivers
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => router.push('/help')}
          >
            <Text style={styles.helpButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Overlay Demo */}
      <OverlayDemo 
        visible={showOverlay} 
        onClose={() => {
          setShowOverlay(false);
          setIsActive(false);
        }} 
      />
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
    padding: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 30,
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
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  viewStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  viewStatsText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 5,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tipText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 22,
  },
  helpButton: {
    backgroundColor: colors.surfaceLight,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});