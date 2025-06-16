import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
      
      // Show splash for 2 seconds
      setTimeout(() => {
        setSplashComplete(true);
      }, 2000);
    };
    
    initializeApp();
  }, [initialize]);

  useEffect(() => {
    if (splashComplete && isInitialized) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome');
      }
    }
  }, [splashComplete, isInitialized, isAuthenticated, router]);

  return <SplashScreen />;
}