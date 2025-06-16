import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import colors from '@/constants/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [rotateAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
    
    // Scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
    
    // Rotation animation for crosshair
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
    
    // Set timeout for splash screen duration (8 seconds)
    const timer = setTimeout(() => {
      // Fade out animation before finishing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 8000); // 8 second splash screen
    
    return () => clearTimeout(timer);
  }, []);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.crosshairContainer,
            {
              transform: [
                { rotate: spin }
              ]
            }
          ]}
        >
          <View style={styles.crosshairHorizontal} />
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairCenter} />
          <View style={styles.crosshairRing} />
        </Animated.View>
        
        <Text style={styles.title}>RIDESHARE SNIPER</Text>
        <Text style={styles.tagline}>Precision. Profit. Protection.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 120,
    height: 3,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 3,
    height: 120,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  crosshairRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
});