import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Edit, Plus, Trash2, Bell, Battery, Eye, Shield, Lock, HelpCircle } from 'lucide-react-native';
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
    autoHideEnabled,
    minimalMode,
    emergencyDisable,
    sniperPermissionGranted,
    setSoundEnabled,
    setVibrationEnabled,
    setDarkMode,
    setBatteryOptimization,
    setAutoHideEnabled,
    setMinimalMode,
    setEmergencyDisable,
    setSniperPermission,
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
  
  const navigateToOnboarding = () => {
    router.push('/onboarding');
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
      
      {/* DRIVER PROFILES SECTION */}
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
                Min: ${profile.minFare} | Max Pickup: {profile.maxPickupDistance} mi
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
      
      {/* PERMISSIONS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERMISSIONS</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Shield size={20} color={colors.textSecondary} />
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
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Eye size={20} color={colors.textSecondary} />
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
              </View>
            </View>
            <View style={styles.demoTextContainer}>
              <Text style={styles.demoItemTitle}>Green Crosshair</Text>
              <Text style={styles.demoItemDescription}>
                Shows for profitable trips
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
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
          <ChevronRight size={20} color={colors.textSecondary} />
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
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      {/* HELP SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HELP</Text>
        
        <Pressable 
          style={styles.helpItem}
          onPress={navigateToOnboarding}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <HelpCircle size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.helpItemTitle}>Tutorial</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable 
          style={styles.helpItem}
          onPress={navigateToHelp}
        >
          <View style={styles.helpItemContent}>
            <View style={styles.helpIconContainer}>
              <HelpCircle size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.helpItemTitle}>Help Center</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      {/* ACCOUNT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Lock size={20} color={colors.textSecondary} />
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
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
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  demoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  demoIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  miniCrosshair: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCrosshairH: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairV: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#FFFFFF',
  },
  demoIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  demoTextContainer: {
    flex: 1,
  },
  demoItemTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  demoItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
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
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  helpItemTitle: {
    fontSize: 16,
    color: colors.textPrimary,
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
});