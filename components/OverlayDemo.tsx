import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, PanResponder } from 'react-native';
import { AlertTriangle, ArrowLeft, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OverlayDemoProps {
  recommendation: 'accept' | 'reject' | 'consider';
  onClose: () => void;
  initialPositions?: any;
}

interface Position {
  x: number;
  y: number;
}

export default function OverlayDemo({ recommendation, onClose, initialPositions }: OverlayDemoProps) {
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [opacity] = useState(new Animated.Value(1));
  
  // Position state for draggable elements with initial default positions
  const [tacticalPanelPosition, setTacticalPanelPosition] = useState<Position>({ x: 0, y: 0 });
  const [acceptOverlayPosition, setAcceptOverlayPosition] = useState<Position>({ x: 0, y: 0 });
  const [rejectXPosition, setRejectXPosition] = useState<Position>({ x: 0, y: 0 });
  const [positionsLoaded, setPositionsLoaded] = useState(false);
  
  // Load saved positions from storage on component mount
  useEffect(() => {
    const loadPositions = async () => {
      try {
        // If initialPositions were passed, use them
        if (initialPositions) {
          setTacticalPanelPosition(initialPositions.tacticalPanel || { x: 0, y: 0 });
          setAcceptOverlayPosition(initialPositions.acceptOverlay || { x: 0, y: 0 });
          setRejectXPosition(initialPositions.rejectX || { x: 0, y: 0 });
          setPositionsLoaded(true);
          return;
        }
        
        // Otherwise load from AsyncStorage
        const savedPositions = await AsyncStorage.getItem('overlayPositions');
        if (savedPositions) {
          const positions = JSON.parse(savedPositions);
          setTacticalPanelPosition(positions.tacticalPanel || { x: 0, y: 0 });
          setAcceptOverlayPosition(positions.acceptOverlay || { x: 0, y: 0 });
          setRejectXPosition(positions.rejectX || { x: 0, y: 0 });
        }
        setPositionsLoaded(true);
      } catch (error) {
        console.error('Failed to load overlay positions:', error);
        setPositionsLoaded(true);
      }
    };
    loadPositions();
  }, [initialPositions]);

  // Save positions to storage when they change
  useEffect(() => {
    if (!positionsLoaded) return;
    
    const savePositions = async () => {
      try {
        const positions = {
          tacticalPanel: tacticalPanelPosition,
          acceptOverlay: acceptOverlayPosition,
          rejectX: rejectXPosition,
        };
        await AsyncStorage.setItem('overlayPositions', JSON.stringify(positions));
        console.log('Saved overlay positions:', positions);
      } catch (error) {
        console.error('Failed to save overlay positions:', error);
      }
    };
    savePositions();
  }, [tacticalPanelPosition, acceptOverlayPosition, rejectXPosition, positionsLoaded]);
  
  // Create pan responders for each draggable element
  const tacticalPanelPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setTacticalPanelPosition({
        x: tacticalPanelPosition.x + gestureState.dx,
        y: tacticalPanelPosition.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      handleInteraction();
    },
  });
  
  const acceptOverlayPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setAcceptOverlayPosition({
        x: acceptOverlayPosition.x + gestureState.dx,
        y: acceptOverlayPosition.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      handleInteraction();
    },
  });
  
  const rejectXPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setRejectXPosition({
        x: rejectXPosition.x + gestureState.dx,
        y: rejectXPosition.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      handleInteraction();
    },
  });
  
  // Auto-hide the overlay after 5 seconds (safety feature)
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 5000);
    
    setAutoHideTimer(timer);
    
    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, []);
  
  // Reset the auto-hide timer when the user interacts with the overlay
  const handleInteraction = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
    
    opacity.setValue(1);
    
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 5000);
    
    setAutoHideTimer(timer);
  };
  
  return (
    <Pressable 
      style={styles.container} 
      onPress={handleInteraction}
    >
      {/* Back button - prominent and always visible */}
      <Pressable 
        style={styles.backButton} 
        onPress={onClose}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <ArrowLeft size={28} color={colors.primary} />
        <Text style={styles.backButtonText}>BACK</Text>
      </Pressable>

      <View style={styles.mockPhoneFrame}>
        {/* Mock Rideshare App Background - Map */}
        <View style={styles.mockAppBackground}>
          <View style={styles.mockMap}>
            {/* Simplified map elements */}
            <View style={styles.mockRoute} />
            <View style={styles.mockPickupPoint} />
            <View style={styles.mockDropoffPoint} />
          </View>
          
          {/* Mock Trip Request Card */}
          <View style={styles.mockTripRequest}>
            <View style={styles.mockRequestHeader}>
              <View style={styles.mockShareButton}>
                <Text style={styles.mockShareText}>Share</Text>
              </View>
              <Text style={styles.mockExclusiveText}>Exclusive</Text>
              <View style={styles.mockCloseButton}>
                <Text style={styles.mockCloseText}>×</Text>
              </View>
            </View>
            
            <Text style={styles.mockFareAmount}>$4.31</Text>
            
            <View style={styles.mockRatingContainer}>
              <Text style={styles.mockRatingStar}>★</Text>
              <Text style={styles.mockRatingValue}>5.00</Text>
            </View>
            
            <Text style={styles.mockTripTime}>9 mins (3.2 mi)</Text>
            
            <View style={styles.mockLocationContainer}>
              <View style={styles.mockLocationDot} />
              <View style={styles.mockLocationLine} />
              <View style={styles.mockLocationSquare} />
              
              <View style={styles.mockLocationTexts}>
                <Text style={styles.mockPickupText}>Bristol Forest Way, Orlando</Text>
                <Text style={styles.mockPickupEta}>13 mins (4.4 mi)</Text>
                <Text style={styles.mockDropoffText}>N Alafaya Trl, Orlando</Text>
              </View>
            </View>
            
            <View style={styles.mockAcceptButton}>
              <Text style={styles.mockAcceptText}>Accept</Text>
            </View>
          </View>
        </View>
        
        {/* Sniper Overlay */}
        <Animated.View style={[styles.overlayContainer, { opacity }]}>
          {/* Tactical Info Panel - Draggable */}
          <Animated.View 
            style={[
              styles.tacticalPanel, 
              { 
                transform: [
                  { translateX: tacticalPanelPosition.x },
                  { translateY: tacticalPanelPosition.y }
                ] 
              }
            ]}
            {...tacticalPanelPanResponder.panHandlers}
          >
            <Text style={styles.tacticalPanelDragHint}>Drag</Text>
            <Text style={styles.fareAmount}>$4.31</Text>
            
            <View style={styles.distanceContainer}>
              <View style={styles.distanceItem}>
                <Text style={styles.distanceLabel}>PICKUP</Text>
                <Text style={styles.distanceValue}>4.4 mi</Text>
              </View>
              
              <View style={styles.distanceItem}>
                <Text style={styles.distanceLabel}>DROPOFF</Text>
                <Text style={styles.distanceValue}>3.2 mi</Text>
              </View>
            </View>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>8s</Text>
            </View>
          </Animated.View>
          
          {/* Action Button Overlays */}
          <Animated.View 
            style={[
              styles.buttonOverlay, 
              styles.acceptOverlay,
              recommendation !== 'reject' ? styles.activeOverlay : styles.inactiveOverlay,
              recommendation === 'accept' ? { backgroundColor: colors.primary } : 
              recommendation === 'consider' ? { backgroundColor: colors.warning } : {},
              { 
                transform: [
                  { translateX: acceptOverlayPosition.x },
                  { translateY: acceptOverlayPosition.y }
                ] 
              }
            ]}
            {...acceptOverlayPanResponder.panHandlers}
          >
            <Text style={styles.overlayDragHint}>Drag</Text>
            {recommendation === 'accept' ? (
              <View style={styles.crosshairContainer}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
            ) : recommendation === 'consider' ? (
              <AlertTriangle size={32} color={colors.textPrimary} />
            ) : null}
          </Animated.View>
          
          {/* Red X Button - Only shown for reject recommendation - Draggable */}
          {recommendation === 'reject' && (
            <Animated.View 
              style={[
                styles.rejectXButton,
                { 
                  transform: [
                    { translateX: rejectXPosition.x },
                    { translateY: rejectXPosition.y }
                  ] 
                }
              ]}
              {...rejectXPanResponder.panHandlers}
            >
              <Text style={styles.overlayDragHint}>Drag</Text>
              <X size={32} color={colors.textPrimary} />
            </Animated.View>
          )}
        </Animated.View>
      </View>
      
      <View style={styles.demoControls}>
        <Text style={styles.demoText}>
          The overlay auto-dims after 5 seconds for safety. Tap anywhere to restore.
        </Text>
        
        <Text style={styles.dragInstructionText}>
          {recommendation === 'accept' ? (
            <>
              <Text style={styles.dragInstructionHighlight}>Place the green crosshair</Text> directly over the "Accept" button to quickly identify profitable trips.
            </>
          ) : recommendation === 'reject' ? (
            <>
              <Text style={styles.dragInstructionHighlight}>Position the red X</Text> near the close button (×) in the top-right corner to quickly identify unprofitable trips.
            </>
          ) : (
            <>
              <Text style={styles.dragInstructionHighlight}>Place the yellow warning</Text> above the trip details to indicate borderline trips that need closer inspection.
            </>
          )}
        </Text>
        
        <Text style={styles.tacticalPanelInstructionText}>
          <Text style={styles.dragInstructionHighlight}>Position the tactical panel</Text> where it won't block important information like pickup/dropoff locations.
        </Text>
        
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>CLOSE DEMO</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    zIndex: 1000,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  mockPhoneFrame: {
    width: 280,
    height: 500,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: '#333',
    overflow: 'hidden',
    position: 'relative',
  },
  mockAppBackground: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    position: 'relative',
  },
  mockRoute: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  mockPickupPoint: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  mockDropoffPoint: {
    position: 'absolute',
    top: '40%',
    right: '20%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
  },
  mockTripRequest: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mockRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockShareButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  mockShareText: {
    fontSize: 12,
    color: '#333',
  },
  mockExclusiveText: {
    fontSize: 12,
    color: '#4285F4',
  },
  mockCloseButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCloseText: {
    fontSize: 20,
    color: '#333',
  },
  mockFareAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  mockRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mockRatingStar: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  mockRatingValue: {
    fontSize: 14,
    color: '#333',
  },
  mockTripTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  mockLocationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mockLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginTop: 6,
  },
  mockLocationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ccc',
    marginLeft: 3,
    marginTop: 10,
  },
  mockLocationSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    marginTop: 40,
  },
  mockLocationTexts: {
    marginLeft: 12,
    flex: 1,
  },
  mockPickupText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  mockPickupEta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  mockDropoffText: {
    fontSize: 12,
    color: '#333',
  },
  mockAcceptButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mockAcceptText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  tacticalPanel: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 8,
    padding: 12,
    width: 140,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 100,
  },
  tacticalPanelDragHint: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 8,
    color: colors.primary,
    opacity: 0.7,
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceItem: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  distanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timerContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timer: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  buttonOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 100,
  },
  acceptOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 48,
    borderRadius: 8,
    borderColor: colors.primary,
  },
  activeOverlay: {
    opacity: 1,
  },
  inactiveOverlay: {
    opacity: 0.3,
  },
  rejectXButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    zIndex: 200,
  },
  overlayDragHint: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 8,
    color: colors.textPrimary,
    opacity: 0.7,
  },
  crosshairContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 32,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 32,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  demoControls: {
    marginTop: 24,
    alignItems: 'center',
  },
  demoText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    maxWidth: 300,
  },
  dragInstructionText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    maxWidth: 300,
    lineHeight: 20,
  },
  tacticalPanelInstructionText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    maxWidth: 300,
    lineHeight: 20,
  },
  dragInstructionHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});