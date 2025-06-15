import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    // Initialize auth store immediately
    initialize();
  }, []);

  useEffect(() => {
    // Show splash screen for 8 seconds (increased from 6 seconds)
    console.log('🔄 Starting 8-second splash screen timer...');
    const splashTimer = setTimeout(() => {
      console.log('✅ Splash screen timer complete (8 seconds)');
      setSplashComplete(true);
    }, 8000); // Increased to 8 seconds

    return () => {
      console.log('🧹 Cleaning up splash screen timer');
      clearTimeout(splashTimer);
    };
  }, []);

  useEffect(() => {
    // Only navigate after both splash is complete AND auth is initialized
    if (!splashComplete || !isInitialized) return;
    
    console.log('🔄 Both splash and auth are ready, navigating...');
    
    // Small delay to ensure smooth transition
    const navigationTimer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('✅ User is authenticated, navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('ℹ️ User is not authenticated, navigating to welcome');
        router.replace('/welcome');
      }
    }, 200);

    return () => {
      console.log('🧹 Cleaning up navigation timer');
      clearTimeout(navigationTimer);
    };
  }, [isAuthenticated, isInitialized, splashComplete]);

  // Show splash screen while loading or during the 8-second timer
  return <SplashScreen />;
}