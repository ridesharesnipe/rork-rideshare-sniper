import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Linking, Platform } from 'react-native';
import { Radar } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useOverlayStore } from '@/store/overlayStore';

interface StartSniperButtonProps {
  onPress?: () => void;
  isActive?: boolean;
}

const StartSniperButton: React.FC<StartSniperButtonProps> = ({ 
  onPress, 
  isActive = false 
}) => {
  const { showOverlay, hideOverlay } = useOverlayStore();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior if no onPress prop is provided
      if (!isActive) {
        // Launch Uber app
        const uberUrl = Platform.OS === 'android' ? 'uber://' : 'uber://';
        Linking.openURL(uberUrl).catch(err => console.error("Failed to open Uber app", err));
        // Show overlay (for demo purposes, assuming a good trip)
        showOverlay('green');
      } else {
        hideOverlay();
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isActive ? styles.activeButton : null
      ]} 
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Radar size={24} color={isActive ? '#000' : 'white'} style={styles.icon} />
        <Text style={[
          styles.text,
          isActive ? styles.activeText : null
        ]}>
          {isActive ? 'SNIPER ACTIVE' : 'START SNIPER'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 200,
  },
  activeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeText: {
    color: '#000',
  },
});
export default StartSniperButton;