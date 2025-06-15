import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import colors from '@/constants/colors';

// Use different slider implementations for web vs native
const SliderComponent = Platform.select({
  web: () => require('./SliderWeb').default,
  default: () => require('@react-native-community/slider').default,
})();

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
}

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
}: SliderProps) {
  return (
    <View style={styles.container}>
      <SliderComponent
        style={styles.slider}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.surfaceLight}
        thumbTintColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});