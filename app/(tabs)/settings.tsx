import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Edit, Plus, Trash2, Bell, Battery, Eye, Shield, Lock, HelpCircle, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import OverlayDemo from '@/components/OverlayDemo';
import Slider from '@/components/Slider';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    soundEnabled, 
    vibrationEnabled, 
    darkMode, 
    batteryOptimization,
    autoHideEnabled,
    minimalMode,
    emergencyDisable,
    sniperPermissionGranted,
    ratingFilterEnabled,
    minRating,
    setSoundEnabled,
    setVibrationEnabled,
    setDarkMode,
    setBatteryOptimization,
    setAutoHideEnabled,
    setMinimalMode,
    setEmergencyDisable,
    setSniperPermission,
    setRatingFilterEnabled,
    setMinRating,
  } = useSettingsStore();
  
  const { profiles, deleteProfile } = useProfileStore();
  const { rememberMe, setRememberMe, logout } = useAuthStore();
  
  const [showDemo, setShowDemo] = useState(false);
  const [demoType, setDemoType] = useState<'accept' | 'reject' | 'consider'>('accept');
  
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
    setRememberMe(false);
    logout();
  };
  
  const handleShowDemo = (type: 'accept' | 'reject' | 'consider') => {
    setDemoType(type);
    setShowDemo(true);
  };
  
  const navigateToHelp = () => {
    router.push('/help');
  };
  
  const navigateToTutorial = () => {
    router.push('/tutorial');
  };
  
  if (showDemo) {
    return (
      <OverlayDemo 
        visible={showDemo}
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
      
      {/* DRIVER PROFILES SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DRIVER PROFILES</Text>
          <Pressable style={styles.addButton} onPress={navigateToCreateProfile}>
            <Plus size={18} color={colors.textPrimary} />
          </Pressable>
        </View>
        
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileItem}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetail}>
                Min: ${profile.minFare} | Max Pickup: {profile.maxPickupDistance} mi
              </Text>
            </View>
            
            <View style={styles.profileActions}>
              <Pressable 
                style={styles.profileActionButton}
                onPress={() => handleDeleteProfile(profile.id)}
              >
                <Trash2 size={18} color={colors.secondary} />
              </Pressable>
              
              <Pressable 
                style={styles.profileActionButton}
                onPress={() => navigateToEditProfile(profile.id)}
              >
                <Edit size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      
      {/* PASSENGER FILTERS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PASSENGER FILTERS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Star size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>⭐ Min Passenger Rating</Text>
            <Text style={styles.settingDescription}>
              Only accept trips from passengers with this rating or higher
            </Text>
          </View>
          <Switch
            value={ratingFilterEnabled}
            onValueChange={setRatingFilterEnabled}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        
        {ratingFilterEnabled && (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderValue}>{minRating.toFixed(1)} ⭐</Text>
            </View>
            
            <Slider
              value={minRating}
              minimumValue={3.0}
              maximumValue={5.0}
              step={0.1}
              onValueChange={setMinRating}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceLight}
              thumbTintColor={colors.primary}
            />
            
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>3.0</Text>
              <Text style={styles.sliderMaxLabel}>5.0</Text>
            </View>
            
            {minRating >= 4.8 && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  ⚠️ Very few passengers have 4.8+ ratings
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      {/* PERMISSIONS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERMISSIONS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Shield size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Overlay Permission</Text>
            <Text style={styles.settingDescription}>
              Allow app to display overlays on screen
            </Text>
          </View>
          <Switch
            value={sniperPermissionGranted}
            onValueChange={setSniperPermission}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>
      
      {/* DISPLAY OPTIONS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISPLAY OPTIONS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={18} color={colors.textSecondary} />
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
            <Bell size={18} color={colors.textSecondary} />
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
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Eye size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Minimal Mode</Text>
            <Text style={styles.settingDescription}>
              Show simple dot indicators instead of full overlays
            </Text>
          </View>
          <Switch
            value={minimalMode}
            onValueChange={setMinimalMode}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>
      
      {/* OVERLAY DEMOS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OVERLAY DEMOS</Text>
        
        <Pressable 
          style={styles.demoItem}
          onPress={() => handleShowDemo('accept')}
        >
          <View style={styles.demoItemContent}>
            <View style={[styles.demoIndicator, { backgroundColor: colors.primary }]}>
              <View style={styles.miniCrosshair}>
                <View style={styles.miniCrosshairH} />
                <View style={styles.miniCrosshairV} />
                <View style={styles.miniCrosshairC} />
              </View>
            </View>
            <View style={styles.demoTextContainer}>
              <Text style={styles.demoItemTitle}>Green Crosshair</Text>
              <Text style={styles.demoItemDescription}>
                Shows for profitable trips
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.demoItem}
          onPress={() => handleShowDemo('consider')}
        >
          <View style={styles.demoItemContent}>
            <View style={[styles.demoIndicator, { backgroundColor: colors.warning }]}>
              <Text style={styles.demoIcon}>!</Text>
            </View>
            <View style={styles.demoTextContainer}>
              <Text style={styles.demoItemTitle}>Yellow Warning</Text>
              <Text style={styles.demoItemDescription}>
                Shows for borderline trips
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.demoItem}
          onPress={() => handleShowDemo('reject')}
        >
          <View style={styles.demoItemContent}>
            <View style={[styles.demoIndicator, { backgroundColor: colors.secondary }]}>
              <Text style={styles.demoIcon}>×</Text>
            </View>
            <View style={styles.demoTextContainer}>
              <Text style={styles.demoItemTitle}>Red X</Text>
              <Text style={styles.demoItemDescription}>
                Shows for unprofitable trips
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      {/* HELP SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HELP</Text>
        
        <Pressable 
          style={styles.helpItem}
          onPress={navigateToTutorial}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <HelpCircle size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.helpItemTitle}>Tutorial</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={navigateToHelp}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <HelpCircle size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.helpItemTitle}>Help Center</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      {/* ACCOUNT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Lock size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Remember Me</Text>
            <Text style={styles.settingDescription}>
              Stay logged in
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
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingIconContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionButton: {
    padding: 6,
    marginLeft: 6,
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  demoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  demoIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  miniCrosshair: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCrosshairH: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairV: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairC: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  demoIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  demoTextContainer: {
    flex: 1,
  },
  demoItemTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  demoItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  helpItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIconContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  helpItemTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  logoutButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  sliderContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 5,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderMinLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sliderMaxLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  warningContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  warningText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});