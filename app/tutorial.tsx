import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { DollarSign, MapPin, ChevronRight, ChevronLeft, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import Slider from '@/components/Slider';
import OverlayDemo from '@/components/OverlayDemo';

const { width } = Dimensions.get('window');

export default function TutorialScreen() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [minFare, setMinFare] = useState(10);
  const [maxPickupDistance, setMaxPickupDistance] = useState(5);
  const [showDemo, setShowDemo] = useState(false);
  const [demoType, setDemoType] = useState<'accept' | 'reject' | 'consider'>('accept');
  
  // Debug log to check current step
  useEffect(() => {
    console.log("Current tutorial step:", currentStep);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      router.back();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const handleShowDemo = (type: 'accept' | 'reject' | 'consider') => {
    setDemoType(type);
    setShowDemo(true);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.logo}>
              <View style={styles.crosshair}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
            </View>
            
            <Text style={styles.title}>RIDESHARE SNIPER</Text>
            <Text style={styles.subtitle}>Overlay Widget Tutorial</Text>
            
            <Text style={styles.description}>
              Learn how overlay widgets work with real Uber interface simulation.
            </Text>
            
            <View style={styles.demoContainer}>
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.primary }]}
                onPress={() => handleShowDemo('accept')}
              >
                <View style={styles.miniCrosshair}>
                  <View style={styles.miniCrosshairH} />
                  <View style={styles.miniCrosshairV} />
                </View>
                <Text style={styles.demoButtonText}>Accept</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.warning }]}
                onPress={() => handleShowDemo('consider')}
              >
                <Text style={styles.demoIcon}>!</Text>
                <Text style={styles.demoButtonText}>Consider</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.secondary }]}
                onPress={() => handleShowDemo('reject')}
              >
                <Text style={styles.demoIcon}>×</Text>
                <Text style={styles.demoButtonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContainer}>
            <DollarSign size={40} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Understanding Minimum Fare</Text>
            <Text style={styles.stepDescription}>
              This is how you set your minimum acceptable fare amount. Trips below this threshold will show a red X indicator.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>${minFare}</Text>
              <Slider
                value={minFare}
                minimumValue={5}
                maximumValue={25}
                step={1}
                onValueChange={setMinFare}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>$5</Text>
                <Text style={styles.sliderLabel}>$25</Text>
              </View>
            </View>
            
            <Text style={styles.tipText}>
              💡 Tip: Set this based on your hourly earnings goal and local market rates.
            </Text>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <MapPin size={40} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Understanding Pickup Distance</Text>
            <Text style={styles.stepDescription}>
              This controls your maximum pickup distance. Longer pickups reduce your hourly earnings.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{maxPickupDistance} miles</Text>
              <Slider
                value={maxPickupDistance}
                minimumValue={1}
                maximumValue={10}
                step={1}
                onValueChange={setMaxPickupDistance}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1 mi</Text>
                <Text style={styles.sliderLabel}>10 mi</Text>
              </View>
            </View>
            
            <Text style={styles.tipText}>
              💡 Tip: Consider traffic patterns and surge zones when setting this limit.
            </Text>
          </View>
        );
      
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.errorText}>
              Error: Invalid tutorial step. Please restart the tutorial.
            </Text>
            <Pressable style={styles.resetButton} onPress={() => setCurrentStep(0)}>
              <Text style={styles.resetButtonText}>Restart Tutorial</Text>
            </Pressable>
          </View>
        );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Tutorial',
          headerShown: false
        }} 
      />
      
      {showDemo ? (
        <OverlayDemo 
          visible={showDemo}
          recommendation={demoType} 
          onClose={() => setShowDemo(false)} 
        />
      ) : (
        <>
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={() => router.back()}>
              <X size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>Tutorial</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>{currentStep + 1}/3</Text>
            </View>
          </View>
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {renderStep()}
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={20} color={colors.textSecondary} />
              <Text style={styles.backButtonText}>
                {currentStep === 0 ? 'Close' : 'Back'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep < 2 ? 'Next' : 'Finish'}
              </Text>
              <ChevronRight size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  stepIndicator: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  stepContainer: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  crosshair: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 50,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  demoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  demoButton: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  miniCrosshair: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniCrosshairH: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairV: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#FFFFFF',
  },
  demoIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  stepIcon: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sliderValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 6,
  },
  errorText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});