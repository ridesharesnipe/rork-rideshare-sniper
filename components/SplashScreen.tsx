import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '@/constants/colors';

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [taglineAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animate the main title first
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Then animate the tagline
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logo}>
          <View style={styles.crosshair}>
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairCenter} />
          </View>
        </View>
        
        <Text style={styles.title}>RIDESHARE SNIPER</Text>
        
        <Animated.Text style={[styles.tagline, { opacity: taglineAnim }]}>
          Made by a rideshare driver for rideshare drivers
        </Animated.Text>
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
  },
  logo: {
    marginBottom: 24,
  },
  crosshair: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 3,
    height: 60,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    fontWeight: '500',
  },
});