import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import { Play } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';
import OverlayDemo from './OverlayDemo';
import * as Linking from 'expo-linking';

export default function StartSniperButton() {
  const [showOverlayDemo, setShowOverlayDemo] = useState(false);
  const { driverStatus, setDriverStatus, sniperPermissionGranted } = useSettingsStore();
  
  const handleStartSniper = async () => {
    // Check permission
    if (!sniperPermissionGranted) {
      Alert.alert(
        "Permission Required",
        "Please enable Overlay Permission in Settings to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Settings", onPress: () => Linking.openURL('app-settings:') }
        ]
      );
      return;
    }
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    // Set driver status to online
    if (driverStatus === 'offline') {
      setDriverStatus('online');
    }
    
    // Show overlay demo
    setShowOverlayDemo(true);
    
    // Try to launch Uber app
    if (Platform.OS !== 'web') {
      tryLaunchUber();
    }
  };
  
  const tryLaunchUber = () => {
    try {
      Linking.canOpenURL('uber://').then(supported => {
        if (supported) {
          Linking.openURL('uber://');
        } else {
          Alert.alert(
            "Uber App Not Found",
            "Please install the Uber Driver app to use this feature.",
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
        }
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
          <Text style={styles.buttonSubtext}>
            Launch overlay with Uber app
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