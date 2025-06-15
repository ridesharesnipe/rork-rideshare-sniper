import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Edit, Plus, Trash2, Bell, Battery, Eye, Clock, Shield, Lock, HelpCircle, AlertTriangle, X, DollarSign, MapPin, Navigation } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import OverlayDemo from '@/components/OverlayDemo';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    soundEnabled, 
    vibrationEnabled, 
    darkMode, 
    batteryOptimization,
    autoRejectEnabled,
    autoRejectDelay,
    minimalMode,
    emergencyDisable,
    overlayPermissionGranted,
    locationPermissionGranted,
    notificationPermissionGranted,
    setSoundEnabled,
    setVibrationEnabled,
    setDarkMode,
    setBatteryOptimization,
    setAutoRejectEnabled,
    setMinimalMode,
    setEmergencyDisable,
    setOverlayPermission,
    setLocationPermission,
    setNotificationPermission,
  } = useSettingsStore();
  
  const { profiles, deleteProfile } = useProfileStore();
  const { rememberMe, setRememberMe, logout } = useAuthStore();
  
  const [showDemo, setShowDemo] = useState(false);
  const [demoType, setDemoType] = useState<'accept' | 'reject' | 'consider'>('accept');
  
  // Modal states for Privacy Policy and Terms of Service
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  
  const navigateToEditProfile = (id: string) => {
    router.push({
      pathname: '/profile/edit',
      params: { id },
    });
  };
  
  const navigateToCreateProfile = () => {
    router.push('/profile/create');
  };
  
  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
  };
  
  const handleCompleteLogout = () => {
    Alert.alert(
      "Complete Logout",
      "This will remove all your saved credentials. You'll need to log in again next time.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Complete Logout",
          onPress: () => {
            setRememberMe(false);
            logout();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleShowDemo = (type: 'accept' | 'reject' | 'consider') => {
    setDemoType(type);
    setShowDemo(true);
  };
  
  const resetOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'false');
    router.replace('/onboarding');
  };
  
  const resetOverlayPositions = async () => {
    try {
      await AsyncStorage.removeItem('overlayPositions');
      Alert.alert("Success", "Overlay positions have been reset to default.");
    } catch (error) {
      console.error('Failed to reset overlay positions:', error);
      Alert.alert("Error", "Failed to reset overlay positions.");
    }
  };
  
  if (showDemo) {
    return (
      <OverlayDemo 
        recommendation={demoType} 
        onClose={() => setShowDemo(false)} 
      />
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      {/* TRIP FILTERS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TRIP FILTERS</Text>
        
        <View style={styles.filterInfoBox}>
          <Text style={styles.filterInfoText}>
            Trip filters determine which rides are profitable. Set your minimum acceptable fare, maximum pickup distance, maximum driving distance, and more.
          </Text>
        </View>
        
        <View style={styles.filterIconsContainer}>
          <View style={styles.filterIconItem}>
            <View style={styles.filterIconCircle}>
              <DollarSign size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.filterIconText}>Min Fare</Text>
          </View>
          
          <View style={styles.filterIconItem}>
            <View style={styles.filterIconCircle}>
              <MapPin size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.filterIconText}>Max Pickup</Text>
          </View>
          
          <View style={styles.filterIconItem}>
            <View style={styles.filterIconCircle}>
              <Navigation size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.filterIconText}>Max Driving</Text>
          </View>
        </View>
        
        <Pressable 
          style={styles.editFiltersButton} 
          onPress={() => navigateToCreateProfile()}
        >
          <Text style={styles.editFiltersButtonText}>CREATE NEW FILTER PROFILE</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Lock size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Remember Me</Text>
            <Text style={styles.settingDescription}>
              Stay logged in for quick access next time
            </Text>
          </View>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <Pressable style={styles.logoutButton} onPress={handleCompleteLogout}>
          <Text style={styles.logoutButtonText}>COMPLETE LOGOUT</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISPLAY OPTIONS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Eye size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Minimal Mode</Text>
            <Text style={styles.settingDescription}>
              Show only a colored dot indicator instead of the full panel
            </Text>
          </View>
          <Switch
            value={minimalMode}
            onValueChange={setMinimalMode}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Sound Notifications</Text>
            <Text style={styles.settingDescription}>
              Play sound alerts for trip requests
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Vibration Feedback</Text>
            <Text style={styles.settingDescription}>
              Vibrate when trip requests arrive
            </Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERFORMANCE & SAFETY</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Battery size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Battery Optimization</Text>
            <Text style={styles.settingDescription}>
              Reduce power usage while running in background
            </Text>
          </View>
          <Switch
            value={batteryOptimization}
            onValueChange={setBatteryOptimization}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Clock size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Auto-Hide Overlay</Text>
            <Text style={styles.settingDescription}>
              Automatically hide overlay after 5 seconds
            </Text>
          </View>
          <Switch
            value={autoRejectEnabled}
            onValueChange={setAutoRejectEnabled}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Shield size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Emergency Disable</Text>
            <Text style={styles.settingDescription}>
              Quickly disable all overlays if needed
            </Text>
          </View>
          <Switch
            value={emergencyDisable}
            onValueChange={setEmergencyDisable}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERMISSIONS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Lock size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Overlay Permission</Text>
            <Text style={styles.settingDescription}>
              Allow Rideshare Sniper to display over other apps
            </Text>
          </View>
          <Switch
            value={overlayPermissionGranted}
            onValueChange={setOverlayPermission}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <MapPin size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Location Permission</Text>
            <Text style={styles.settingDescription}>
              Allow access to your location for distance calculations
            </Text>
          </View>
          <Switch
            value={locationPermissionGranted}
            onValueChange={setLocationPermission}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Notification Permission</Text>
            <Text style={styles.settingDescription}>
              Allow notifications for trip alerts
            </Text>
          </View>
          <Switch
            value={notificationPermissionGranted}
            onValueChange={setNotificationPermission}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DRIVER PROFILES</Text>
          <Pressable style={styles.addButton} onPress={navigateToCreateProfile}>
            <Plus size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
        
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileItem}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetail}>
                Min: ${profile.minFare} | Max Pickup: {profile.maxPickupDistance} mi | Max Drive: {profile.maxDrivingDistance} mi
              </Text>
            </View>
            
            <View style={styles.profileActions}>
              <Pressable 
                style={styles.profileActionButton}
                onPress={() => handleDeleteProfile(profile.id)}
              >
                <Trash2 size={20} color={colors.secondary} />
              </Pressable>
              
              <Pressable 
                style={styles.profileActionButton}
                onPress={() => navigateToEditProfile(profile.id)}
              >
                <Edit size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      
      {/* Help & Tutorials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HELP & TUTORIALS</Text>
        
        <Pressable 
          style={styles.helpItem}
          onPress={() => handleShowDemo('accept')}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <View style={styles.crosshairIcon}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpItemTitle}>Green Crosshair Demo</Text>
              <Text style={styles.helpItemDescription}>
                Place directly over the Accept button for profitable trips
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={() => handleShowDemo('consider')}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <View style={[styles.demoIcon, styles.yellowIcon]}>
                <AlertTriangle size={16} color={colors.textPrimary} />
              </View>
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpItemTitle}>Yellow Warning Demo</Text>
              <Text style={styles.helpItemDescription}>
                Position above trip details for borderline trips
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={() => handleShowDemo('reject')}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <View style={[styles.demoIcon, styles.redIcon]}>
                <X size={16} color={colors.textPrimary} />
              </View>
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpItemTitle}>Red X Demo</Text>
              <Text style={styles.helpItemDescription}>
                Place near the close button for unprofitable trips
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={resetOnboarding}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpItemTitle}>Replay Full Tutorial</Text>
              <Text style={styles.helpItemDescription}>
                Go through the complete onboarding process again
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={resetOverlayPositions}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <Navigation size={20} color={colors.primary} />
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpItemTitle}>Reset Overlay Positions</Text>
              <Text style={styles.helpItemDescription}>
                Reset all overlay elements to their default positions
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        
        <Pressable 
          style={styles.aboutItem}
          onPress={() => setShowPrivacyPolicy(true)}
        >
          <Text style={styles.aboutItemText}>Privacy Policy</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.aboutItem}
          onPress={() => setShowTermsOfService(true)}
        >
          <Text style={styles.aboutItemText}>Terms of Service</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Rideshare Sniper v1.0.0</Text>
          <Text style={styles.tagline}>Precision. Profit. Protection.</Text>
        </View>
      </View>
      
      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPrivacyPolicy}
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <Pressable onPress={() => setShowPrivacyPolicy(false)}>
              <X size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Last Updated: May 23, 2025</Text>
            
            <Text style={styles.modalParagraph}>
              This Privacy Policy describes how Rideshare Sniper ("we," "us," or "our") collects, uses, and shares your personal information when you use our mobile application and related services (collectively, the "Service").
            </Text>
            
            <Text style={styles.modalSectionTitle}>1. INFORMATION WE COLLECT</Text>
            
            <Text style={styles.modalSubtitle}>1.1 Information You Provide</Text>
            <Text style={styles.modalParagraph}>
              • Account Information: When you register, we collect your email address and password.
            </Text>
            <Text style={styles.modalParagraph}>
              • Profile Information: Driver profiles, preferences, and settings you create within the app.
            </Text>
            <Text style={styles.modalParagraph}>
              • Security Questions: Information provided for account recovery purposes.
            </Text>
            
            <Text style={styles.modalSubtitle}>1.2 Information Collected Automatically</Text>
            <Text style={styles.modalParagraph}>
              • Device Information: Device type, operating system, unique device identifiers.
            </Text>
            <Text style={styles.modalParagraph}>
              • Usage Data: How you interact with our app, features used, time spent.
            </Text>
            <Text style={styles.modalParagraph}>
              • Performance Data: App crashes, system activity, hardware settings.
            </Text>
            
            <Text style={styles.modalSectionTitle}>2. HOW WE USE YOUR INFORMATION</Text>
            <Text style={styles.modalParagraph}>
              We use the information we collect to:
            </Text>
            <Text style={styles.modalParagraph}>
              • Provide, maintain, and improve our Service
            </Text>
            <Text style={styles.modalParagraph}>
              • Process and complete transactions
            </Text>
            <Text style={styles.modalParagraph}>
              • Send you technical notices and support messages
            </Text>
            <Text style={styles.modalParagraph}>
              • Respond to your comments and questions
            </Text>
            <Text style={styles.modalParagraph}>
              • Develop new products and services
            </Text>
            <Text style={styles.modalParagraph}>
              • Monitor and analyze trends, usage, and activities
            </Text>
            <Text style={styles.modalParagraph}>
              • Detect, investigate, and prevent fraudulent transactions and other illegal activities
            </Text>
            <Text style={styles.modalParagraph}>
              • Protect the rights and property of Rideshare Sniper and others
            </Text>
            
            <Text style={styles.modalSectionTitle}>3. DATA STORAGE AND SECURITY</Text>
            <Text style={styles.modalParagraph}>
              All data is stored securely using industry-standard encryption. We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </Text>
            
            <Text style={styles.modalSectionTitle}>4. DATA RETENTION</Text>
            <Text style={styles.modalParagraph}>
              We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </Text>
            
            <Text style={styles.modalSectionTitle}>5. YOUR RIGHTS</Text>
            <Text style={styles.modalParagraph}>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </Text>
            <Text style={styles.modalParagraph}>
              • Access: You can request copies of your personal information.
            </Text>
            <Text style={styles.modalParagraph}>
              • Rectification: You can request that we correct inaccurate information.
            </Text>
            <Text style={styles.modalParagraph}>
              • Erasure: You can request that we delete your personal information.
            </Text>
            <Text style={styles.modalParagraph}>
              • Restriction: You can request that we restrict the processing of your information.
            </Text>
            <Text style={styles.modalParagraph}>
              • Data Portability: You can request a copy of your information in a structured, commonly used, machine-readable format.
            </Text>
            
            <Text style={styles.modalSectionTitle}>6. CHILDREN'S PRIVACY</Text>
            <Text style={styles.modalParagraph}>
              Our Service is not directed to children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </Text>
            
            <Text style={styles.modalSectionTitle}>7. CHANGES TO THIS PRIVACY POLICY</Text>
            <Text style={styles.modalParagraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </Text>
            
            <Text style={styles.modalSectionTitle}>8. CONTACT US</Text>
            <Text style={styles.modalParagraph}>
              If you have any questions about this Privacy Policy, please contact us at privacy@ridesharesniper.com.
            </Text>
          </ScrollView>
        </View>
      </Modal>
      
      {/* Terms of Service Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showTermsOfService}
        onRequestClose={() => setShowTermsOfService(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <Pressable onPress={() => setShowTermsOfService(false)}>
              <X size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Last Updated: May 23, 2025</Text>
            
            <Text style={styles.modalParagraph}>
              Please read these Terms of Service ("Terms") carefully before using the Rideshare Sniper mobile application (the "Service") operated by Rideshare Sniper ("us", "we", or "our").
            </Text>
            
            <Text style={styles.modalParagraph}>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
            </Text>
            
            <Text style={styles.modalSectionTitle}>1. ACCOUNTS</Text>
            <Text style={styles.modalParagraph}>
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </Text>
            <Text style={styles.modalParagraph}>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </Text>
            <Text style={styles.modalParagraph}>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </Text>
            
            <Text style={styles.modalSectionTitle}>2. LICENSE</Text>
            <Text style={styles.modalParagraph}>
              Rideshare Sniper grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal, non-commercial purposes.
            </Text>
            <Text style={styles.modalParagraph}>
              You may not:
            </Text>
            <Text style={styles.modalParagraph}>
              • Modify, copy, or create derivative works based on the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • Use the Service for any commercial purpose
            </Text>
            <Text style={styles.modalParagraph}>
              • Attempt to decompile, reverse engineer, or extract the source code
            </Text>
            <Text style={styles.modalParagraph}>
              • Remove any copyright or proprietary notices
            </Text>
            <Text style={styles.modalParagraph}>
              • Transfer the Service to another person or "mirror" it on any other server
            </Text>
            
            <Text style={styles.modalSectionTitle}>3. INTELLECTUAL PROPERTY</Text>
            <Text style={styles.modalParagraph}>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Rideshare Sniper and its licensors. The Service is protected by copyright, trademark, and other laws.
            </Text>
            
            <Text style={styles.modalSectionTitle}>4. USER CONDUCT</Text>
            <Text style={styles.modalParagraph}>
              You agree not to use the Service:
            </Text>
            <Text style={styles.modalParagraph}>
              • In any way that violates any applicable law or regulation
            </Text>
            <Text style={styles.modalParagraph}>
              • To impersonate or attempt to impersonate another person or entity
            </Text>
            <Text style={styles.modalParagraph}>
              • To engage in any conduct that restricts or inhibits anyone's use of the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • To attempt to gain unauthorized access to any portion of the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • To interfere with the proper working of the Service
            </Text>
            
            <Text style={styles.modalSectionTitle}>5. THIRD-PARTY SERVICES</Text>
            <Text style={styles.modalParagraph}>
              Our Service may contain links to third-party websites or services that are not owned or controlled by Rideshare Sniper.
            </Text>
            <Text style={styles.modalParagraph}>
              Rideshare Sniper has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Rideshare Sniper shall not be responsible or liable for any damage or loss caused by use of any such third-party websites or services.
            </Text>
            
            <Text style={styles.modalSectionTitle}>6. TERMINATION</Text>
            <Text style={styles.modalParagraph}>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </Text>
            <Text style={styles.modalParagraph}>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </Text>
            
            <Text style={styles.modalSectionTitle}>7. LIMITATION OF LIABILITY</Text>
            <Text style={styles.modalParagraph}>
              In no event shall Rideshare Sniper, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </Text>
            <Text style={styles.modalParagraph}>
              • Your access to or use of or inability to access or use the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • Any conduct or content of any third party on the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • Any content obtained from the Service
            </Text>
            <Text style={styles.modalParagraph}>
              • Unauthorized access, use or alteration of your transmissions or content
            </Text>
            
            <Text style={styles.modalSectionTitle}>8. DISCLAIMER</Text>
            <Text style={styles.modalParagraph}>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </Text>
            
            <Text style={styles.modalSectionTitle}>9. GOVERNING LAW</Text>
            <Text style={styles.modalParagraph}>
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </Text>
            <Text style={styles.modalParagraph}>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </Text>
            
            <Text style={styles.modalSectionTitle}>10. CHANGES</Text>
            <Text style={styles.modalParagraph}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </Text>
            <Text style={styles.modalParagraph}>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  // Filter section styles
  filterInfoBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  filterInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  filterIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterIconItem: {
    alignItems: 'center',
    width: '30%',
  },
  filterIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  filterIconText: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  editFiltersButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editFiltersButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  // Original styles
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  aboutItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  // Help & Tutorials section styles
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  helpItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  crosshairIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },
  demoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellowIcon: {
    backgroundColor: colors.warning,
  },
  redIcon: {
    backgroundColor: colors.secondary,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  modalParagraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
});