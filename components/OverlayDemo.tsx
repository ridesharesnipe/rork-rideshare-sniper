import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
  Animated
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
  const [rejectPosition, setRejectPosition] = useState<Position>({ x: 0, y: 0 });
  const pan = useRef(new Animated.ValueXY()).current;
  const currentPosition = useRef<Position>({ x: 0, y: 0 });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store the current position as offset
        pan.setOffset({
          x: currentPosition.current.x,
          y: currentPosition.current.y
        });
        // Reset the value to avoid jumps
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        // Update the position state with gesture values
        const newX = currentPosition.current.x + gestureState.dx;
        const newY = currentPosition.current.y + gestureState.dy;
        currentPosition.current = { x: newX, y: newY };
        setRejectPosition({ x: newX, y: newY });
      }
    })
  ).current;

  if (!visible) return null;

  const getOverlayContent = () => {
    switch (recommendation) {
      case 'accept':
        return (
          <View style={styles.acceptOverlay}>
            <View style={styles.crosshair}>
              <View style={styles.crosshairHorizontal} />
              <View style={styles.crosshairVertical} />
              <View style={styles.crosshairCenter} />
            </View>
          </View>
        );
      case 'consider':
        return (
          <View style={styles.considerOverlay}>
            <Text style={styles.considerIcon}>!</Text>
          </View>
        );
      case 'reject':
        return (
          <Animated.View
            style={[styles.rejectOverlay, {
              transform: [{ translateX: pan.x }, { translateY: pan.y }]
            }]}
            {...panResponder.panHandlers}
          >
            <X size={24} color="#fff" />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const getInstructionText = () => {
    switch (recommendation) {
      case 'accept':
        return "Green crosshair indicates a profitable trip worth accepting";
      case 'consider':
        return "Yellow warning shows borderline trips that need consideration";
      case 'reject':
        return "Drag the red X to position it correctly over the Uber interface";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Background with Route */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=1000&auto=format&fit=crop' }}
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
          
          <View style={styles.routeLine2} />
          
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
          <Text style={styles.tacticalValueGreen}>$4.31</Text>
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
      
      {/* Close button for the entire demo */}
      <TouchableOpacity 
        style={styles.demoCloseButton} 
        onPress={onClose}
      >
        <Text style={styles.demoCloseText}>Close Demo</Text>
      </TouchableOpacity>
    </View>
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
  routeLine2: {
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
  acceptOverlay: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  crosshair: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 30,
    height: 3,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 3,
    height: 30,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  considerOverlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: colors.warning,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1001,
  },
  considerIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rejectOverlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1001,
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
});

export default OverlayDemo;