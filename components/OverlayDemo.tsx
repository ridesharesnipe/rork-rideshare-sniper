import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
  Animated,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { X, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

const { width, height } = Dimensions.get('window');

interface OverlayDemoProps {
  visible: boolean;
  onClose: () => void;
  recommendation?: 'accept' | 'reject' | 'consider';
}

interface Position {
  x: number;
  y: number;
}

const OverlayDemo: React.FC<OverlayDemoProps> = ({ visible, onClose, recommendation = 'accept' }) => {
  // Get rating filter settings
  const { ratingFilterEnabled, minRating } = useSettingsStore();
  
  // Initial positions calculated based on screen size
  const initialRejectPosition = { x: width * 0.85, y: height * 0.25 };
  const initialAcceptPosition = { x: width * 0.1, y: height * 0.75 };
  
  const [rejectPosition, setRejectPosition] = useState<Position>(initialRejectPosition);
  const [acceptPosition, setAcceptPosition] = useState<Position>(initialAcceptPosition);
  const acceptPan = useRef(new Animated.ValueXY()).current;
  const rejectPan = useRef(new Animated.ValueXY()).current;
  const currentAcceptPosition = useRef<Position>(initialAcceptPosition);
  const currentRejectPosition = useRef<Position>(initialRejectPosition);
  
  // Constrain position to stay within screen bounds
  const constrainPosition = (x: number, y: number, elementWidth: number, elementHeight: number) => {
    const maxX = width - elementWidth;
    const maxY = height - elementHeight;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  };
  
  const acceptPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        acceptPan.setOffset({
          x: currentAcceptPosition.current.x,
          y: currentAcceptPosition.current.y
        });
        acceptPan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: acceptPan.x, dy: acceptPan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        acceptPan.flattenOffset();
        const newX = currentAcceptPosition.current.x + gestureState.dx;
        const newY = currentAcceptPosition.current.y + gestureState.dy;
        
        // Constrain to screen bounds
        const constrained = constrainPosition(newX, newY, width * 0.7, 44);
        
        currentAcceptPosition.current = constrained;
        setAcceptPosition(constrained);
      }
    })
  ).current;

  const rejectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        rejectPan.setOffset({
          x: currentRejectPosition.current.x,
          y: currentRejectPosition.current.y
        });
        rejectPan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: rejectPan.x, dy: rejectPan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        rejectPan.flattenOffset();
        const newX = currentRejectPosition.current.x + gestureState.dx;
        const newY = currentRejectPosition.current.y + gestureState.dy;
        
        // Constrain to screen bounds
        const constrained = constrainPosition(newX, newY, 40, 40);
        
        currentRejectPosition.current = constrained;
        setRejectPosition(constrained);
      }
    })
  ).current;

  if (!visible) return null;

  const getTripData = () => {
    switch (recommendation) {
      case 'accept':
        return {
          fare: '$18.50',
          pricePerMile: '$3.42',
          rating: '5.00',
        };
      case 'consider':
        return {
          fare: '$7.25',
          pricePerMile: '$1.91',
          rating: '4.8',
        };
      case 'reject':
        return {
          fare: '$4.31',
          pricePerMile: '$1.35',
          rating: '5.00',
        };
      default:
        return {
          fare: '$4.31',
          pricePerMile: '$1.35',
          rating: '5.00',
        };
    }
  };

  // Check if rating filter would reject this trip
  const checkRatingFilter = (tripRating: string): boolean => {
    if (!ratingFilterEnabled) return true; // Filter disabled, always pass
    
    const numericRating = parseFloat(tripRating);
    return numericRating >= minRating;
  };

  const renderPricePerMileWidget = () => {
    const tripData = getTripData();
    const widgetColor = recommendation === 'accept' ? colors.primary : 
                       recommendation === 'consider' ? colors.warning : colors.secondary;
    
    return (
      <View style={[styles.pricePerMileWidget, { backgroundColor: widgetColor }]}>
        <Text style={styles.pricePerMileText}>{tripData.pricePerMile}/mi</Text>
      </View>
    );
  };

  const getOverlayContent = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    // If rating filter is enabled and trip doesn't pass, only show red X
    if (ratingFilterEnabled && !passesRatingFilter) {
      return (
        <Animated.View
          style={[styles.rejectOverlay, {
            transform: [{ translateX: rejectPan.x }, { translateY: rejectPan.y }]
          }]}
          {...rejectPanResponder.panHandlers}
        >
          <X size={20} color="#fff" />
        </Animated.View>
      );
    }
    
    return (
      <>
        {recommendation !== 'reject' && (
          <Animated.View
            style={[styles.acceptOverlay, {
              backgroundColor: recommendation === 'accept' ? colors.primary : colors.warning,
              borderColor: recommendation === 'accept' ? '#45a049' : '#ffb300',
              transform: [{ translateX: acceptPan.x }, { translateY: acceptPan.y }]
            }]}
            {...acceptPanResponder.panHandlers}
          >
            <View style={styles.crosshair}>
              <View style={styles.crosshairHorizontal} />
              <View style={styles.crosshairVertical} />
              <View style={styles.crosshairCenter} />
            </View>
            <Text style={styles.acceptText}>
              {recommendation === 'accept' ? 'GOOD TRIP' : 'MAYBE'}
            </Text>
          </Animated.View>
        )}
        <Animated.View
          style={[styles.rejectOverlay, {
            transform: [{ translateX: rejectPan.x }, { translateY: rejectPan.y }]
          }]}
          {...rejectPanResponder.panHandlers}
        >
          <X size={20} color="#fff" />
        </Animated.View>
      </>
    );
  };

  const getInstructionText = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    if (ratingFilterEnabled && !passesRatingFilter) {
      return `Rating filter active: Passenger rating ${tripData.rating} is below your minimum of ${minRating}. Trip automatically rejected.`;
    }
    
    switch (recommendation) {
      case 'accept':
        return "Green crosshair indicates a profitable trip worth accepting. Drag to position over Uber's accept button.";
      case 'consider':
        return "Yellow warning shows borderline trips that need consideration. Drag to position over Uber's accept button.";
      case 'reject':
        return "Drag the red X to position it correctly over Uber's reject button.";
      default:
        return "Drag the widgets to position them over Uber's interface.";
    }
  };

  const getExplanationContent = () => {
    const tripData = getTripData();
    const passesRatingFilter = checkRatingFilter(tripData.rating);
    
    if (ratingFilterEnabled && !passesRatingFilter) {
      return {
        title: "🔴 Rating Filter - Reject",
        description: `This trip has a passenger rating of ${tripData.rating} stars, which is below your minimum requirement of ${minRating} stars. The trip is automatically rejected.`
      };
    }
    
    switch (recommendation) {
      case 'accept':
        return {
          title: "Green Crosshair - Accept",
          description: "The green crosshair appears when a trip meets all your criteria for profitability. Position this over the accept button in the Uber app."
        };
      case 'consider':
        return {
          title: "Yellow Warning - Consider",
          description: "The yellow warning indicator shows when a trip is borderline. Review the trip details before deciding."
        };
      case 'reject':
        return {
          title: "Red X - Reject",
          description: "The red X appears when a trip does not meet your minimum standards for profitability. Position this over the reject button."
        };
      default:
        return {
          title: "Overlay Demo",
          description: "This is a demo of the overlay functionality. Drag the widgets to position them over Uber's interface."
        };
    }
  };

  const explanation = getExplanationContent();
  const tripData = getTripData();

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
      >
        <X size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Price per mile widget - always visible */}
      {renderPricePerMileWidget()}
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Simplified Uber Trip Card */}
        <View style={styles.tripCardContainer}>
          <View style={styles.tripCard}>
            <View style={styles.tripCardHeader}>
              <Text style={styles.fareText}>{tripData.fare}</Text>
              
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" style={styles.starIcon} />
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
              <Text style={styles.locationText}>
                13 mins (4.4 mi)
              </Text>
            </View>
            
            <Text style={styles.locationText2}>
              N Alafaya Trl
            </Text>
            
            {/* Accept Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              
              {/* Reject Button */}
              <TouchableOpacity style={styles.rejectButton}>
                <X size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Overlay Widgets */}
          {getOverlayContent()}
        </View>
        
        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Positioning Demo</Text>
          <Text style={styles.instructionsText}>
            {getInstructionText()}
          </Text>
        </View>
        
        {/* Explanation Section */}
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>{explanation.title}</Text>
          <Text style={styles.explanationText}>{explanation.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 10,
    zIndex: 1010,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  scrollView: {
    flex: 1,
    marginTop: 50, // Space for the close button
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  pricePerMileWidget: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 60,
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
  tripCardContainer: {
    width: '100%',
    maxWidth: 350,
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 70, // Space for buttons
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
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    marginTop: 4,
  },
  locationSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    marginRight: 8,
    marginTop: 4,
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
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#000',
    marginLeft: 4,
    marginVertical: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#2979ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
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
    right: 64, // Space for reject button
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
    fontSize: 14,
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
    borderWidth: 2,
    borderColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1001,
  },
  instructions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    maxWidth: 350,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default OverlayDemo;