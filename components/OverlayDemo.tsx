import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, Dimensions, Image } from 'react-native';
import { X, ArrowLeft, Star, MapPin, Clock } from 'lucide-react-native';
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
      {/* Simulated Uber Interface */}
      <View style={styles.uberInterface}>
        {/* Map Area */}
        <View style={styles.mapArea}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>UBER MAP VIEW</Text>
            <View style={styles.routeLine} />
            <View style={[styles.mapPin, styles.pickupPin]} />
            <View style={[styles.mapPin, styles.dropoffPin]} />
          </View>
        </View>
        
        {/* Trip Request Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.shareSection}>
              <View style={styles.shareIcon}>
                <Text style={styles.shareText}>👥</Text>
              </View>
              <Text style={styles.shareLabel}>Share</Text>
              <Text style={styles.exclusiveLabel}>Exclusive</Text>
            </View>
            <Pressable style={styles.closeButton}>
              <X size={20} color="#666" />
            </Pressable>
          </View>
          
          <Text style={styles.fareAmount}>$4.31</Text>
          
          <View style={styles.ratingSection}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>5.00</Text>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailRow}>
              <Clock size={16} color="#666" />
              <Text style={styles.tripDetailText}>9 mins (3.2 mi)</Text>
            </View>
            
            <View style={styles.locationSection}>
              <View style={styles.locationRow}>
                <View style={styles.pickupDot} />
                <Text style={styles.locationText}>Bristol Forest Way & Waterford Chase Pkwy, Orlando</Text>
              </View>
              
              <View style={styles.locationRow}>
                <View style={styles.dropoffDot} />
                <Text style={styles.locationText}>N Alafaya Trl, Orlando</Text>
              </View>
              
              <Text style={styles.tripDuration}>13 mins (4.4 mi)</Text>
            </View>
          </View>
          
          <Pressable style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </Pressable>
        </View>
      </View>
      
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
      
      {/* Tactical Panel */}
      <View style={styles.tacticalPanel}>
        <Text style={styles.tacticalTitle}>TACTICAL PANEL</Text>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>FARE:</Text>
          <Text style={styles.tacticalValue}>$4.31</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>PICKUP:</Text>
          <Text style={styles.tacticalValue}>3.2 mi</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>TRIP:</Text>
          <Text style={styles.tacticalValue}>4.4 mi</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>RATING:</Text>
          <Text style={styles.tacticalValue}>5.00</Text>
        </View>
      </View>
      
      {/* Simple instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Drag the {recommendation === 'accept' ? 'green crosshair' : recommendation === 'reject' ? 'red X' : 'yellow warning'} to position it correctly over the Uber interface
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  uberInterface: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 20,
  },
  routeLine: {
    position: 'absolute',
    width: 200,
    height: 3,
    backgroundColor: '#000',
    transform: [{ rotate: '45deg' }],
  },
  mapPin: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pickupPin: {
    backgroundColor: '#000',
    top: '30%',
    left: '20%',
  },
  dropoffPin: {
    backgroundColor: '#4285F4',
    top: '60%',
    right: '20%',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  exclusiveLabel: {
    fontSize: 14,
    color: '#4285F4',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closeButton: {
    padding: 4,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
  },
  tripDetails: {
    marginBottom: 20,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDetailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  locationSection: {
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginTop: 6,
    marginRight: 12,
  },
  dropoffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4285F4',
    marginTop: 6,
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tripDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 20,
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  tacticalPanel: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    zIndex: 50,
  },
  tacticalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tacticalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tacticalLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tacticalValue: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
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