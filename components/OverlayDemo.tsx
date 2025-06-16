import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, Dimensions } from 'react-native';
import { X, ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';

type OverlayDemoProps = {
  recommendation: 'accept' | 'reject' | 'consider';
  onClose: () => void;
};

export default function OverlayDemo({ recommendation, onClose }: OverlayDemoProps) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  // Default positions for different recommendations
  const getDefaultPosition = () => {
    switch (recommendation) {
      case 'accept':
        return { x: windowWidth * 0.5 - 20, y: windowHeight * 0.85 }; // Over Accept button
      case 'reject':
        return { x: windowWidth * 0.9 - 20, y: windowHeight * 0.3 }; // Over close button
      case 'consider':
        return { x: windowWidth * 0.5 - 20, y: windowHeight * 0.6 }; // Over trip details
    }
  };
  
  const [indicatorPosition, setIndicatorPosition] = useState(getDefaultPosition());
  
  // Pan responder for dragging the indicator
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setIndicatorPosition({
        x: indicatorPosition.x + gestureState.dx,
        y: indicatorPosition.y + gestureState.dy
      });
    },
  });
  
  // Render the appropriate indicator
  const renderIndicator = () => {
    switch (recommendation) {
      case 'accept':
        return (
          <View style={styles.acceptIndicator}>
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairCenter} />
          </View>
        );
      case 'reject':
        return (
          <View style={styles.rejectIndicator}>
            <X size={24} color="#FFFFFF" />
          </View>
        );
      case 'consider':
        return (
          <View style={styles.considerIndicator}>
            <Text style={styles.considerText}>!</Text>
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={onClose}>
        <ArrowLeft size={20} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      
      {/* Draggable Indicator */}
      <View
        style={[
          styles.draggableIndicator,
          {
            left: indicatorPosition.x,
            top: indicatorPosition.y,
          }
        ]}
        {...panResponder.panHandlers}
      >
        {renderIndicator()}
      </View>
      
      {/* Simple instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Drag the {recommendation === 'accept' ? 'green crosshair' : recommendation === 'reject' ? 'red X' : 'yellow warning'} to position it correctly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 4,
  },
  draggableIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 100,
  },
  acceptIndicator: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: '#FFFFFF',
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  rejectIndicator: {
    width: 40,
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  considerIndicator: {
    width: 40,
    height: 40,
    backgroundColor: colors.warning,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  considerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});