import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, PanResponder, Dimensions, Platform } from 'react-native';
import { Check, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useOverlayStore } from '@/store/overlayStore';

interface TripData {
  fare: number;
  pickupDistance: number;
  totalDistance: number;
}

interface TripOverlayProps {
  tripData?: TripData;
}

export default function TripOverlay({ tripData }: TripOverlayProps) {
  const { overlayVisible, tripQuality, acceptPosition, rejectPosition, updatePosition, positioningMode, hideOverlay } = useOverlayStore();
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const acceptPan = useRef({ x: acceptPosition.x, y: acceptPosition.y });
  const rejectPan = useRef({ x: rejectPosition.x, y: rejectPosition.y });

  // Auto-hide overlay after 15 seconds (simulating Uber's timeout)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (overlayVisible && !positioningMode) {
      timeout = setTimeout(() => {
        hideOverlay();
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [overlayVisible, positioningMode, hideOverlay]);

  const acceptPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => positioningMode,
      onPanResponderMove: (event, gestureState) => {
        acceptPan.current = {
          x: acceptPosition.x + gestureState.dx,
          y: acceptPosition.y + gestureState.dy,
        };
      },
      onPanResponderRelease: () => {
        updatePosition('accept', { x: acceptPan.current.x, y: acceptPan.current.y });
      },
    })
  ).current;

  const rejectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => positioningMode,
      onPanResponderMove: (event, gestureState) => {
        rejectPan.current = {
          x: rejectPosition.x + gestureState.dx,
          y: rejectPosition.y + gestureState.dy,
        };
      },
      onPanResponderRelease: () => {
        updatePosition('reject', { x: rejectPan.current.x, y: rejectPan.current.y });
      },
    })
  ).current;

  // Calculate price per mile if trip data is available
  const calculatePricePerMile = () => {
    if (!tripData) return null;
    const totalMiles = tripData.pickupDistance + tripData.totalDistance;
    const pricePerMile = tripData.fare / totalMiles;
    return pricePerMile.toFixed(2);
  };

  const renderPricePerMileWidget = () => {
    const pricePerMile = calculatePricePerMile();
    if (!pricePerMile) return null;

    const widgetColor = tripQuality === 'green' ? colors.primary : 
                       tripQuality === 'yellow' ? colors.warning : colors.secondary;
    
    return (
      <View style={[styles.pricePerMileWidget, { backgroundColor: widgetColor }]}>
        <Text style={styles.pricePerMileText}>${pricePerMile}/mi</Text>
      </View>
    );
  };

  if (!overlayVisible) {
    return null;
  }

  const renderAcceptButton = () => {
    if (tripQuality === 'red') {
      return null;
    }

    const backgroundColor = tripQuality === 'green' ? colors.primary : colors.warning;
    const borderColor = tripQuality === 'green' ? '#45a049' : '#ffb300';
    const text = tripQuality === 'green' ? 'GOOD TRIP' : 'MAYBE';

    return (
      <TouchableOpacity
        style={[
          styles.acceptButton,
          { backgroundColor, borderColor, left: acceptPosition.x, bottom: screenHeight - acceptPosition.y },
          positioningMode && styles.positioningMode,
        ]}
        {...acceptPanResponder.panHandlers}
        activeOpacity={positioningMode ? 1 : 0.8}
        onPress={() => {
          if (!positioningMode) {
            // Simulate tap on Uber accept button - in a real app, this would pass through
            console.log('Accept button tapped');
            hideOverlay();
          }
        }}
      >
        <View style={styles.crosshair}>
          <View style={styles.crosshairOuterRing} />
          <View style={styles.crosshairHorizontal} />
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairCenter} />
        </View>
        <Text style={styles.acceptButtonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlayContainer}>
      {/* Price per mile widget */}
      {renderPricePerMileWidget()}
      
      {/* Accept overlay */}
      {renderAcceptButton()}
      
      {/* Reject overlay */}
      <TouchableOpacity
        style={[
          styles.rejectButton,
          { right: screenWidth - rejectPosition.x, top: rejectPosition.y },
          positioningMode && styles.positioningMode,
        ]}
        {...rejectPanResponder.panHandlers}
        activeOpacity={positioningMode ? 1 : 0.8}
        onPress={() => {
          if (!positioningMode) {
            // Simulate tap on Uber reject button
            console.log('Reject button tapped');
            hideOverlay();
          }
        }}
      >
        <X size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  pricePerMileWidget: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1002,
    pointerEvents: 'none',
  },
  pricePerMileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    position: 'absolute',
    width: '85%',
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    pointerEvents: 'auto',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  crosshair: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  crosshairOuterRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    opacity: 0.6,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: 'white',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: 'white',
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  rejectButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    pointerEvents: 'auto',
  },
  positioningMode: {
    opacity: 0.5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#000',
  },
});