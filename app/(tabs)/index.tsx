import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Power, ChevronRight, Shield, Crosshair, Edit } from 'lucide-react-native';
import colors from '@/constants/colors';
import ProfileSelector from '@/components/ProfileSelector';
import StatsCard from '@/components/StatsCard';
import StartSniperButton from '@/components/StartSniperButton';
import { useSettingsStore } from '@/store/settingsStore';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const { driverStatus, setDriverStatus, isSniperPermissionGranted } = useSettingsStore();
  const { getActiveProfile, activeProfileId } = useProfileStore();
  const { user } = useAuthStore();
  const [showWelcome, setShowWelcome] = useState(false);
  
  const activeProfile = getActiveProfile();
  
  useEffect(() => {
    // Check if this is the first time the user is seeing the dashboard
    const checkFirstTimeUser = async () => {
      try {
        const hasSeenDashboard = await AsyncStorage.getItem(`hasSeenDashboard-${user?.id}`);
        if (!hasSeenDashboard && user) {
          setShowWelcome(true);
          // Show welcome alert
          Alert.alert(
            `Welcome, ${user.name}!`,
            "Thank you for joining Rideshare Sniper. We're excited to help you maximize your earnings and safety on the road.",
            [
              { 
                text: "Get Started", 
                onPress: async () => {
                  await AsyncStorage.setItem(`hasSeenDashboard-${user.id}`, 'true');
                  setShowWelcome(false);
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error("Error checking first time user:", error);
      }
    };
    
    checkFirstTimeUser();
  }, [user]);
  
  const toggleDriverStatus = () => {
    setDriverStatus(driverStatus === 'online' ? 'offline' : 'online');
  };
  
  const navigateToSimulator = () => {
    router.push('/simulator');
  };
  
  const navigateToEditProfile = () => {
    if (activeProfileId) {
      router.push({
        pathname: '/profile/edit',
        params: { id: activeProfileId },
      });
    }
  };
  
  const resetOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'false');
    router.replace('/onboarding');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>RIDESHARE SNIPER</Text>
          {user && (
            <Text style={styles.welcomeText}>Hello, {user.name}</Text>
          )}
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, driverStatus === 'online' ? styles.statusOnline : styles.statusOffline]} />
          <Text style={styles.statusText}>
            {driverStatus === 'online' ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
      </View>
      
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>PRECISION. PROFIT. PROTECTION.</Text>
      </View>
      
      {/* PERMISSION STATUS ALERT */}
      {!isSniperPermissionGranted() && (
        <View style={styles.permissionAlert}>
          <Text style={styles.permissionAlertTitle}>⚠️ PERMISSION REQUIRED</Text>
          <Text style={styles.permissionAlertText}>
            Sniper permission is required. Rideshare Sniper may not function properly.
          </Text>
          <Pressable 
            style={styles.permissionAlertButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={styles.permissionAlertButtonText}>CHECK SETTINGS</Text>
          </Pressable>
        </View>
      )}
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>ACTIVE PROFILE</Text>
          <Pressable 
            style={styles.editButton} 
            onPress={navigateToEditProfile}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Edit size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Filters</Text>
          </Pressable>
        </View>
        
        <ProfileSelector />
        
        {activeProfile && (
          <View style={styles.profileDetails}>
            <Text style={styles.filtersSectionTitle}>TRIP FILTERS:</Text>
            
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailLabel}>Min. Fare</Text>
              <Text style={styles.profileDetailValue}>${activeProfile.minFare}</Text>
            </View>
            
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailLabel}>Max Pickup</Text>
              <Text style={styles.profileDetailValue}>{activeProfile.maxPickupDistance} mi</Text>
            </View>
            
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailLabel}>Max Driving</Text>
              <Text style={styles.profileDetailValue}>{activeProfile.maxDrivingDistance} mi</Text>
            </View>
            
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailLabel}>Min $/Mile</Text>
              <Text style={styles.profileDetailValue}>${activeProfile.minFarePerMile}</Text>
            </View>
            
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailLabel}>Min $/Min</Text>
              <Text style={styles.profileDetailValue}>${activeProfile.minFarePerMinute}</Text>
            </View>
          </View>
        )}
        
        <Pressable 
          style={[
            styles.powerButton,
            driverStatus === 'online' ? styles.powerButtonActive : {},
          ]}
          onPress={toggleDriverStatus}
        >
          <Power size={24} color={colors.textPrimary} />
          <Text style={styles.powerButtonText}>
            {driverStatus === 'online' ? 'GO OFFLINE' : 'GO ONLINE'}
          </Text>
        </Pressable>
      </View>
      
      {/* START SNIPER BUTTON */}
      <StartSniperButton />
      
      <StatsCard
        totalTrips={12}
        acceptedTrips={8}
        rejectedTrips={4}
        totalEarnings={187.45}
        averageFare={23.43}
      />
      
      <Pressable style={styles.simulatorButton} onPress={navigateToSimulator}>
        <View style={styles.simulatorButtonContent}>
          <Crosshair size={20} color={colors.textPrimary} />
          <Text style={styles.simulatorButtonText}>TRY TRIP SIMULATOR</Text>
          <ChevronRight size={20} color={colors.textPrimary} />
        </View>
      </Pressable>
      
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Shield size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>SAFETY FIRST DESIGN</Text>
        </View>
        
        <Text style={styles.infoText}>
          Rideshare Sniper helps you make quick decisions about trip requests while driving.
          Set your preferences, and we'll show you clear visual signals for each trip.
        </Text>
        
        <View style={styles.infoItem}>
          <View style={[styles.infoIndicator, { backgroundColor: colors.primary }]} />
          <Text style={styles.infoItemText}>
            <Text style={styles.infoBold}>Green Crosshair:</Text> Profitable trips that meet your criteria
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={[styles.infoIndicator, { backgroundColor: colors.warning }]} />
          <Text style={styles.infoItemText}>
            <Text style={styles.infoBold}>Yellow Warning:</Text> Borderline trips that barely meet criteria
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={[styles.infoIndicator, { backgroundColor: colors.secondary }]} />
          <Text style={styles.infoItemText}>
            <Text style={styles.infoBold}>Red X:</Text> Unprofitable trips to reject
          </Text>
        </View>
        
        <Pressable style={styles.tutorialButton} onPress={resetOnboarding}>
          <Text style={styles.tutorialButtonText}>REPLAY TUTORIAL</Text>
        </Pressable>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: colors.primary,
  },
  statusOffline: {
    backgroundColor: colors.textMuted,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  taglineContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  permissionAlert: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  permissionAlertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 8,
  },
  permissionAlertText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  permissionAlertButton: {
    backgroundColor: colors.warning,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  permissionAlertButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  profileDetails: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
  },
  filtersSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  profileDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  profileDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  profileDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  powerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  powerButtonActive: {
    backgroundColor: colors.primary,
  },
  powerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  simulatorButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  simulatorButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simulatorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  infoItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  infoBold: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tutorialButton: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  tutorialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
});