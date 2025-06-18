import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { X, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

const { width } = Dimensions.get('window');

type DemoState = 'green' | 'yellow' | 'red';

const InteractiveDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoState>('green');
  const { ratingFilterEnabled, minRating } = useSettingsStore();

  const getTripData = () => {
    switch (activeDemo) {
      case 'green':
        return {
          fare: '$18.50',
          pickup: '2.1 mi',
          pricePerMile: '$3.42',
          timeDistance: '9 mins (2.1 mi)',
          tripDistance: '13 mins (4.4 mi)',
          rating: '5.00'
        };
      case 'yellow':
        return {
          fare: '$7.25',
          pickup: '3.8 mi',
          pricePerMile: '$1.91',
          timeDistance: '9 mins (3.8 mi)',
          tripDistance: '13 mins (4.4 mi)',
          rating: '4.8'
        };
      case 'red':
        return {
          fare: '$4.31',
          pickup: '3.2 mi',
          pricePerMile: '$1.35',
          timeDistance: '9 mins (3.2 mi)',
          tripDistance: '13 mins (4.4 mi)',
          rating: '5.00'
        };
      default:
        return {
          fare: '$4.31',
          pickup: '3.2 mi',
          pricePerMile: '$1.35',
          timeDistance: '9 mins (3.2 mi)',
          tripDistance: '13 mins (4.4 mi)',
          rating: '5.00'
        };
    }
  };

  // Check if rating filter would reject this trip
  const checkRatingFilter = (tripRating: string): boolean => {
    if (!ratingFilterEnabled) return true; // Filter disabled, always pass
    
    const numericRating = parseFloat(tripRating);
    return numericRating >= minRating;
  };

  const getExplanation = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    // If rating filter is enabled and trip doesn't pass, show rating filter explanation
    if (ratingFilterEnabled && !passesRatingFilter) {
      return {
        title: '🔴 RATING FILTER - REJECT',
        text: `• Passenger Rating: ${tripData.rating} stars (below your minimum of ${minRating} ✗)
• Rating Filter: Enabled
• Decision: Rating too low - DECLINE`,
      };
    }
    
    switch (activeDemo) {
      case 'green':
        return {
          title: '✅ GREEN OVERLAY - ACCEPT THIS TRIP',
          text: `• Fare: $18.50 (above $5 minimum ✓)
• Pickup: 2.1 miles (under 5 mile limit ✓)
• Price per mile: $3.42 (excellent rate ✓)
• Decision: All criteria met - GOOD TRIP!`,
        };
      case 'yellow':
        return {
          title: '🟡 YELLOW OVERLAY - CONSIDER THIS TRIP',
          text: `• Fare: $7.25 (close to minimum)
• Pickup: 3.8 miles (reasonable distance)
• Price per mile: $1.91 (borderline rate)
• Decision: Partially meets criteria - YOUR CHOICE`,
        };
      case 'red':
        return {
          title: '🔴 RED OVERLAY - SKIP THIS TRIP',
          text: `• Fare: $4.31 (below $5 minimum ✗)
• Pickup: 3.2 miles (fare too low for distance)
• Price per mile: $1.35 (poor rate ✗)
• Decision: Does not meet criteria - DECLINE`,
        };
      default:
        return { title: '', text: '' };
    }
  };

  const renderPricePerMileWidget = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    // If rating filter is enabled and trip doesn't pass, force red color
    if (ratingFilterEnabled && !passesRatingFilter) {
      return (
        <View style={[styles.pricePerMileWidget, { backgroundColor: colors.secondary }]}>
          <Text style={styles.pricePerMileText}>{tripData.pricePerMile}/mi</Text>
        </View>
      );
    }
    
    const widgetColor = activeDemo === 'green' ? colors.primary : 
                       activeDemo === 'yellow' ? colors.warning : colors.secondary;
    
    return (
      <View style={[styles.pricePerMileWidget, { backgroundColor: widgetColor }]}>
        <Text style={styles.pricePerMileText}>{tripData.pricePerMile}/mi</Text>
      </View>
    );
  };

  const renderAcceptOverlay = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    // If rating filter is enabled and trip doesn't pass, don't show accept overlay
    if (activeDemo === 'red' || (ratingFilterEnabled && !passesRatingFilter)) {
      return null;
    }

    const backgroundColor = activeDemo === 'green' ? colors.primary : colors.warning;
    const text = activeDemo === 'green' ? 'GOOD TRIP' : 'MAYBE';

    return (
      <View style={[styles.acceptOverlay, { backgroundColor }]}>
        <View style={styles.crosshair}>
          <View style={styles.crosshairHorizontal} />
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairCenter} />
        </View>
        <Text style={styles.acceptText}>{text}</Text>
      </View>
    );
  };

  const explanation = getExplanation();
  const tripData = getTripData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'green' && styles.activeButton, { backgroundColor: colors.primary }]}
          onPress={() => setActiveDemo('green')}
        >
          <Text style={styles.demoButtonText}>GREEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'yellow' && styles.activeButton, { backgroundColor: colors.warning }]}
          onPress={() => setActiveDemo('yellow')}
        >
          <Text style={styles.demoButtonText}>YELLOW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'red' && styles.activeButton, { backgroundColor: colors.secondary }]}
          onPress={() => setActiveDemo('red')}
        >
          <Text style={styles.demoButtonText}>RED</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.simulatorContainer}>
        <Text style={styles.simulatorTitle}>Uber Interface Simulation</Text>
        
        <View style={styles.uberScreenshot}>
          {/* Price per mile widget - top left */}
          {renderPricePerMileWidget()}
          
          {/* Simulated Uber trip card */}
          <View style={styles.tripCard}>
            <View style={styles.tripCardHeader}>
              <Text style={styles.fareText}>{tripData.fare}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{tripData.rating}</Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText}>
                Bristol Forest Way
              </Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationContainer}>
              <View style={styles.locationSquare} />
              <Text style={styles.locationText}>{tripData.tripDistance}</Text>
            </View>
            <Text style={styles.locationText2}>N Alafaya Trl</Text>
            
            {/* Button container */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              
              {/* Reject button */}
              <TouchableOpacity style={styles.rejectButton}>
                <X size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Accept overlay - positioned over accept button */}
          {renderAcceptOverlay()}
          
          {/* Reject overlay - positioned over reject button */}
          {(activeDemo === 'red' || (ratingFilterEnabled && !checkRatingFilter(tripData.rating))) && (
            <View style={styles.rejectOverlay}>
              <X size={20} color="#fff" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.explanationContainer}>
        <Text style={styles.explanationTitle}>{explanation.title}</Text>
        <Text style={styles.explanationText}>{explanation.text}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  activeButton: {
    opacity: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  simulatorContainer: {
    padding: 12,
  },
  simulatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  uberScreenshot: {
    position: 'relative',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pricePerMileWidget: {
    position: 'absolute',
    top: 10,
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
  },
  pricePerMileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fareText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginRight: 8,
    marginTop: 3,
  },
  locationSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    marginRight: 8,
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    flexShrink: 1,
    flex: 1,
  },
  locationText2: {
    fontSize: 12,
    color: '#555',
    marginLeft: 16,
    marginBottom: 12,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#000',
    marginLeft: 4,
    marginVertical: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#2979ff',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  acceptOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 64,
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1001,
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
  acceptText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1001,
  },
  explanationContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    margin: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default InteractiveDemo;