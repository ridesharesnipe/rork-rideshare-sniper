import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import colors from '@/constants/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleSwitch({ value, onValueChange }: ToggleSwitchProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.surfaceLight, true: colors.primary }}
      thumbColor={colors.textPrimary}
    />
  );
}