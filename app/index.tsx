import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [splashTimerComplete, setSplashTimerComplete] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Initialize auth store on component mount
  useEffect(() => {
    console.log('🔄 Initializing auth from index...');
    initialize();
  }, []);

  // Set up splash screen timer - reduced to 3 seconds
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
    // Prevent multiple navigations
    if (hasNavigated) {
      return;
    }

    // Only proceed if both splash timer is complete AND auth is initialized
    if (!splashTimerComplete || !isInitialized) {
      console.log(`⏳ Waiting... Splash: ${splashTimerComplete}, Auth: ${isInitialized}`);
      return;
    }

    console.log('🔄 Splash complete and auth initialized, navigating...');
    console.log('🔍 Auth status:', { isAuthenticated, isInitialized });
    
    // Mark as navigated to prevent multiple navigations
    setHasNavigated(true);
    
    // Navigate based on authentication status
    if (isAuthenticated) {
      console.log('✅ User is authenticated, navigating to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('ℹ️ User is not authenticated, navigating to welcome');
      router.replace('/welcome');
    }
  }, [isAuthenticated, isInitialized, splashTimerComplete, router, hasNavigated]);

  // Always show splash screen during the timer
  return <SplashScreen />;
}