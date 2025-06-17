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
            {/* Outer targeting ring */}
            <View style={styles.crosshairOuterRing} />
            
            {/* Main crosshair lines */}
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
            
            {/* Inner targeting ring */}
            <View style={styles.crosshairInnerRing} />
            
            {/* Center dot */}
            <View style={styles.crosshairCenter} />
            
            {/* Range finder marks */}
            <View style={[styles.rangeMark, styles.rangeTop]} />
            <View style={[styles.rangeMark, styles.rangeBottom]} />
            <View style={[styles.rangeMark, styles.rangeLeft]} />
            <View style={[styles.rangeMark, styles.rangeRight]} />
            
            {/* Corner brackets */}
            <View style={[styles.cornerBracket, styles.topLeft]} />
            <View style={[styles.cornerBracket, styles.topRight]} />
            <View style={[styles.cornerBracket, styles.bottomLeft]} />
            <View style={[styles.cornerBracket, styles.bottomRight]} />
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
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairOuterRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.7,
  },
  crosshairInnerRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.primary,
    opacity: 0.9,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 110,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 110,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  rangeMark: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  rangeTop: {
    width: 4,
    height: 16,
    top: 6,
  },
  rangeBottom: {
    width: 4,
    height: 16,
    bottom: 6,
  },
  rangeLeft: {
    width: 16,
    height: 4,
    left: 6,
  },
  rangeRight: {
    width: 16,
    height: 4,
    right: 6,
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  topLeft: {
    top: 15,
    left: 15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 15,
    right: 15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 15,
    left: 15,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 15,
    right: 15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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