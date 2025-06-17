import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: ViewStyle;
}

// A simple web-compatible slider implementation
export default function SliderWeb({
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  minimumTrackTintColor = colors.primary,
  maximumTrackTintColor = colors.surfaceLight,
  thumbTintColor = colors.primary,
  style,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    onValueChange(newValue);
  };
  
  // Custom styling for the HTML input range element
  const webStyles = `
    .custom-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: ${maximumTrackTintColor};
      outline: none;
      opacity: 1;
      transition: opacity 0.2s;
    }
    
    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${thumbTintColor};
      cursor: pointer;
    }
    
    .custom-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${thumbTintColor};
      cursor: pointer;
      border: none;
    }
    
    .custom-slider::-ms-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${thumbTintColor};
      cursor: pointer;
    }
    
    .custom-slider::-webkit-slider-runnable-track {
      background: linear-gradient(to right, 
        ${minimumTrackTintColor} 0%, 
        ${minimumTrackTintColor} ${((internalValue - minimumValue) / (maximumValue - minimumValue)) * 100}%, 
        ${maximumTrackTintColor} ${((internalValue - minimumValue) / (maximumValue - minimumValue)) * 100}%, 
        ${maximumTrackTintColor} 100%);
      height: 4px;
      border-radius: 2px;
    }
    
    .custom-slider::-moz-range-track {
      background: ${maximumTrackTintColor};
      height: 4px;
      border-radius: 2px;
    }
    
    .custom-slider::-moz-range-progress {
      background: ${minimumTrackTintColor};
      height: 4px;
      border-radius: 2px;
    }
  `;
  
  return (
    <View style={[styles.container, style]}>
      <style dangerouslySetInnerHTML={{ __html: webStyles }} />
      <input
        type="range"
        className="custom-slider"
        min={minimumValue}
        max={maximumValue}
        step={step}
        value={internalValue}
        onChange={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
});