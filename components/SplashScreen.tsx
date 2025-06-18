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
            
            {/* Reticle lines */}
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
            
            {/* Mil-dot markers */}
            <View style={[styles.milDot, styles.milDotTop]} />
            <View style={[styles.milDot, styles.milDotBottom]} />
            <View style={[styles.milDot, styles.milDotLeft]} />
            <View style={[styles.milDot, styles.milDotRight]} />
            
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
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairOuterRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.7,
  },
  crosshairInnerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.primary,
    opacity: 0.9,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 130,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 130,
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
    width: 2,
    height: 10,
    top: 15,
  },
  rangeBottom: {
    width: 2,
    height: 10,
    bottom: 15,
  },
  rangeLeft: {
    width: 10,
    height: 2,
    left: 15,
  },
  rangeRight: {
    width: 10,
    height: 2,
    right: 15,
  },
  milDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  milDotTop: {
    top: 40,
  },
  milDotBottom: {
    bottom: 40,
  },
  milDotLeft: {
    left: 40,
  },
  milDotRight: {
    right: 40,
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
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