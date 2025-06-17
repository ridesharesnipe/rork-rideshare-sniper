import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Settings, Play } from 'lucide-react-native';
import colors from '@/constants/colors';
import OverlayDemo from '@/components/OverlayDemo';
import InteractiveDemo from '@/components/InteractiveDemo';
import Slider from '@/components/Slider';

interface CriteriaState {
  minFare: number;
  maxPickupDistance: number;
  maxPickupTime: number;
  minRating: number;
  acceptShare: boolean;
}

export default function SimulatorScreen() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);
  const [isPositionMode, setIsPositionMode] = useState(false);
  const [criteria, setCriteria] = useState<CriteriaState>({
    minFare: 5.00,
    maxPickupDistance: 5.0,
    maxPickupTime: 10,
    minRating: 4.7,
    acceptShare: true,
  });

  const updateCriteria = (key: keyof CriteriaState, value: number | boolean) => {
    setCriteria(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (showInteractiveDemo) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Interactive Demo',
            headerRight: () => (
              <TouchableOpacity style={styles.headerButton} onPress={() => setShowInteractiveDemo(false)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <InteractiveDemo />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Trip Simulator',
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Trip Request Simulator</Text>
          <Text style={styles.description}>
            Test how the Sniper overlay will appear on top of Uber trip requests.
            Position the accept/reject buttons to match your app's layout.
          </Text>

          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => setShowOverlay(true)}
          >
            <Play size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.demoButtonText}>Show Demo Overlay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.demoButton, { backgroundColor: colors.primary }]} 
            onPress={() => setShowInteractiveDemo(true)}
          >
            <Play size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.demoButtonText}>Interactive Trip Demo</Text>
          </TouchableOpacity>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Trip Criteria</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Minimum Fare</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    minimumValue={1}
                    maximumValue={20}
                    step={0.5}
                    value={criteria.minFare}
                    onValueChange={(value: number) => updateCriteria('minFare', value)}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={colors.primary}
                  />
                </View>
                <Text style={styles.settingValue}>${criteria.minFare.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Max Pickup Distance</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    minimumValue={1}
                    maximumValue={10}
                    step={0.5}
                    value={criteria.maxPickupDistance}
                    onValueChange={(value: number) => updateCriteria('maxPickupDistance', value)}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={colors.primary}
                  />
                </View>
                <Text style={styles.settingValue}>{criteria.maxPickupDistance.toFixed(1)} mi</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Max Pickup Time</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    minimumValue={1}
                    maximumValue={20}
                    step={1}
                    value={criteria.maxPickupTime}
                    onValueChange={(value: number) => updateCriteria('maxPickupTime', value)}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={colors.primary}
                  />
                </View>
                <Text style={styles.settingValue}>{criteria.maxPickupTime} min</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Minimum Rating</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    minimumValue={3.0}
                    maximumValue={5.0}
                    step={0.1}
                    value={criteria.minRating}
                    onValueChange={(value: number) => updateCriteria('minRating', value)}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={colors.primary}
                  />
                </View>
                <Text style={styles.settingValue}>{criteria.minRating.toFixed(1)}⭐</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Accept Shared Rides</Text>
              <Switch
                value={criteria.acceptShare}
                onValueChange={(value: boolean) => updateCriteria('acceptShare', value)}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={criteria.acceptShare ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How It Works</Text>
            <Text style={styles.infoText}>
              1. The overlay will appear on top of Uber's trip request screen
            </Text>
            <Text style={styles.infoText}>
              2. Green indicator means the trip meets your criteria
            </Text>
            <Text style={styles.infoText}>
              3. Yellow means it's borderline but may be worth taking
            </Text>
            <Text style={styles.infoText}>
              4. Red means the trip doesn't meet your criteria
            </Text>
            <Text style={styles.infoText}>
              5. Drag the red X button to position it over Uber's X button
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Overlay Demo */}
      <OverlayDemo 
        visible={showOverlay} 
        onClose={() => setShowOverlay(false)} 
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
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  demoButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderWrapper: {
    flex: 1,
    height: 40,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    width: 60,
    textAlign: 'right',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
});