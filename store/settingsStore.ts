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
  autoRejectEnabled: boolean;
  autoRejectDelay: number;
  minimalMode: boolean;
  emergencyDisable: boolean;
  
  // Permission states
  locationPermissionGranted: boolean;
  notificationPermissionGranted: boolean;
  overlayPermissionGranted: boolean;
  batteryOptimizationDisabled: boolean;
  
  setDriverStatus: (status: DriverStatus) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setBatteryOptimization: (enabled: boolean) => void;
  setAutoRejectEnabled: (enabled: boolean) => void;
  setAutoRejectDelay: (delay: number) => void;
  setMinimalMode: (enabled: boolean) => void;
  setEmergencyDisable: (enabled: boolean) => void;
  
  // Permission setters
  setLocationPermission: (granted: boolean) => void;
  setNotificationPermission: (granted: boolean) => void;
  setOverlayPermission: (granted: boolean) => void;
  setBatteryOptimizationDisabled: (disabled: boolean) => void;
  
  // Check if all required permissions are granted
  areAllPermissionsGranted: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      driverStatus: 'offline',
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: true,
      batteryOptimization: true,
      autoRejectEnabled: false,
      autoRejectDelay: 5,
      minimalMode: false,
      emergencyDisable: false,
      
      // Permission states - default to false
      locationPermissionGranted: false,
      notificationPermissionGranted: false,
      overlayPermissionGranted: false,
      batteryOptimizationDisabled: false,
      
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
      
      setAutoRejectEnabled: (enabled) => {
        set({ autoRejectEnabled: enabled });
        console.log(`Auto-reject ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setAutoRejectDelay: (delay) => {
        set({ autoRejectDelay: delay });
        console.log(`Auto-reject delay set to: ${delay} seconds`);
      },
      
      setMinimalMode: (enabled) => {
        set({ minimalMode: enabled });
        console.log(`Minimal mode ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      setEmergencyDisable: (enabled) => {
        set({ emergencyDisable: enabled });
        console.log(`Emergency disable ${enabled ? 'enabled' : 'disabled'}`);
      },
      
      // Permission setters
      setLocationPermission: (granted) => {
        set({ locationPermissionGranted: granted });
        console.log(`Location permission ${granted ? 'granted' : 'denied'}`);
      },
      
      setNotificationPermission: (granted) => {
        set({ notificationPermissionGranted: granted });
        console.log(`Notification permission ${granted ? 'granted' : 'denied'}`);
      },
      
      setOverlayPermission: (granted) => {
        set({ overlayPermissionGranted: granted });
        console.log(`Overlay permission ${granted ? 'granted' : 'denied'}`);
      },
      
      setBatteryOptimizationDisabled: (disabled) => {
        set({ batteryOptimizationDisabled: disabled });
        console.log(`Battery optimization ${disabled ? 'disabled' : 'enabled'}`);
      },
      
      // Check if all required permissions are granted
      areAllPermissionsGranted: () => {
        const { 
          locationPermissionGranted,
          notificationPermissionGranted,
          overlayPermissionGranted
        } = get();
        
        // Battery optimization is optional, so we don't include it here
        return locationPermissionGranted && 
               notificationPermissionGranted && 
               overlayPermissionGranted;
      }
    }),
    {
      name: 'rideshare-sniper-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);