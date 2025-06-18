import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, PanResponder, Dimensions, Platform } from 'react-native';
import { Check, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useOverlayStore } from '@/store/overlayStore';
import { useSettingsStore } from '@/store/settingsStore';

interface TripData {
  fare: number;
  pickupDistance: number;
  totalDistance: number;
  passengerRating?: number;
}

interface TripOverlayProps {
  tripData?: TripData;
}

export default function TripOverlay({ tripData }: TripOverlayProps) {
  const { overlayVisible, tripQuality, acceptPosition, rejectPosition, updatePosition, positioningMode, hideOverlay } = useOverlayStore();
  const { ratingFilterEnabled, minRating } = useSettingsStore();
  
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

  // Constrain position to stay within screen bounds
  const constrainPosition = (x: number, y: number, elementWidth: number, elementHeight: number) => {
    const maxX = screenWidth - elementWidth;
    const maxY = screenHeight - elementHeight;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  };

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
        // Constrain to screen bounds
        const constrained = constrainPosition(acceptPan.current.x, acceptPan.current.y, screenWidth * 0.7, 44);
        updatePosition('accept', constrained);
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
        // Constrain to screen bounds
        const constrained = constrainPosition(rejectPan.current.x, rejectPan.current.y, 40, 40);
        updatePosition('reject', constrained);
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

  // Check if trip passes rating filter
  const passesRatingFilter = () => {
    if (!ratingFilterEnabled || !tripData?.passengerRating) return true;
    return tripData.passengerRating >= minRating;
  };

  const renderPricePerMileWidget = () => {
    const pricePerMile = calculatePricePerMile();
    if (!pricePerMile) return null;

    // If rating filter is enabled and trip doesn't pass, force red color
    if (ratingFilterEnabled && !passesRatingFilter()) {
      return (
        <View style={[styles.pricePerMileWidget, { backgroundColor: colors.secondary }]}>
          <Text style={styles.pricePerMileText}>${pricePerMile}/mi</Text>
        </View>
      );
    }

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
    // If rating filter is enabled and trip doesn't pass, don't show accept button
    if (tripQuality === 'red' || (ratingFilterEnabled && !passesRatingFilter())) {
      return null;
    }

    const backgroundColor = tripQuality === 'green' ? colors.primary : colors.warning;
    const borderColor = tripQuality === 'green' ? '#45a049' : '#ffb300';
    const text = tripQuality === 'green' ? 'GOOD TRIP' : 'MAYBE';

    return (
      <TouchableOpacity
        style={[
          styles.acceptButton,
          { 
            backgroundColor, 
            borderColor, 
            left: acceptPosition.x,
            top: acceptPosition.y,
            width: screenWidth * 0.7, // Responsive width
          },
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
      {/* Price per mile widget - always visible */}
      {renderPricePerMileWidget()}
      
      {/* Accept overlay */}
      {renderAcceptButton()}
      
      {/* Reject overlay */}
      <TouchableOpacity
        style={[
          styles.rejectButton,
          { 
            left: rejectPosition.x, 
            top: rejectPosition.y,
            width: 40, // Fixed size for reject button
            height: 40,
          },
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
        <X size={20} color="white" />
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
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1002,
    pointerEvents: 'auto',
  },
  pricePerMileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  acceptButton: {
    position: 'absolute',
    height: 44,
    borderRadius: 8,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  crosshair: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: 'white',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: 'white',
  },
  crosshairCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  rejectButton: {
    position: 'absolute',
    borderRadius: 20,
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
    opacity: 0.7,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
});