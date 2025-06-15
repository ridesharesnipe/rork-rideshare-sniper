import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking, Platform } from 'react-native';
import { Play, AlertTriangle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';
import OverlayDemo from './OverlayDemo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartSniperButton() {
  const [showOverlayDemo, setShowOverlayDemo] = useState(false);
  const { driverStatus, setDriverStatus, isSniperPermissionGranted } = useSettingsStore();
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
    
    // Check if permission is granted
    if (isSniperPermissionGranted()) {
      // If permission is granted, automatically launch Uber and show overlay
      setShowOverlayDemo(true);
      
      // Try to launch Uber app if installed (only on native platforms)
      if (Platform.OS !== 'web') {
        tryLaunchUber();
      }
    } else {
      // If permission is not granted, show an alert to inform the user
      Alert.alert(
        "Permission Required",
        "Please grant the Sniper permission before starting. This is required for the app to function properly.",
        [
          { 
            text: "Go to Settings", 
            onPress: () => {
              // Navigate to settings would happen here
              console.log("Navigate to Settings tab");
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
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
            // If both Uber apps fail to open, show a message
            Alert.alert(
              "Uber App Not Found",
              "Please install the Uber Driver or Uber app to use this feature.",
              [{ text: "OK" }]
            );
          });
        } else {
          console.log('Uber app not installed');
          // If both Uber apps are not installed, show a message
          Alert.alert(
            "Uber App Not Found",
            "Please install the Uber Driver or Uber app to use this feature.",
            [{ text: "OK" }]
          );
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
          
          <View style={styles.infoContainer}>
            <AlertTriangle size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {isSniperPermissionGranted() 
                ? "Launches Uber with overlay" 
                : "Permission required"}
            </Text>
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});