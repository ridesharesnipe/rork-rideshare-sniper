import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import { useOverlayStore } from '@/store/overlayStore';

const { width, height } = Dimensions.get('window');

export default function InteractiveDemo() {
  const [showTripRequest, setShowTripRequest] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    fare: 18.50,
    pickup: 2.1,
    destination: 5.4,
    passenger: 'John D.',
    rating: 4.8,
    shared: false,
  });
  const [recommendation, setRecommendation] = useState<'accept' | 'reject' | 'consider'>('accept');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { showOverlay: showTripOverlay, hideOverlay } = useOverlayStore();
  
  useEffect(() => {
    // Show trip request after a short delay
    const timer = setTimeout(() => {
      setShowTripRequest(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Show overlay after trip request appears
    if (showTripRequest) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
        showTripOverlay('green');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showTripRequest]);
  
  const handleAccept = () => {
    setShowTripRequest(false);
    setShowOverlay(false);
    hideOverlay();
    setShowExplanation(true);
  };
  
  const handleReject = () => {
    setShowTripRequest(false);
    setShowOverlay(false);
    hideOverlay();
    setShowExplanation(true);
  };
  
  const handleNewTrip = () => {
    // Reset state
    setShowExplanation(false);
    setShowTripRequest(false);
    setShowOverlay(false);
    hideOverlay();
    
    // Generate new trip details
    const newFare = Math.floor(Math.random() * 20) + 5 + Math.random().toFixed(2) * 1;
    const newPickup = Math.floor(Math.random() * 7) + 1 + Math.random().toFixed(1) * 1;
    const newDestination = Math.floor(Math.random() * 10) + 3 + Math.random().toFixed(1) * 1;
    const newRating = (Math.random() * 2 + 3).toFixed(1) * 1;
    const newShared = Math.random() > 0.7;
    
    // Determine recommendation
    let newRecommendation: 'accept' | 'reject' | 'consider' = 'accept';
    
    if (newFare < 10 || newPickup > 5 || newRating < 4.5 || newShared) {
      if (newFare < 7 || newPickup > 7 || newRating < 4.0) {
        newRecommendation = 'reject';
      } else {
        newRecommendation = 'consider';
      }
    }
    
    setTripDetails({
      fare: parseFloat(newFare.toFixed(2)),
      pickup: parseFloat(newPickup.toFixed(1)),
      destination: parseFloat(newDestination.toFixed(1)),
      passenger: 'John D.',
      rating: parseFloat(newRating.toFixed(1)),
      shared: newShared,
    });
    
    setRecommendation(newRecommendation);
    
    // Show new trip request after a short delay
    setTimeout(() => {
      setShowTripRequest(true);
      
      // Show overlay after trip request appears
      setTimeout(() => {
        setShowOverlay(true);
        showTripOverlay(newRecommendation);
      }, 1000);
    }, 1000);
  };
  
  const getExplanation = () => {
    if (recommendation === 'accept') {
      return {
        title: '✅ GREEN OVERLAY - ACCEPT THIS TRIP',
        text: '• Fare: $18.50 (above $5 minimum ✓)\n• Pickup: 2.1 miles (under 5 mile limit ✓)\n• Price per mile: $3.42 (excellent rate ✓)\n• Decision: All criteria met - GOOD TRIP!',
        color: colors.primary,
      };
    } else if (recommendation === 'consider') {
      return {
        title: '⚠️ YELLOW OVERLAY - CONSIDER THIS TRIP',
        text: '• Fare: $' + tripDetails.fare.toFixed(2) + ' (good fare ✓)\n• Pickup: ' + tripDetails.pickup + ' miles (slightly high ⚠️)\n• Passenger Rating: ' + tripDetails.rating + ' (acceptable ✓)\n• Decision: Some concerns but may be worth taking',
        color: colors.warning,
      };
    } else {
      return {
        title: '❌ RED OVERLAY - REJECT THIS TRIP',
        text: '• Fare: $' + tripDetails.fare.toFixed(2) + ' (too low ❌)\n• Pickup: ' + tripDetails.pickup + ' miles (too far ❌)\n• Shared Ride: ' + (tripDetails.shared ? 'Yes ❌' : 'No ✓') + '\n• Decision: Multiple criteria failed - BAD TRIP!',
        color: colors.secondary,
      };
    }
  };
  
  if (showExplanation) {
    const explanation = getExplanation();
    
    return (
      <View style={styles.container}>
        <View style={[styles.explanationCard, { borderColor: explanation.color }]}>
          <Text style={[styles.explanationTitle, { color: explanation.color }]}>
            {explanation.title}
          </Text>
          <Text style={styles.explanationText}>
            {explanation.text}
          </Text>
          
          <TouchableOpacity 
            style={[styles.explanationButton, { backgroundColor: explanation.color }]}
            onPress={handleNewTrip}
          >
            <Text style={styles.explanationButtonText}>
              Try Another Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {!showTripRequest ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Waiting for trip request...</Text>
        </View>
      ) : (
        <View style={styles.tripRequestContainer}>
          <View style={styles.tripRequestHeader}>
            <Text style={styles.tripRequestTitle}>Trip Request</Text>
            <View style={styles.tripTimer}>
              <Text style={styles.tripTimerText}>0:15</Text>
            </View>
          </View>
          
          <View style={styles.tripDetailsContainer}>
            <View style={styles.fareContainer}>
              <Text style={styles.fareLabel}>Estimated Fare</Text>
              <Text style={styles.fareAmount}>${tripDetails.fare.toFixed(2)}</Text>
              {tripDetails.shared && (
                <View style={styles.sharedBadge}>
                  <Text style={styles.sharedText}>Shared</Text>
                </View>
              )}
            </View>
            
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={[styles.routeMarker, styles.pickupMarker]} />
                <Text style={styles.routeText}>Pickup ({tripDetails.pickup} mi)</Text>
              </View>
              
              <View style={styles.routeLine} />
              
              <View style={styles.routePoint}>
                <View style={[styles.routeMarker, styles.destinationMarker]} />
                <Text style={styles.routeText}>Destination ({tripDetails.destination} mi)</Text>
              </View>
            </View>
            
            <View style={styles.passengerContainer}>
              <View style={styles.passengerAvatar}>
                <Text style={styles.passengerInitials}>
                  {tripDetails.passenger.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{tripDetails.passenger}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>⭐ {tripDetails.rating}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {showOverlay && (
        <View style={styles.overlayContainer}>
          {recommendation === 'accept' && (
            <View style={[styles.overlayIndicator, { backgroundColor: colors.primary }]}>
              <View style={styles.crosshair}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
            </View>
          )}
          
          {recommendation === 'consider' && (
            <View style={[styles.overlayIndicator, { backgroundColor: colors.warning }]}>
              <Text style={styles.overlaySymbol}>!</Text>
            </View>
          )}
          
          {recommendation === 'reject' && (
            <View style={[styles.overlayIndicator, { backgroundColor: colors.secondary }]}>
              <Text style={styles.overlaySymbol}>×</Text>
            </View>
          )}
          
          <View style={[
            styles.pricePerMileContainer, 
            { 
              backgroundColor: recommendation === 'accept' 
                ? colors.primary 
                : recommendation === 'consider' 
                  ? colors.warning 
                  : colors.secondary 
            }
          ]}>
            <Text style={styles.pricePerMileLabel}>$/mi</Text>
            <Text style={styles.pricePerMileValue}>
              ${(tripDetails.fare / tripDetails.destination).toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  tripRequestContainer: {
    width: width * 0.9,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tripRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tripRequestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tripTimer: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tripTimerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tripDetailsContainer: {
    padding: 16,
  },
  fareContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  fareLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  fareAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sharedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.warning,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  sharedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  routeContainer: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pickupMarker: {
    backgroundColor: colors.primary,
  },
  destinationMarker: {
    backgroundColor: colors.secondary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passengerInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: colors.surfaceLight,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  overlayIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshair: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: '#FFFFFF',
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  overlaySymbol: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pricePerMileContainer: {
    position: 'absolute',
    top: '30%',
    right: '10%',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pricePerMileLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  pricePerMileValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  explanationCard: {
    width: width * 0.9,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  explanationButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  explanationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});