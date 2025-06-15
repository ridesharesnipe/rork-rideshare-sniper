import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [splashTimerComplete, setSplashTimerComplete] = useState(false);

  // Initialize auth store on component mount
  useEffect(() => {
    console.log('🔄 Initializing auth from index...');
    initialize();
  }, [initialize]);

  // Set up splash screen timer - reduced to 2 seconds
  useEffect(() => {
    console.log('🔄 Starting 2-second splash screen timer...');
    const splashTimer = setTimeout(() => {
      console.log('✅ Splash screen timer complete (2 seconds)');
      setSplashTimerComplete(true);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  // Handle navigation after splash screen
  useEffect(() => {
    // Only proceed if both splash timer is complete AND auth is initialized
    if (!splashTimerComplete || !isInitialized) {
      console.log(`⏳ Waiting... Splash: ${splashTimerComplete}, Auth: ${isInitialized}`);
      return;
    }

    console.log('🔄 Splash complete and auth initialized, navigating...');
    console.log('🔍 Auth status:', { isAuthenticated, isInitialized });
    
    // Navigate based on authentication status
    if (isAuthenticated) {
      console.log('✅ User is authenticated, navigating to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('ℹ️ User is not authenticated, navigating to welcome');
      router.replace('/welcome');
    }
  }, [isAuthenticated, isInitialized, splashTimerComplete, router]);

  // Always show splash screen during the timer
  return <SplashScreen />;
}