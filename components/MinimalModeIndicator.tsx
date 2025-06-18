import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import colors from '@/constants/colors';

interface MinimalModeIndicatorProps {
  recommendation: 'accept' | 'reject' | 'consider';
  fare: number;
  pickupDistance: number;
  dropoffDistance: number;
}

export default function MinimalModeIndicator({
  recommendation,
  fare,
  pickupDistance,
  dropoffDistance,
}: MinimalModeIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    setExpanded(!expanded);
  };
  
  const getIndicatorColor = () => {
    switch (recommendation) {
      case 'accept':
        return colors.primary;
      case 'consider':
        return colors.warning;
      case 'reject':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };
  
  const panelWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 120],
  });
  
  const panelHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 70],
  });
  
  const contentOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  return (
    <Pressable onPress={toggleExpanded}>
      <Animated.View 
        style={[
          styles.container,
          { 
            backgroundColor: getIndicatorColor(),
            width: panelWidth,
            height: panelHeight,
          }
        ]}
      >
        <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
          <Text style={styles.fareAmount}>${fare.toFixed(2)}</Text>
          
          <View style={styles.distanceContainer}>
            <View style={styles.distanceItem}>
              <Text style={styles.distanceLabel}>PICKUP</Text>
              <Text style={styles.distanceValue}>{pickupDistance.toFixed(1)} mi</Text>
            </View>
            
            <View style={styles.distanceItem}>
              <Text style={styles.distanceLabel}>DROPOFF</Text>
              <Text style={styles.distanceValue}>{dropoffDistance.toFixed(1)} mi</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.background,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    padding: 6,
    width: '100%',
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceItem: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.textPrimary,
    opacity: 0.8,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  distanceValue: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});