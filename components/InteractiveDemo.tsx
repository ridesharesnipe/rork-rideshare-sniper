import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import colors from '@/constants/colors';

type DemoState = 'green' | 'yellow' | 'red';

const InteractiveDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoState>('green');

  const getScreenshotUrl = () => {
    switch (activeDemo) {
      case 'green':
        return 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=1000&auto=format&fit=crop';
      case 'yellow':
        return 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000&auto=format&fit=crop';
      case 'red':
        return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=1000&auto=format&fit=crop';
    }
  };

  const getTripData = () => {
    switch (activeDemo) {
      case 'green':
        return {
          fare: '$18.50',
          pickup: '2.1 mi',
          pricePerMile: '$3.42',
          timeDistance: '9 mins (2.1 mi)',
          tripDistance: '13 mins (4.4 mi)'
        };
      case 'yellow':
        return {
          fare: '$7.25',
          pickup: '3.8 mi',
          pricePerMile: '$1.91',
          timeDistance: '9 mins (3.8 mi)',
          tripDistance: '13 mins (4.4 mi)'
        };
      case 'red':
        return {
          fare: '$4.31',
          pickup: '3.2 mi',
          pricePerMile: '$1.35',
          timeDistance: '9 mins (3.2 mi)',
          tripDistance: '13 mins (4.4 mi)'
        };
      default:
        return {
          fare: '$4.31',
          pickup: '3.2 mi',
          pricePerMile: '$1.35',
          timeDistance: '9 mins (3.2 mi)',
          tripDistance: '13 mins (4.4 mi)'
        };
    }
  };

  const getExplanation = () => {
    switch (activeDemo) {
      case 'green':
        return {
          title: '✅ GREEN OVERLAY - ACCEPT THIS TRIP',
          text: '• Fare: $18.50 (above $5 minimum ✓)\n• Pickup: 2.1 miles (under 5 mile limit ✓)\n• Price per mile: $3.42 (excellent rate ✓)\n• Decision: All criteria met - GOOD TRIP!\n• Driver action: Tap green overlay to accept',
        };
      case 'yellow':
        return {
          title: '🟡 YELLOW OVERLAY - CONSIDER THIS TRIP',
          text: '• Fare: $7.25 (close to minimum)\n• Pickup: 3.8 miles (reasonable distance)\n• Price per mile: $1.91 (borderline rate)\n• Decision: Partially meets criteria - YOUR CHOICE\n• Driver action: Quick decision based on situation',
        };
      case 'red':
        return {
          title: '🔴 RED OVERLAY - SKIP THIS TRIP',
          text: '• Fare: $4.31 (below $5 minimum ✗)\n• Pickup: 3.2 miles (fare too low for distance)\n• Price per mile: $1.35 (poor rate ✗)\n• Decision: Does not meet criteria - DECLINE\n• Driver action: Tap red X or let timer expire\n• Safety: Red X prevents accidental accepts',
        };
      default:
        return { title: '', text: '' };
    }
  };

  const renderPricePerMileWidget = () => {
    const tripData = getTripData();
    const widgetColor = activeDemo === 'green' ? colors.primary : 
                       activeDemo === 'yellow' ? colors.warning : colors.secondary;
    
    return (
      <View style={[styles.pricePerMileWidget, { backgroundColor: widgetColor }]}>
        <Text style={styles.pricePerMileText}>{tripData.pricePerMile}/mi</Text>
      </View>
    );
  };

  const renderAcceptOverlay = () => {
    if (activeDemo === 'red') return null;

    const backgroundColor = activeDemo === 'green' ? colors.primary : colors.warning;
    const borderColor = activeDemo === 'green' ? '#45a049' : '#ffb300';
    const text = activeDemo === 'green' ? 'GOOD TRIP' : 'MAYBE';

    return (
      <View style={[styles.acceptOverlay, { backgroundColor, borderColor }]}>
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
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'green' && styles.activeButton, { backgroundColor: colors.primary }]}
          onPress={() => setActiveDemo('green')}
        >
          <Text style={styles.demoButtonText}>GREEN TRIP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'yellow' && styles.activeButton, { backgroundColor: colors.warning }]}
          onPress={() => setActiveDemo('yellow')}
        >
          <Text style={styles.demoButtonText}>YELLOW TRIP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, activeDemo === 'red' && styles.activeButton, { backgroundColor: colors.secondary }]}
          onPress={() => setActiveDemo('red')}
        >
          <Text style={styles.demoButtonText}>RED TRIP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.screenshotContainer}>
        <Image
          source={{ uri: getScreenshotUrl() }}
          style={styles.screenshot}
          resizeMode="cover"
        />
        
        {/* Price per mile widget - top left */}
        {renderPricePerMileWidget()}
        
        {/* Accept overlay - only for green and yellow */}
        {renderAcceptOverlay()}
        
        {/* Reject overlay - always visible */}
        <View style={styles.rejectOverlay}>
          <X size={24} color="#fff" />
        </View>
        
        {/* Simulated Uber trip card */}
        <View style={styles.tripCard}>
          <Text style={styles.fareText}>{tripData.fare}</Text>
          <Text style={styles.timeDistanceText}>{tripData.timeDistance}</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>
              Bristol Forest Way & Waterford Chase Pkwy, Orlando
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.locationContainer}>
            <View style={styles.locationSquare} />
            <Text style={styles.locationText}>{tripData.tripDistance}</Text>
          </View>
          <Text style={styles.locationText2}>N Alafaya Trl, Orlando</Text>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
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
    fontSize: 14,
  },
  screenshotContainer: {
    position: 'relative',
    height: 500,
    marginBottom: 16,
    backgroundColor: colors.surfaceLight,
  },
  screenshot: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
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
  },
  pricePerMileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptOverlay: {
    position: 'absolute',
    bottom: 80,
    left: '7.5%',
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
  acceptText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectOverlay: {
    position: 'absolute',
    top: 270,
    right: 15,
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
  tripCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  fareText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
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
  routeLine: {
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
    marginTop: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default InteractiveDemo;