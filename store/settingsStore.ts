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
  
  // Single permission for sniping
  sniperPermissionGranted: boolean;
  
  setDriverStatus: (status: DriverStatus) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setBatteryOptimization: (enabled: boolean) => void;
  setAutoHideEnabled: (enabled: boolean) => void;
  setMinimalMode: (enabled: boolean) => void;
  setEmergencyDisable: (enabled: boolean) => void;
  
  // Single permission setter
  setSniperPermission: (granted: boolean) => void;
  
  // Check if permission is granted
  isSniperPermissionGranted: () => boolean;
  
  // Reset permission (for troubleshooting)
  resetPermission: () => Promise<void>;
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
      
      // Single permission - default to false
      sniperPermissionGranted: false,
      
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
      
      // Single permission setter
      setSniperPermission: (granted) => {
        set({ sniperPermissionGranted: granted });
        console.log(`Sniper permission ${granted ? 'granted' : 'denied'}`);
      },
      
      // Check if permission is granted
      isSniperPermissionGranted: () => {
        return get().sniperPermissionGranted;
      },
      
      // Reset permission (for troubleshooting) - simplified and more reliable
      resetPermission: async () => {
        try {
          console.log('🔄 Starting permission reset...');
          
          // Step 1: Reset permission in state immediately
          set({ sniperPermissionGranted: false });
          console.log('✅ Permission reset in state');
          
          // Step 2: Clear related AsyncStorage items
          const keysToRemove = [
            'hasSeenOnboarding',
            'overlayPositions'
          ];
          
          for (const key of keysToRemove) {
            try {
              await AsyncStorage.removeItem(key);
              console.log(`✅ Removed ${key}`);
            } catch (error) {
              console.warn(`⚠️ Failed to remove ${key}:`, error);
              // Continue with other keys even if one fails
            }
          }
          
          console.log('✅ Permission reset completed successfully');
        } catch (error) {
          console.error('❌ Error during permission reset:', error);
          // Even if there's an error, ensure the permission is reset in state
          set({ sniperPermissionGranted: false });
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