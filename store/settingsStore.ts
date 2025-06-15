import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverStatus } from '@/types';

interface SettingsState {
  driverStatus: DriverStatus;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  batteryOptimization: boolean;
  autoHideEnabled: boolean;
  minimalMode: boolean;
  emergencyDisable: boolean;
  
  // Essential permissions only
  overlayPermissionGranted: boolean;
  locationPermissionGranted: boolean;
  notificationPermissionGranted: boolean;
  
  setDriverStatus: (status: DriverStatus) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setBatteryOptimization: (enabled: boolean) => void;
  setAutoHideEnabled: (enabled: boolean) => void;
  setMinimalMode: (enabled: boolean) => void;
  setEmergencyDisable: (enabled: boolean) => void;
  
  // Essential permission setters
  setOverlayPermission: (granted: boolean) => void;
  setLocationPermission: (granted: boolean) => void;
  setNotificationPermission: (granted: boolean) => void;
  
  // Check if all required permissions are granted
  areAllPermissionsGranted: () => boolean;
  
  // Reset all permissions (for troubleshooting)
  resetPermissions: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      driverStatus: 'offline',
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: true,
      batteryOptimization: true,
      autoHideEnabled: true,
      minimalMode: false,
      emergencyDisable: false,
      
      // Essential permissions - default to false
      overlayPermissionGranted: false,
      locationPermissionGranted: false,
      notificationPermissionGranted: false,
      
      setDriverStatus: (status) => {
        set({ driverStatus: status });
        console.log(`Driver status set to: ${status}`);
      },
      
      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
        console.log(`Sound ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setVibrationEnabled: (enabled) => {
        set({ vibrationEnabled: enabled });
        console.log(`Vibration ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setDarkMode: (enabled) => {
        set({ darkMode: enabled });
        console.log(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setBatteryOptimization: (enabled) => {
        set({ batteryOptimization: enabled });
        console.log(`Battery optimization ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setAutoHideEnabled: (enabled) => {
        set({ autoHideEnabled: enabled });
        console.log(`Auto-hide overlay ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setMinimalMode: (enabled) => {
        set({ minimalMode: enabled });
        console.log(`Minimal mode ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setEmergencyDisable: (enabled) => {
        set({ emergencyDisable: enabled });
        console.log(`Emergency disable ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      // Essential permission setters
      setOverlayPermission: (granted) => {
        set({ overlayPermissionGranted: granted });
        console.log(`Overlay permission ${granted ? 'granted' : 'denied'}`);
      },
      
      setLocationPermission: (granted) => {
        set({ locationPermissionGranted: granted });
        console.log(`Location permission ${granted ? 'granted' : 'denied'}`);
      },
      
      setNotificationPermission: (granted) => {
        set({ notificationPermissionGranted: granted });
        console.log(`Notification permission ${granted ? 'granted' : 'denied'}`);
      },
      
      // Check if all required permissions are granted
      areAllPermissionsGranted: () => {
        const { 
          overlayPermissionGranted,
          locationPermissionGranted,
          notificationPermissionGranted
        } = get();
        
        return overlayPermissionGranted && 
               locationPermissionGranted && 
               notificationPermissionGranted;
      },
      
      // Reset all permissions (for troubleshooting)
      resetPermissions: async () => {
        try {
          console.log('🔄 Starting permissions reset...');
          
          // First, reset permissions in state
          set({
            overlayPermissionGranted: false,
            locationPermissionGranted: false,
            notificationPermissionGranted: false,
          });
          console.log('✅ Permissions reset in state');
          
          // Clear onboarding flag so user goes through setup again
          try {
            await AsyncStorage.removeItem('hasSeenOnboarding');
            console.log('✅ Removed hasSeenOnboarding flag');
          } catch (error) {
            console.warn('⚠️ Failed to remove hasSeenOnboarding:', error);
          }
          
          // Clear overlay positions
          try {
            await AsyncStorage.removeItem('overlayPositions');
            console.log('✅ Removed overlay positions');
          } catch (error) {
            console.warn('⚠️ Failed to remove overlay positions:', error);
          }
          
          // Force save the current state to ensure permissions are persisted as false
          const currentState = get();
          try {
            const stateToSave = {
              ...currentState,
              overlayPermissionGranted: false,
              locationPermissionGranted: false,
              notificationPermissionGranted: false,
            };
            await AsyncStorage.setItem('rideshare-sniper-settings', JSON.stringify({
              state: stateToSave,
              version: 0
            }));
            console.log('✅ Forced save of reset permissions to storage');
          } catch (error) {
            console.warn('⚠️ Failed to force save state:', error);
          }
          
          console.log('✅ All permissions and related data reset successfully');
        } catch (error) {
          console.error('❌ Error resetting permissions:', error);
          throw error;
        }
      }
    }),
    {
      name: 'rideshare-sniper-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);