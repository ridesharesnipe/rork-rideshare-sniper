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

  const getFareText = () => {
    switch (activeDemo) {
      case 'green':
        return '$18.50';
      case 'yellow':
        return '$7.25';
      case 'red':
        return '$4.31';
      default:
        return '$4.31';
    }
  };

  const getPickupText = () => {
    switch (activeDemo) {
      case 'green':
        return '2.1 mi';
      case 'yellow':
        return '3.8 mi';
      case 'red':
        return '3.2 mi';
      default:
        return '3.2 mi';
    }
  };

  const getExplanation = () => {
    switch (activeDemo) {
      case 'green':
        return {
          title: '✅ GREEN OVERLAY - ACCEPT THIS TRIP',
          text: '• Fare: $18.50 (above $5 minimum ✓)\n• Pickup: 2.1 miles (under 5 mile limit ✓)\n• Decision: All criteria met - GOOD TRIP!\n• Driver action: Tap green overlay to accept',
        };
      case 'yellow':
        return {
          title: '🟡 YELLOW OVERLAY - CONSIDER THIS TRIP',
          text: '• Fare: $7.25 (close to minimum)\n• Pickup: 3.8 miles (reasonable distance)\n• Decision: Partially meets criteria - YOUR CHOICE\n• Driver action: Quick decision based on situation',
        };
      case 'red':
        return {
          title: '🔴 RED OVERLAY - SKIP THIS TRIP',
          text: '• Fare: $4.31 (below $5 minimum ✗)\n• Pickup: 3.2 miles (fare too low for distance)\n• Decision: Doesn\'t meet criteria - DECLINE\n• Driver action: Tap red X or let timer expire\n• Safety: Red X prevents accidental accepts',
        };
      default:
        return { title: '', text: '' };
    }
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
        {renderAcceptOverlay()}
        <View style={styles.rejectOverlay}>
          <X size={24} color="#fff" />
        </View>
        <View style={styles.tripCard}>
          <Text style={styles.fareText}>{getFareText()}</Text>
          <Text style={styles.timeDistanceText}>9 mins ({getPickupText()})</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>
              Bristol Forest Way & Waterford Chase Pkwy, Orlando
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.locationContainer}>
            <View style={styles.locationSquare} />
            <Text style={styles.locationText}>13 mins (4.4 mi)</Text>
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