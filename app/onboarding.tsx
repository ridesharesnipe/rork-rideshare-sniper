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

export default function OnboardingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { updateProfile } = useProfileStore();
  const { isAuthenticated } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [minFare, setMinFare] = useState(10);
  const [maxPickupDistance, setMaxPickupDistance] = useState(5);
  const [maxDrivingDistance, setMaxDrivingDistance] = useState(15); // New state for driving distance
  const [onlyShowProfitable, setOnlyShowProfitable] = useState(true);
  const [currentDemo, setCurrentDemo] = useState<'accept' | 'reject' | 'consider' | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Permission states
  const [screenOverlayPermission, setScreenOverlayPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  
  // New state for permission tabs
  const [activePermissionTab, setActivePermissionTab] = useState<'overlay' | 'notification' | 'location'>('overlay');
  
  const handleNext = () => {
    // If we're on the permissions step, check if permissions are granted
    if (currentStep === 5) {
      if (!screenOverlayPermission || !notificationPermission || !locationPermission) {
        Alert.alert(
          "Permissions Required",
          "Please enable all permissions to continue. These are required for the app to function properly.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    if (currentStep < 5) { // Updated to account for new step
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
      // Update the default profile with the onboarding settings
      updateProfile('1', {
        minFare,
        maxPickupDistance,
        maxDrivingDistance, // Added new field
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
    }
  };
  
  // For Android, use a simpler version of the onboarding screen
  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.stepContainer}>
            {/* Back button - only show if we can go back */}
            {navigation.canGoBack() && (
              <Pressable 
                style={styles.backButtonSmall} 
                onPress={() => navigation.goBack()}
              >
                <ChevronLeft size={20} color={colors.textSecondary} />
              </Pressable>
            )}
            
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
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>${minFare.toFixed(2)}</Text>
              <Text style={styles.label}>Minimum Fare</Text>
              <Slider
                value={minFare}
                minimumValue={5}
                maximumValue={25}
                step={0.5}
                onValueChange={setMinFare}
              />
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{maxPickupDistance.toFixed(1)} mi</Text>
              <Text style={styles.label}>Maximum Pickup Distance</Text>
              <Slider
                value={maxPickupDistance}
                minimumValue={1}
                maximumValue={10}
                step={0.5}
                onValueChange={setMaxPickupDistance}
              />
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{maxDrivingDistance.toFixed(1)} mi</Text>
              <Text style={styles.label}>Maximum Driving Distance</Text>
              <Slider
                value={maxDrivingDistance}
                minimumValue={5}
                maximumValue={30}
                step={1}
                onValueChange={setMaxDrivingDistance}
              />
            </View>
            
            {/* Permission section for Android with tabs */}
            <View style={styles.permissionsContainer}>
              <Text style={styles.permissionsTitle}>Required Permissions</Text>
              <Text style={styles.permissionsSubtitle}>
                Please enable the following permissions for Rideshare Sniper to function properly:
              </Text>
              
              {/* Permission Tabs */}
              <View style={styles.permissionTabs}>
                <Pressable 
                  style={[
                    styles.permissionTab, 
                    activePermissionTab === 'overlay' && styles.permissionTabActive
                  ]}
                  onPress={() => setActivePermissionTab('overlay')}
                >
                  <Lock size={16} color={activePermissionTab === 'overlay' ? colors.primary : colors.textSecondary} />
                  <Text 
                    style={[
                      styles.permissionTabText,
                      activePermissionTab === 'overlay' && styles.permissionTabTextActive
                    ]}
                  >
                    Overlay
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={[
                    styles.permissionTab, 
                    activePermissionTab === 'notification' && styles.permissionTabActive
                  ]}
                  onPress={() => setActivePermissionTab('notification')}
                >
                  <Bell size={16} color={activePermissionTab === 'notification' ? colors.primary : colors.textSecondary} />
                  <Text 
                    style={[
                      styles.permissionTabText,
                      activePermissionTab === 'notification' && styles.permissionTabTextActive
                    ]}
                  >
                    Notifications
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={[
                    styles.permissionTab, 
                    activePermissionTab === 'location' && styles.permissionTabActive
                  ]}
                  onPress={() => setActivePermissionTab('location')}
                >
                  <MapPin size={16} color={activePermissionTab === 'location' ? colors.primary : colors.textSecondary} />
                  <Text 
                    style={[
                      styles.permissionTabText,
                      activePermissionTab === 'location' && styles.permissionTabTextActive
                    ]}
                  >
                    Location
                  </Text>
                </Pressable>
              </View>
              
              {/* Permission Content based on active tab */}
              <View style={styles.permissionContent}>
                {activePermissionTab === 'overlay' && (
                  <View style={styles.permissionTabContent}>
                    <Text style={styles.permissionTabContentTitle}>Screen Overlay Permission</Text>
                    <Text style={styles.permissionTabContentDescription}>
                      Rideshare Sniper needs to display indicators over your rideshare app. This permission allows us to show the green crosshair, yellow warning, or red X directly on your screen while you're using Uber or Lyft.
                    </Text>
                    <View style={styles.permissionToggleContainer}>
                      <Text style={styles.permissionToggleText}>
                        {screenOverlayPermission ? "Permission Granted" : "Grant Permission"}
                      </Text>
                      <ToggleSwitch
                        value={screenOverlayPermission}
                        onValueChange={setScreenOverlayPermission}
                      />
                    </View>
                    {!screenOverlayPermission && (
                      <Text style={styles.permissionRequiredText}>
                        * This permission is required to continue
                      </Text>
                    )}
                  </View>
                )}
                
                {activePermissionTab === 'notification' && (
                  <View style={styles.permissionTabContent}>
                    <Text style={styles.permissionTabContentTitle}>Notification Access</Text>
                    <Text style={styles.permissionTabContentDescription}>
                      Rideshare Sniper needs to detect incoming trip requests from Uber and Lyft. This permission allows us to analyze notifications to identify trip details and provide real-time recommendations.
                    </Text>
                    <View style={styles.permissionToggleContainer}>
                      <Text style={styles.permissionToggleText}>
                        {notificationPermission ? "Permission Granted" : "Grant Permission"}
                      </Text>
                      <ToggleSwitch
                        value={notificationPermission}
                        onValueChange={setNotificationPermission}
                      />
                    </View>
                    {!notificationPermission && (
                      <Text style={styles.permissionRequiredText}>
                        * This permission is required to continue
                      </Text>
                    )}
                  </View>
                )}
                
                {activePermissionTab === 'location' && (
                  <View style={styles.permissionTabContent}>
                    <Text style={styles.permissionTabContentTitle}>Location Access</Text>
                    <Text style={styles.permissionTabContentDescription}>
                      Rideshare Sniper needs your location to calculate accurate distances for pickup and trip evaluation. We only use your location while the app is active and never share it with third parties.
                    </Text>
                    <View style={styles.permissionToggleContainer}>
                      <Text style={styles.permissionToggleText}>
                        {locationPermission ? "Permission Granted" : "Grant Permission"}
                      </Text>
                      <ToggleSwitch
                        value={locationPermission}
                        onValueChange={setLocationPermission}
                      />
                    </View>
                    {!locationPermission && (
                      <Text style={styles.permissionRequiredText}>
                        * This permission is required to continue
                      </Text>
                    )}
                  </View>
                )}
              </View>
              
              {/* Permission Status Indicators */}
              <View style={styles.permissionStatusContainer}>
                <View style={styles.permissionStatusItem}>
                  <View style={[
                    styles.permissionStatusDot,
                    screenOverlayPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                  ]} />
                  <Text style={styles.permissionStatusText}>Overlay</Text>
                </View>
                
                <View style={styles.permissionStatusItem}>
                  <View style={[
                    styles.permissionStatusDot,
                    notificationPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                  ]} />
                  <Text style={styles.permissionStatusText}>Notifications</Text>
                </View>
                
                <View style={styles.permissionStatusItem}>
                  <View style={[
                    styles.permissionStatusDot,
                    locationPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                  ]} />
                  <Text style={styles.permissionStatusText}>Location</Text>
                </View>
              </View>
            </View>
            
            <Pressable 
              style={[
                styles.nextButton, 
                (!screenOverlayPermission || !notificationPermission || !locationPermission) ? 
                  styles.nextButtonDisabled : {}
              ]} 
              onPress={handleFinish}
              disabled={!screenOverlayPermission || !notificationPermission || !locationPermission}
            >
              <Text style={styles.nextButtonText}>GET STARTED</Text>
              <ChevronRight size={20} color={colors.textPrimary} />
            </Pressable>

            <Pressable style={styles.skipButton} onPress={skipToApp}>
              <Text style={styles.skipButtonText}>SKIP TUTORIAL</Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }
  
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
            
            <View style={styles.filterTipBox}>
              <Text style={styles.filterTipTitle}>WHERE TO FIND THIS LATER:</Text>
              <Text style={styles.filterTipText}>
                You can adjust this filter anytime in Settings → Trip Filters or by tapping "Edit Filters" on the home screen.
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
            
            <View style={styles.filterTipBox}>
              <Text style={styles.filterTipTitle}>WHERE TO FIND THIS LATER:</Text>
              <Text style={styles.filterTipText}>
                You can adjust this filter anytime in Settings → Trip Filters or by tapping "Edit Filters" on the home screen.
              </Text>
            </View>
          </View>
        );
      
      case 3:
        // New step for Maximum Driving Distance
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
            
            <View style={styles.filterTipBox}>
              <Text style={styles.filterTipTitle}>WHERE TO FIND THIS LATER:</Text>
              <Text style={styles.filterTipText}>
                You can adjust this filter anytime in Settings → Trip Filters or by tapping "Edit Filters" on the home screen.
              </Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <AlertTriangle size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Trip Filter Settings</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Configure how Rideshare Sniper evaluates and displays trip requests.
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Only Show Profitable Trips</Text>
                <Text style={styles.settingDescription}>
                  When enabled, only trips that meet your criteria will show a green crosshair.
                </Text>
              </View>
              <ToggleSwitch
                value={onlyShowProfitable}
                onValueChange={setOnlyShowProfitable}
              />
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>How It Works</Text>
              <Text style={styles.infoPanelText}>
                Rideshare Sniper evaluates each trip based on fare amount, pickup distance, driving distance, and estimated trip duration.
                We never auto-accept or block trips - we just provide clear visual signals to help you decide quickly.
              </Text>
            </View>
            
            {/* Removed the advanced filters tip box */}
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Lock size={28} color={colors.primary} />
              <Text style={styles.stepTitle}>Required Permissions</Text>
            </View>
            
            <Text style={styles.stepDescription}>
              Rideshare Sniper needs the following permissions to function properly. Please enable each one to continue:
            </Text>
            
            {/* Permission Tabs */}
            <View style={styles.permissionTabs}>
              <Pressable 
                style={[
                  styles.permissionTab, 
                  activePermissionTab === 'overlay' && styles.permissionTabActive
                ]}
                onPress={() => setActivePermissionTab('overlay')}
              >
                <Lock size={16} color={activePermissionTab === 'overlay' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.permissionTabText,
                    activePermissionTab === 'overlay' && styles.permissionTabTextActive
                  ]}
                >
                  Overlay
                </Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.permissionTab, 
                  activePermissionTab === 'notification' && styles.permissionTabActive
                ]}
                onPress={() => setActivePermissionTab('notification')}
              >
                <Bell size={16} color={activePermissionTab === 'notification' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.permissionTabText,
                    activePermissionTab === 'notification' && styles.permissionTabTextActive
                  ]}
                >
                  Notifications
                </Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.permissionTab, 
                  activePermissionTab === 'location' && styles.permissionTabActive
                ]}
                onPress={() => setActivePermissionTab('location')}
              >
                <MapPin size={16} color={activePermissionTab === 'location' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.permissionTabText,
                    activePermissionTab === 'location' && styles.permissionTabTextActive
                  ]}
                >
                  Location
                </Text>
              </Pressable>
            </View>
            
            {/* Permission Content based on active tab */}
            <View style={styles.permissionContent}>
              {activePermissionTab === 'overlay' && (
                <View style={styles.permissionTabContent}>
                  <Text style={styles.permissionTabContentTitle}>Screen Overlay Permission</Text>
                  <Text style={styles.permissionTabContentDescription}>
                    Rideshare Sniper needs to display indicators over your rideshare app. This permission allows us to show the green crosshair, yellow warning, or red X directly on your screen while you're using Uber or Lyft.
                  </Text>
                  <View style={styles.permissionToggleContainer}>
                    <Text style={styles.permissionToggleText}>
                      {screenOverlayPermission ? "Permission Granted" : "Grant Permission"}
                    </Text>
                    <ToggleSwitch
                      value={screenOverlayPermission}
                      onValueChange={setScreenOverlayPermission}
                    />
                  </View>
                  {!screenOverlayPermission && (
                    <Text style={styles.permissionRequiredText}>
                      * This permission is required to continue
                    </Text>
                  )}
                </View>
              )}
              
              {activePermissionTab === 'notification' && (
                <View style={styles.permissionTabContent}>
                  <Text style={styles.permissionTabContentTitle}>Notification Access</Text>
                  <Text style={styles.permissionTabContentDescription}>
                    Rideshare Sniper needs to detect incoming trip requests from Uber and Lyft. This permission allows us to analyze notifications to identify trip details and provide real-time recommendations.
                  </Text>
                  <View style={styles.permissionToggleContainer}>
                    <Text style={styles.permissionToggleText}>
                      {notificationPermission ? "Permission Granted" : "Grant Permission"}
                    </Text>
                    <ToggleSwitch
                      value={notificationPermission}
                      onValueChange={setNotificationPermission}
                    />
                  </View>
                  {!notificationPermission && (
                    <Text style={styles.permissionRequiredText}>
                      * This permission is required to continue
                    </Text>
                  )}
                </View>
              )}
              
              {activePermissionTab === 'location' && (
                <View style={styles.permissionTabContent}>
                  <Text style={styles.permissionTabContentTitle}>Location Access</Text>
                  <Text style={styles.permissionTabContentDescription}>
                    Rideshare Sniper needs your location to calculate accurate distances for pickup and trip evaluation. We only use your location while the app is active and never share it with third parties.
                  </Text>
                  <View style={styles.permissionToggleContainer}>
                    <Text style={styles.permissionToggleText}>
                      {locationPermission ? "Permission Granted" : "Grant Permission"}
                    </Text>
                    <ToggleSwitch
                      value={locationPermission}
                      onValueChange={setLocationPermission}
                    />
                  </View>
                  {!locationPermission && (
                    <Text style={styles.permissionRequiredText}>
                      * This permission is required to continue
                    </Text>
                  )}
                </View>
              )}
            </View>
            
            {/* Permission Status Indicators */}
            <View style={styles.permissionStatusContainer}>
              <View style={styles.permissionStatusItem}>
                <View style={[
                  styles.permissionStatusDot,
                  screenOverlayPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                ]} />
                <Text style={styles.permissionStatusText}>Overlay</Text>
              </View>
              
              <View style={styles.permissionStatusItem}>
                <View style={[
                  styles.permissionStatusDot,
                  notificationPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                ]} />
                <Text style={styles.permissionStatusText}>Notifications</Text>
              </View>
              
              <View style={styles.permissionStatusItem}>
                <View style={[
                  styles.permissionStatusDot,
                  locationPermission ? styles.permissionStatusDotGranted : styles.permissionStatusDotDenied
                ]} />
                <Text style={styles.permissionStatusText}>Location</Text>
              </View>
            </View>
            
            <View style={styles.infoPanel}>
              <Text style={styles.infoPanelTitle}>Privacy Commitment</Text>
              <Text style={styles.infoPanelText}>
                We never store or transmit your trip data. All processing happens locally on your device.
                Your privacy and account security are our top priorities.
              </Text>
            </View>
            
            {(!screenOverlayPermission || !notificationPermission || !locationPermission) && (
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
                (currentStep === 5 && (!screenOverlayPermission || !notificationPermission || !locationPermission)) ? 
                  styles.nextButtonDisabled : {}
              ]} 
              onPress={handleNext}
              disabled={currentStep === 5 && (!screenOverlayPermission || !notificationPermission || !locationPermission)}
            >
              <Text style={styles.nextButtonText}>
                {currentStep < 5 ? 'NEXT' : 'COMPLETE SETUP'}
              </Text>
              <ChevronRight size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.progressContainer}>
            {[0, 1, 2, 3, 4, 5].map((step) => (
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
  // New filter tip box
  filterTipBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  filterTipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  filterTipText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  permissionItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // New permission toggle styles
  permissionToggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  permissionToggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  permissionToggleDescription: {
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
  // Android-specific permission container
  permissionsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  permissionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  permissionsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
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
  // New permission tab styles
  permissionTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  permissionTabActive: {
    backgroundColor: colors.primary,
  },
  permissionTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  permissionTabTextActive: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  permissionContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionTabContent: {
    gap: 12,
  },
  permissionTabContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  permissionTabContentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  permissionToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  permissionToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  permissionRequiredText: {
    fontSize: 14,
    color: colors.warning,
    fontStyle: 'italic',
  },
  permissionStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  permissionStatusItem: {
    alignItems: 'center',
    gap: 8,
  },
  permissionStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  permissionStatusDotGranted: {
    backgroundColor: colors.primary,
  },
  permissionStatusDotDenied: {
    backgroundColor: colors.secondary,
  },
  permissionStatusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});