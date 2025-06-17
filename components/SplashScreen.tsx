import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '@/constants/colors';

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [taglineAnim] = useState(new Animated.Value(0));
  const [crosshairAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animate the crosshair first
    Animated.timing(crosshairAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Then animate the main title
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Finally animate the tagline
        Animated.timing(taglineAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    });
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.logo, { opacity: crosshairAnim }]}>
          <View style={styles.crosshair}>
            {/* Outer ring */}
            <View style={styles.crosshairOuterRing} />
            
            {/* Main crosshair lines */}
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
            
            {/* Inner ring */}
            <View style={styles.crosshairInnerRing} />
            
            {/* Center dot */}
            <View style={styles.crosshairCenter} />
            
            {/* Tick marks */}
            <View style={[styles.tickMark, styles.tickTop]} />
            <View style={[styles.tickMark, styles.tickBottom]} />
            <View style={[styles.tickMark, styles.tickLeft]} />
            <View style={[styles.tickMark, styles.tickRight]} />
          </View>
        </Animated.View>
        
        <Text style={styles.title}>RIDESHARE SNIPER</Text>
        
        <Animated.Text style={[styles.tagline, { opacity: taglineAnim }]}>
          Built by a rideshare driver for rideshare drivers
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
    marginBottom: 32,
  },
  crosshair: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairOuterRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.6,
  },
  crosshairInnerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    opacity: 0.8,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 80,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 80,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  tickMark: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  tickTop: {
    width: 3,
    height: 12,
    top: 8,
  },
  tickBottom: {
    width: 3,
    height: 12,
    bottom: 8,
  },
  tickLeft: {
    width: 12,
    height: 3,
    left: 8,
  },
  tickRight: {
    width: 12,
    height: 3,
    right: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    fontWeight: '500',
    lineHeight: 22,
  },
});