import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, PanResponder, Dimensions, Platform } from 'react-native';
import { X, ChevronRight, ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OverlayDemoProps = {
  recommendation: 'accept' | 'reject' | 'consider';
  onClose: () => void;
  initialPositions?: any;
  launchAttempted?: boolean;
};

export default function OverlayDemo({ recommendation, onClose, initialPositions, launchAttempted }: OverlayDemoProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showMinimal, setShowMinimal] = useState(false);
  const [autoHideActive, setAutoHideActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  // Default positions - positioned to match typical rideshare app UI
  const defaultPositions = {
    indicator: { 
      x: recommendation === 'accept' ? windowWidth * 0.65 : windowWidth * 0.8, 
      y: recommendation === 'accept' ? windowHeight * 0.85 : windowHeight * 0.5 
    }
  };
  
  // Use saved positions or defaults
  const [indicatorPosition, setIndicatorPosition] = useState(
    initialPositions?.indicator || defaultPositions.indicator
  );
  
  // Auto-hide timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!showInstructions && !autoHideActive) {
      timer = setTimeout(() => {
        setAutoHideActive(true);
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showInstructions, autoHideActive]);
  
  // Reset auto-hide when tapped
  const handleOverlayPress = () => {
    if (autoHideActive) {
      setAutoHideActive(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Save positions when overlay is closed
  const handleClose = async () => {
    try {
      const positions = {
        indicator: indicatorPosition
      };
      await AsyncStorage.setItem('overlayPositions', JSON.stringify(positions));
    } catch (error) {
      console.error('Failed to save overlay positions:', error);
    }
    onClose();
  };
  
  // Pan responder for the indicator
  const indicatorPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setIndicatorPosition({
        x: indicatorPosition.x + gestureState.dx,
        y: indicatorPosition.y + gestureState.dy
      });
    },
    onPanResponderRelease: () => {
      // Reset auto-hide timer
      if (autoHideActive) {
        setAutoHideActive(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  });
  
  // Render the appropriate indicator based on recommendation
  const renderIndicator = () => {
    switch (recommendation) {
      case 'accept':
        return (
          <View style={styles.crosshairContainer}>
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairCenter} />
          </View>
        );
      case 'reject':
        return (
          <View style={[styles.indicatorContainer, styles.rejectIndicator]}>
            <X size={20} color={colors.textPrimary} />
          </View>
        );
      case 'consider':
        return (
          <View style={[styles.indicatorContainer, styles.considerIndicator]}>
            <Text style={styles.considerText}>!</Text>
          </View>
        );
    }
  };
  
  // Show instructions overlay
  if (showInstructions) {
    return (
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>
            {launchAttempted ? "Rideshare App Launched" : "Overlay Demo Mode"}
          </Text>
          
          <Text style={styles.instructionsText}>
            {launchAttempted 
              ? "The rideshare app has been launched. This overlay will appear on top of the app to help you evaluate trip requests."
              : "This is a demonstration of how the overlay will appear on top of your rideshare app. You can drag the indicator to position it where you want."}
          </Text>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionStepText}>
              Drag the {recommendation === 'accept' ? 'green crosshair' : recommendation === 'reject' ? 'red X' : 'yellow warning'} to position it over the {recommendation === 'accept' ? 'Accept button' : recommendation === 'reject' ? 'Close button' : 'trip details'}.
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionStepText}>
              The overlay will automatically dim after 5 seconds. Tap anywhere to restore full visibility.
            </Text>
          </View>
          
          <Pressable 
            style={styles.continueButton}
            onPress={() => setShowInstructions(false)}
          >
            <Text style={styles.continueButtonText}>CONTINUE TO DEMO</Text>
            <ChevronRight size={20} color={colors.textPrimary} />
          </Pressable>
          
          <Pressable 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>CLOSE DEMO</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  return (
    <Pressable style={styles.container} onPress={handleOverlayPress}>
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={handleClose}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back to App</Text>
        </Pressable>
        
        {/* Draggable indicator */}
        <Animated.View
          style={[
            styles.draggableIndicator,
            {
              left: indicatorPosition.x,
              top: indicatorPosition.y,
            }
          ]}
          {...indicatorPanResponder.panHandlers}
        >
          {renderIndicator()}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  draggableIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  crosshairContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
  },
  indicatorContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  rejectIndicator: {
    backgroundColor: colors.secondary,
  },
  considerIndicator: {
    backgroundColor: colors.warning,
  },
  considerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  instructionsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  instructionStepText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});