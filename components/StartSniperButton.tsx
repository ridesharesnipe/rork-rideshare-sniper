import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
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
  const [launchAttempted, setLaunchAttempted] = useState(false);
  
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
      Alert.alert(
        "Permission Required",
        "Please enable Sniper Permission in Settings to use this feature. This allows the app to display overlays on your screen.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Settings", onPress: () => Linking.openURL('app-settings:') }
        ]
      );
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
    setLaunchAttempted(false);
    
    // Try to launch Uber app if installed (only on native platforms)
    if (Platform.OS !== 'web') {
      tryLaunchUber();
    }
  };
  
  const tryLaunchUber = () => {
    // Try to launch the Uber Driver app specifically if installed
    try {
      console.log('Attempting to launch Uber Driver app...');
      Linking.canOpenURL('uber-driver://').then(supported => {
        if (supported) {
          console.log('Uber Driver app is installed, launching...');
          Linking.openURL('uber-driver://').then(() => {
            console.log('Uber Driver app launched successfully');
            setLaunchAttempted(true);
          }).catch(err => {
            console.log('Error opening Uber Driver app:', err);
            // Try regular Uber app as fallback
            tryLaunchRegularUber();
          });
        } else {
          console.log('Uber Driver app not installed, trying regular Uber app');
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
      console.log('Attempting to launch regular Uber app...');
      Linking.canOpenURL('uber://').then(uberSupported => {
        if (uberSupported) {
          console.log('Regular Uber app is installed, launching...');
          Linking.openURL('uber://').then(() => {
            console.log('Regular Uber app launched successfully');
            setLaunchAttempted(true);
          }).catch(err => {
            console.log('Error opening Uber app:', err);
            showUberNotInstalledAlert();
          });
        } else {
          console.log('Uber app not installed');
          showUberNotInstalledAlert();
        }
      }).catch(err => {
        console.log('Error checking for Uber app:', err);
        showUberNotInstalledAlert();
      });
    } catch (error) {
      console.log('Deep linking error:', error);
      showUberNotInstalledAlert();
    }
  };
  
  const showUberNotInstalledAlert = () => {
    Alert.alert(
      "Uber App Not Found",
      "We couldn't find the Uber Driver app on your device. Would you like to download it?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Download", 
          onPress: () => {
            const storeUrl = Platform.OS === 'ios' 
              ? 'https://apps.apple.com/us/app/uber-driver/id1131342792'
              : 'https://play.google.com/store/apps/details?id=com.ubercab.driver';
            Linking.openURL(storeUrl);
          }
        }
      ]
    );
  };
  
  return (
    <>
      {showOverlayDemo ? (
        <OverlayDemo 
          recommendation="accept" 
          onClose={() => setShowOverlayDemo(false)}
          initialPositions={overlayPositions}
          launchAttempted={launchAttempted}
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
          <Text style={styles.buttonSubtext}>
            Launches Uber Driver app with overlay
          </Text>
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
  buttonSubtext: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
});