import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking, Platform } from 'react-native';
import { Play, AlertTriangle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';
import OverlayDemo from './OverlayDemo';

export default function StartSniperButton() {
  const [showOverlayDemo, setShowOverlayDemo] = useState(false);
  const { driverStatus, setDriverStatus, areAllPermissionsGranted } = useSettingsStore();
  
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
    
    // Check if all permissions are granted
    if (areAllPermissionsGranted()) {
      // If all permissions are granted, automatically launch Uber and show overlay
      setShowOverlayDemo(true);
      
      // Try to launch Uber app if installed (only on native platforms)
      if (Platform.OS !== 'web') {
        tryLaunchUber();
      }
    } else {
      // If permissions are not granted, show an alert to inform the user
      Alert.alert(
        "Permissions Required",
        "Please grant all necessary permissions before starting the sniper. You will be directed to settings.",
        [
          { 
            text: "Go to Settings", 
            onPress: () => {
              // Here you would navigate to settings screen
              // For now, we'll just show a message
              Alert.alert("Navigation", "Please navigate to Settings tab to grant permissions.");
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
          });
        } else {
          // Try regular Uber app as fallback
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
        }
      }).catch(err => {
        console.log('Error checking for Uber Driver app:', err);
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
              Launches Uber with overlay
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