import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import colors from '@/constants/colors';

export default function SplashScreen() {
  // Start with smaller initial values for Android to ensure animations complete
  const crosshairScale = useRef(new Animated.Value(Platform.OS === 'android' ? 0.8 : 2)).current;
  const crosshairOpacity = useRef(new Animated.Value(Platform.OS === 'android' ? 0.8 : 0)).current;
  const textOpacity = useRef(new Animated.Value(Platform.OS === 'android' ? 0.8 : 0)).current;
  const taglineOpacity = useRef(new Animated.Value(Platform.OS === 'android' ? 0.8 : 0)).current;
  const bylineOpacity = useRef(new Animated.Value(Platform.OS === 'android' ? 0.8 : 0)).current;

  useEffect(() => {
    console.log(`SplashScreen mounted on ${Platform.OS}`);
    
    // Simplified animations for Android
    if (Platform.OS === 'android') {
      console.log('Android detected, using simplified animations');
      
      // Use parallel animations for better performance on Android
      Animated.parallel([
        // Scale animation
        Animated.sequence([
          Animated.timing(crosshairScale, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(crosshairScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          })
        ]),
        
        // Fade in animations
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(crosshairOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          delay: 200,
        }),
        Animated.timing(bylineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          delay: 400,
        }),
      ]).start();
      
      return;
    }
    
    console.log('iOS/Web detected, using full animation sequence');
    
    // iOS and web animation sequence
    Animated.sequence([
      // Fade in the title
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      
      // Fade in the crosshair and zoom in
      Animated.parallel([
        Animated.timing(crosshairOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(crosshairScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]),
      
      // Fade in the tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      
      // Fade in the byline
      Animated.timing(bylineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
        RIDESHARE SNIPER
      </Animated.Text>
      
      <Animated.View 
        style={[
          styles.crosshairContainer, 
          { 
            opacity: crosshairOpacity,
            transform: [{ scale: crosshairScale }] 
          }
        ]}
      >
        <View style={styles.crosshairHorizontal} />
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairCenter} />
        <View style={styles.crosshairRing} />
      </Animated.View>
      
      <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
        Your rideshare mission control
      </Animated.Text>
      
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Precision. Profit. Protection.
      </Animated.Text>
      
      <Animated.Text style={[styles.byline, { opacity: bylineOpacity }]}>
        Built by a rideshare driver for rideshare drivers
      </Animated.Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 40,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: 'center',
  },
  byline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
    maxWidth: '80%',
  },
  crosshairContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 120,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 120,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  crosshairRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});