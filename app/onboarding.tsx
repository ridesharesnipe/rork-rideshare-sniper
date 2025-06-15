import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Shield, DollarSign, AlertTriangle, X, ChevronRight, MapPin, Bell, ChevronLeft, Navigation, Lock } from 'lucide-react-native';
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@/components/Slider';
import ToggleSwitch from '@/components/ToggleSwitch';
import OverlayDemo from '@/components/OverlayDemo';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { updateProfile } = useProfileStore();
  const { isAuthenticated } = useAuthStore();
  const { 
    setOverlayPermission, 
    setLocationPermission, 
    setNotificationPermission,
    areAllPermissionsGranted 
  } = useSettingsStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [minFare, setMinFare] = useState(10);
  const [maxPickupDistance, setMaxPickupDistance] = useState(5);
  const [maxDrivingDistance, setMaxDrivingDistance] = useState(15);
  const [currentDemo, setCurrentDemo] = useState<'accept' | 'reject' | 'consider' | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Essential permissions only
  const [overlayPermission, setOverlayPermissionLocal] = useState(false);
  const [notificationPermission, setNotificationPermissionLocal] = useState(false);
  const [locationPermission, setLocationPermissionLocal] = useState(false);
  
  const handleNext = () => {
    // If we're on the permissions step, check if permissions are granted
    if (currentStep === 4) {
      if (!overlayPermission || !notificationPermission || !locationPermission) {
        Alert.alert(
          "Permissions Required",
          "Please enable all permissions to continue. These are required for the app to function properly.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  
  const handleFinish = async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    try {
      console.log("Finishing onboarding");
      
      // Save permissions to store
      setOverlayPermission(overlayPermission);
      setLocationPermission(locationPermission);
      setNotificationPermission(notificationPermission);
      
      // Update the default profile with the onboarding settings
      updateProfile('1', {
        minFare,
        maxPickupDistance,
        maxDrivingDistance,
      });
      
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      console.log("Onboarding complete, navigating to main app");
      
      // Navigate directly to tabs or login based on authentication status
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Even if there's an error, try to navigate to the app
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const skipToApp = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    // Skip directly to tabs or login based on authentication status
    try {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error navigating:', error);
      // Fallback navigation
      router.replace('/auth/login');
    } finally {
      setIsNavigating(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.crosshairLogo}>
              <View style={styles.crosshairHorizontal} />
              <View style={styles.crosshairVertical} />
              <View style={styles.crosshairCenter} />
              <View style={styles.crosshairRing} />
            </View>
            
            <Text style={styles.title}>RIDESHARE SNIPER</Text>
            <Text style={styles.tagline}>Precision. Profit. Protection.</Text>
            <Text style={styles.subtitle}>Your rideshare mission control</Text>
            
            <Text style={styles.description}>
              Rideshare Sniper helps you make quick decisions about trip requests while driving.
              Set your preferences, and we'll show you clear visual signals for each trip.
            </Text>
            
            <View style={styles.demoContainer}>
              <Pressable 
                style={[styles.demoButton, styles.acceptDemoButton]}
                onPress={() => setCurrentDemo('accept')}
              >
                <View style={styles.crosshairIcon}>
                  <View style={styles.crosshairHorizontalSmall} />
                  <View style={styles.crosshairVerticalSmall} />
                  <View style={styles.crosshairCenterSmall} />
                </View>
                <Text style={styles.demoButtonText}>Green Crosshair</Text>
                <Text style={styles.demoButtonSubtext}>Place over Accept button</Text>
                <Text style={styles.viewDemoText}>View Demo</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, styles.considerDemoButton]}
                onPress={() => setCurrentDemo('consider')}
              >
                <AlertTriangle size={24} color={colors.textPrimary} />
                <Text style={styles.demoButtonText}>Yellow Warning</Text>
                <Text style={styles.demoButtonSubtext}>Place above trip details</Text>
                <Text style={styles.viewDemoText}>View Demo</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, styles.rejectDemoButton]}
                onPress={() => setCurrentDemo('reject')}
              >
                <X size={24} color={colors.textPrimary} />
                <Text style={styles.demoButtonText}>Red X</Text>
                <Text style={styles.demoButtonSubtext}>Place near close button</Text>
                <Text style={styles.viewDemoText}>View Demo</Text>
              </Pressable>
            </View>

            <Pressable style={styles.skipButton} onPress={skipToApp}>
              <Text style={styles.skipButtonText}>SKIP TUTORIAL</Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <DollarSign size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Set Minimum Fare</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Set the minimum fare you're willing to accept. Trips below this amount will be marked with a red X.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>${minFare.toFixed(2)}</Text>
              <Slider
                value={minFare}
                minimumValue={5}
                maximumValue={25}
                step={0.5}
                onValueChange={setMinFare}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>$5</Text>
                <Text style={styles.sliderLabel}>$25</Text>
              </View>
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>Recommendation</Text>
              <Text style={styles.infoPanelText}>
                Most drivers set their minimum fare between $8-$12 depending on their market.
                Consider your expenses and time value when setting this threshold.
              </Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <MapPin size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Maximum Pickup Distance</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Set the maximum distance you're willing to travel for pickup. Trips with longer pickup distances will be marked with a red X.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{maxPickupDistance.toFixed(1)} mi</Text>
              <Slider
                value={maxPickupDistance}
                minimumValue={1}
                maximumValue={10}
                step={0.5}
                onValueChange={setMaxPickupDistance}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1 mi</Text>
                <Text style={styles.sliderLabel}>10 mi</Text>
              </View>
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>Recommendation</Text>
              <Text style={styles.infoPanelText}>
                Long pickup distances can reduce your hourly earnings. Most drivers set this between 3-5 miles for optimal efficiency.
              </Text>
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Navigation size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Maximum Driving Distance</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Set the maximum distance you're willing to drive for the trip itself. Longer trips will be marked with a red X.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{maxDrivingDistance.toFixed(1)} mi</Text>
              <Slider
                value={maxDrivingDistance}
                minimumValue={5}
                maximumValue={30}
                step={1}
                onValueChange={setMaxDrivingDistance}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>5 mi</Text>
                <Text style={styles.sliderLabel}>30 mi</Text>
              </View>
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>Recommendation</Text>
              <Text style={styles.infoPanelText}>
                Consider your market and strategy when setting this. Short trips (10-15 miles) are often more profitable in dense urban areas, while longer trips may be better in suburban or rural areas.
              </Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Lock size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Essential Permissions</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Rideshare Sniper needs these 3 essential permissions to function properly:
            </Text>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <Lock size={20} color={colors.primary} />
                <Text style={styles.permissionTitle}>Screen Overlay</Text>
                <ToggleSwitch
                  value={overlayPermission}
                  onValueChange={setOverlayPermissionLocal}
                />
              </View>
              <Text style={styles.permissionDescription}>
                Display indicators over your rideshare app (green crosshair, yellow warning, red X)
              </Text>
            </View>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <Bell size={20} color={colors.primary} />
                <Text style={styles.permissionTitle}>Notifications</Text>
                <ToggleSwitch
                  value={notificationPermission}
                  onValueChange={setNotificationPermissionLocal}
                />
              </View>
              <Text style={styles.permissionDescription}>
                Detect incoming trip requests from Uber and Lyft
              </Text>
            </View>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.permissionTitle}>Location</Text>
                <ToggleSwitch
                  value={locationPermission}
                  onValueChange={setLocationPermissionLocal}
                />
              </View>
              <Text style={styles.permissionDescription}>
                Calculate accurate distances for pickup and trip evaluation
              </Text>
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>Privacy Commitment</Text>
              <Text style={styles.infoPanelText}>
                We never store or transmit your trip data. All processing happens locally on your device.
                Your privacy and account security are our top priorities.
              </Text>
            </View>
            
            {(!overlayPermission || !notificationPermission || !locationPermission) && (
              <View style={styles.permissionWarning}>
                <AlertTriangle size={20} color={colors.warning} />
                <Text style={styles.permissionWarningText}>
                  All permissions are required for Rideshare Sniper to function properly.
                </Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {currentDemo ? (
        <OverlayDemo 
          recommendation={currentDemo} 
          onClose={() => setCurrentDemo(null)} 
        />
      ) : (
        <>
          {/* Back button - only show if we can go back */}
          {navigation.canGoBack() && (
            <Pressable 
              style={styles.backButtonSmall} 
              onPress={handleBack}
            >
              <ChevronLeft size={20} color={colors.textSecondary} />
            </Pressable>
          )}
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {renderStep()}
          </ScrollView>
          
          <View style={styles.footer}>
            {currentStep > 0 && (
              <Pressable style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>BACK</Text>
              </Pressable>
            )}
            
            <Pressable 
              style={[
                styles.nextButton, 
                (currentStep === 4 && (!overlayPermission || !notificationPermission || !locationPermission)) ? 
                  styles.nextButtonDisabled : {}
              ]} 
              onPress={handleNext}
              disabled={currentStep === 4 && (!overlayPermission || !notificationPermission || !locationPermission)}
            >
              <Text style={styles.nextButtonText}>
                {currentStep < 4 ? 'NEXT' : 'COMPLETE SETUP'}
              </Text>
              <ChevronRight size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.progressContainer}>
            {[0, 1, 2, 3, 4].map((step) => (
              <View 
                key={step}
                style={[
                  styles.progressDot,
                  currentStep === step ? styles.progressDotActive : {}
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepContainer: {
    padding: 24,
  },
  crosshairLogo: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 100,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  crosshairRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  demoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  demoButton: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
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
  crosshairIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontalSmall: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVerticalSmall: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenterSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  demoButtonSubtext: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  viewDemoText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  sliderContainer: {
    marginBottom: 32,
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoPanel: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoPanelText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  permissionItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  permissionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  permissionWarningText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  backButtonSmall: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    opacity: 0.7,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
});