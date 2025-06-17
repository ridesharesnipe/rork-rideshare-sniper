import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface StatusIndicatorProps {
  isActive?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isActive }) => {
  const driverStatus = useSettingsStore(state => state.driverStatus);
  
  // If isActive is provided, use it, otherwise use the store's driverStatus
  const active = isActive !== undefined ? isActive : driverStatus === 'online';
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.indicator,
        active ? styles.activeIndicator : styles.inactiveIndicator
      ]} />
      <Text style={styles.text}>
        {active ? 'Sniper Active' : 'Sniper Inactive'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
  inactiveIndicator: {
    backgroundColor: colors.secondary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default StatusIndicator;