import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Play } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';
import OverlayDemo from './OverlayDemo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

export default function StartSniperButton() {
  const [showOverlayDemo, setShowOverlayDemo] = useState(false);
  const { driverStatus, setDriverStatus, sniperPermissionGranted } = useSettingsStore();
  const [overlayPositions, setOverlayPositions] = useState(null);
  
  // Load saved overlay positions on component mount
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const savedPositions = await AsyncStorage.getItem('overlayPositions');
        if (savedPositions) {
          setOverlayPositions(JSON.parse(savedPositions));
        }
      } catch (error) {
        console.error('Failed to load overlay positions:', error);
      }
    };
    loadPositions();
  }, []);
  
  const handleStartSniper = async () => {
    // Check if sniper permission is granted
    if (!sniperPermissionGranted) {
      alert("Please enable Sniper Permission in Settings to use this feature.");
      return;
    }
    
    // Vibration feedback - only on native platforms
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    if (driverStatus === 'offline') {
      setDriverStatus('online');
    }
    
    // Show overlay demo
    setShowOverlayDemo(true);
    
    // Try to launch Uber app if installed (only on native platforms)
    if (Platform.OS !== 'web') {
      tryLaunchUber();
    }
  };
  
  const tryLaunchUber = () => {
    // Try to launch the Uber Driver app specifically if installed
    try {
      Linking.canOpenURL('uber-driver://').then(supported => {
        if (supported) {
          Linking.openURL('uber-driver://').catch(err => {
            console.log('Error opening Uber Driver app:', err);
            // Try regular Uber app as fallback
            tryLaunchRegularUber();
          });
        } else {
          // Try regular Uber app as fallback
          tryLaunchRegularUber();
        }
      }).catch(err => {
        console.log('Error checking for Uber Driver app:', err);
        tryLaunchRegularUber();
      });
    } catch (error) {
      console.log('Deep linking error:', error);
      tryLaunchRegularUber();
    }
  };
  
  const tryLaunchRegularUber = () => {
    try {
      Linking.canOpenURL('uber://').then(uberSupported => {
        if (uberSupported) {
          Linking.openURL('uber://').catch(err => {
            console.log('Error opening Uber app:', err);
          });
        } else {
          console.log('Uber app not installed');
        }
      }).catch(err => {
        console.log('Error checking for Uber app:', err);
      });
    } catch (error) {
      console.log('Deep linking error:', error);
    }
  };
  
  return (
    <>
      {showOverlayDemo ? (
        <OverlayDemo 
          recommendation="accept" 
          onClose={() => setShowOverlayDemo(false)}
          initialPositions={overlayPositions}
        />
      ) : (
        <Pressable
          style={styles.button}
          onPress={handleStartSniper}
        >
          <View style={styles.buttonContent}>
            <Play size={24} color={colors.textPrimary} />
            <Text style={styles.buttonText}>START SNIPER</Text>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
    letterSpacing: 1,
  },
});