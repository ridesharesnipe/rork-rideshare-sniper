import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Circle } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';

export default function StatusIndicator() {
  const { driverStatus, setDriverStatus } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();
  
  // Set driver status to online when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setDriverStatus('online');
    }
  }, [isAuthenticated, setDriverStatus]);
  
  const toggleStatus = () => {
    if (driverStatus === 'offline') {
      setDriverStatus('online');
    } else if (driverStatus === 'online') {
      setDriverStatus('offline');
    }
  };
  
  const getStatusColor = () => {
    switch (driverStatus) {
      case 'online':
        return colors.online;
      case 'offline':
        return colors.offline;
      case 'busy':
        return colors.busy;
      default:
        return colors.offline;
    }
  };
  
  const getStatusText = () => {
    switch (driverStatus) {
      case 'online':
        return 'ONLINE';
      case 'offline':
        return 'OFFLINE';
      case 'busy':
        return 'BUSY';
      default:
        return 'OFFLINE';
    }
  };
  
  return (
    <Pressable onPress={toggleStatus} style={styles.container}>
      <View style={styles.statusContainer}>
        <Circle
          size={14}
          fill={getStatusColor()}
          color={getStatusColor()}
          style={styles.statusIcon}
        />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});