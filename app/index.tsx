import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [splashTimerComplete, setSplashTimerComplete] = useState(false);
  const [navigationAttempted, setNavigationAttempted] = useState(false);

  // Initialize auth store on component mount
  useEffect(() => {
    console.log('🔄 Initializing auth from index...');
    const initializeAuth = async () => {
      try {
        await initialize();
        console.log('✅ Auth initialized from index');
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      }
    };
    
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initialize, isInitialized]);

  // Set up splash screen timer - 3 seconds
  useEffect(() => {
    console.log('🔄 Starting 3-second splash screen timer...');
    const splashTimer = setTimeout(() => {
      console.log('✅ Splash screen timer complete (3 seconds)');
      setSplashTimerComplete(true);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  // Handle navigation after splash screen
  useEffect(() => {
    // Prevent multiple navigation attempts
    if (navigationAttempted) {
      return;
    }
    
    // Only proceed if splash timer is complete
    if (!splashTimerComplete) {
      console.log(`⏳ Waiting for splash timer... Timer: ${splashTimerComplete}`);
      return;
    }

    // If auth is not initialized after splash timer, proceed anyway to prevent getting stuck
    if (!isInitialized) {
      console.log('⚠️ Auth not initialized after splash timer, proceeding to welcome');
      setNavigationAttempted(true);
      router.replace('/welcome');
      return;
    }

    console.log('🔄 Splash complete and auth initialized, navigating...');
    console.log('🔍 Auth status:', { isAuthenticated, isInitialized });
    
    // Navigate based on authentication status
    setNavigationAttempted(true);
    if (isAuthenticated) {
      console.log('✅ User is authenticated, navigating to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('ℹ️ User is not authenticated, navigating to welcome');
      router.replace('/welcome');
    }
  }, [isAuthenticated, isInitialized, splashTimerComplete, router, navigationAttempted]);

  // Always show splash screen during the timer
  return <SplashScreen />;
}