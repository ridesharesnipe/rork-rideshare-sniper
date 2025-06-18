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
  
  // Passenger rating filter
  ratingFilterEnabled: boolean;
  minRating: number;
  
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
  
  // Rating filter setters
  setRatingFilterEnabled: (enabled: boolean) => void;
  setMinRating: (rating: number) => void;
  
  // Check if permission is granted
  isSniperPermissionGranted: () => boolean;
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
      
      // Single permission - default to true for easier testing
      sniperPermissionGranted: true,
      
      // Passenger rating filter - default values
      ratingFilterEnabled: false,
      minRating: 4.5,
      
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
      
      // Rating filter setters
      setRatingFilterEnabled: (enabled) => {
        set({ ratingFilterEnabled: enabled });
        console.log(`Rating filter ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setMinRating: (rating) => {
        set({ minRating: rating });
        console.log(`Minimum passenger rating set to: ${rating}`);
      },
      
      // Check if permission is granted
      isSniperPermissionGranted: () => {
        return get().sniperPermissionGranted;
      },
    }),
    {
      name: 'rideshare-sniper-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);