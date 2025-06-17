import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
  Animated,
  ScrollView
} from 'react-native';
import { X, Star } from 'lucide-react-native';
import colors from '@/constants/colors';

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
  const [rejectPosition, setRejectPosition] = useState<Position>({ x: width - 60, y: height * 0.35 });
  const [acceptPosition, setAcceptPosition] = useState<Position>({ x: width * 0.075, y: height - 180 });
  const acceptPan = useRef(new Animated.ValueXY()).current;
  const rejectPan = useRef(new Animated.ValueXY()).current;
  const currentAcceptPosition = useRef<Position>({ x: width * 0.075, y: height - 180 });
  const currentRejectPosition = useRef<Position>({ x: width - 60, y: height * 0.35 });
  
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
        currentAcceptPosition.current = { x: newX, y: newY };
        setAcceptPosition({ x: newX, y: newY });
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
        currentRejectPosition.current = { x: newX, y: newY };
        setRejectPosition({ x: newX, y: newY });
      }
    })
  ).current;

  if (!visible) return null;

  const getOverlayContent = () => {
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
          <X size={24} color="#fff" />
        </Animated.View>
      </>
    );
  };

  const getInstructionText = () => {
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
    switch (recommendation) {
      case 'accept':
        return {
          title: "Green Crosshair - Accept",
          description: "The green crosshair appears when a trip meets all your criteria for profitability. This includes fare amount, pickup distance, and rider rating. Position this over the accept button in the Uber app to quickly take good trips.",
          imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=1000&auto=format&fit=crop'
        };
      case 'consider':
        return {
          title: "Yellow Warning - Consider",
          description: "The yellow warning indicator shows when a trip is borderline. It may meet most but not all of your criteria. Review the trip details before deciding. Position this over the accept button if you choose to take it.",
          imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000&auto=format&fit=crop'
        };
      case 'reject':
        return {
          title: "Red X - Reject",
          description: "The red X appears when a trip does not meet your minimum standards for profitability. This could be due to low fare, long pickup distance, or poor rider rating. Position this over the reject button in the Uber app to decline bad trips.",
          imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop'
        };
      default:
        return {
          title: "Overlay Demo",
          description: "This is a demo of the overlay functionality. Drag the widgets to position them over Uber's interface.",
          imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=1000&auto=format&fit=crop'
        };
    }
  };

  const explanation = getExplanationContent();

  return (
    <ScrollView style={styles.container}>
      {/* Map Background with Route */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: explanation.imageUrl }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Route Line Overlay */}
        <View style={styles.routeLine} />
        
        {/* Pickup Point (Blue) */}
        <View style={[styles.mapMarker, styles.pickupMarker]}>
          <View style={styles.markerInner}>
            <View style={styles.personIcon} />
          </View>
        </View>
        
        {/* Destination Point (Black) */}
        <View style={[styles.mapMarker, styles.destMarker]}>
          <View style={styles.markerInner}>
            <View style={styles.squareIcon} />
          </View>
        </View>
        
        {/* Navigation Arrow */}
        <View style={styles.navArrow}>
          <View style={styles.arrowCircle}>
            <View style={styles.arrowTriangle} />
          </View>
        </View>
      </View>
      
      {/* Trip Card - Exact match to screenshot */}
      <View style={styles.tripCard}>
        {/* Header with Share and X */}
        <View style={styles.cardHeader}>
          <View style={styles.shareButton}>
            <Text style={styles.shareIcon}>👤</Text>
            <Text style={styles.shareText}>Share</Text>
          </View>
          
          <Text style={styles.exclusiveText}>Exclusive</Text>
          
          <TouchableOpacity style={styles.closeButton}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        {/* Fare */}
        <Text style={styles.fareText}>$4.31</Text>
        
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" style={styles.starIcon} />
          <Text style={styles.ratingText}>5.00</Text>
        </View>
        
        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <Text style={styles.timeDistanceText}>9 mins (3.2 mi)</Text>
          
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>
              Bristol Forest Way & Waterford Chase Pkwy, Orlando
            </Text>
          </View>
          
          <View style={styles.routeLineCard} />
          
          <View style={styles.locationContainer}>
            <View style={styles.locationSquare} />
            <Text style={styles.locationText}>
              13 mins (4.4 mi)
            </Text>
          </View>
          
          <Text style={styles.locationText2}>
            N Alafaya Trl, Orlando
          </Text>
        </View>
        
        {/* Accept Button */}
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tactical Panel - Our overlay */}
      <View style={styles.tacticalPanel}>
        <Text style={styles.tacticalHeader}>TACTICAL PANEL</Text>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>FARE:</Text>
          <Text style={recommendation === 'accept' ? styles.tacticalValueGreen : recommendation === 'consider' ? styles.tacticalValueYellow : styles.tacticalValueRed}>$4.31</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>PICKUP:</Text>
          <Text style={styles.tacticalValueYellow}>3.2 mi</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>TRIP:</Text>
          <Text style={styles.tacticalValueGreen}>4.4 mi</Text>
        </View>
        <View style={styles.tacticalRow}>
          <Text style={styles.tacticalLabel}>RATING:</Text>
          <Text style={styles.tacticalValueGreen}>5.00</Text>
        </View>
        
        {/* Dynamic Overlay Content */}
        {getOverlayContent()}
      </View>
      
      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          {getInstructionText()}
        </Text>
      </View>
      
      {/* Explanation Section */}
      <View style={styles.explanationContainer}>
        <Text style={styles.explanationTitle}>{explanation.title}</Text>
        <Text style={styles.explanationText}>{explanation.description}</Text>
      </View>
      
      {/* Close button for the entire demo */}
      <TouchableOpacity 
        style={styles.demoCloseButton} 
        onPress={onClose}
      >
        <Text style={styles.demoCloseText}>Close Demo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    zIndex: 1000,
  },
  mapContainer: {
    width: '100%',
    height: '60%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
    backgroundColor: '#e1e6ea',
  },
  routeLine: {
    position: 'absolute',
    width: '70%',
    height: 6,
    backgroundColor: '#333',
    top: '50%',
    left: '15%',
    borderRadius: 3,
    transform: [{ rotate: '-5deg' }],
  },
  mapMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupMarker: {
    backgroundColor: '#2979ff',
    top: '40%',
    right: '30%',
  },
  destMarker: {
    backgroundColor: '#000',
    top: '30%',
    left: '20%',
  },
  markerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#2979ff',
    borderRadius: 6,
  },
  squareIcon: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
  },
  navArrow: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    transform: [{ rotate: '90deg' }],
  },
  tripCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  shareIcon: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  shareText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exclusiveText: {
    color: '#2979ff',
    fontSize: 16,
  },
  closeButton: {
    padding: 5,
  },
  fareText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starIcon: {
    marginRight: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripDetails: {
    marginBottom: 20,
  },
  timeDistanceText: {
    fontSize: 16,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginRight: 10,
    marginTop: 4,
  },
  locationSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    marginRight: 10,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
    flex: 1,
  },
  locationText2: {
    fontSize: 14,
    color: '#555',
    marginLeft: 20,
  },
  routeLineCard: {
    width: 2,
    height: 20,
    backgroundColor: '#000',
    marginLeft: 5,
    marginVertical: 2,
  },
  acceptButton: {
    backgroundColor: '#2979ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  acceptText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tacticalPanel: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 10,
    width: 150,
  },
  tacticalHeader: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  tacticalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  tacticalLabel: {
    color: 'white',
    fontSize: 12,
  },
  tacticalValueGreen: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tacticalValueYellow: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tacticalValueRed: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  acceptOverlay: {
    position: 'absolute',
    bottom: 100,
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
    zIndex: 1001,
  },
  crosshair: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 3,
    backgroundColor: 'white',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 3,
    height: 30,
    backgroundColor: 'white',
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  instructions: {
    position: 'absolute',
    bottom: 250,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  instructionsText: {
    color: 'white',
    textAlign: 'center',
  },
  explanationContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: -1,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
  demoCloseButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  demoCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectOverlay: {
    position: 'absolute',
    bottom: 100,
    right: 10,
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
    zIndex: 1001,
  },
});

export default OverlayDemo;