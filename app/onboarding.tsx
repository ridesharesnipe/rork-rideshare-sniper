import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { DollarSign, MapPin, ChevronRight, ChevronLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@/components/Slider';
import OverlayDemo from '@/components/OverlayDemo';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile } = useProfileStore();
  const { isAuthenticated } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [minFare, setMinFare] = useState(10);
  const [maxPickupDistance, setMaxPickupDistance] = useState(5);
  const [currentDemo, setCurrentDemo] = useState<'accept' | 'reject' | 'consider' | null>(null);
  
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = async () => {
    try {
      updateProfile('1', {
        minFare,
        maxPickupDistance,
        maxDrivingDistance: 15,
      });
      
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/auth/login');
    }
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
            <Text style={styles.subtitle}>Quick decision making for drivers</Text>
            
            <Text style={styles.description}>
              Get instant visual feedback on trip requests with simple overlay indicators.
            </Text>
            
            <View style={styles.demoContainer}>
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.primary }]}
                onPress={() => setCurrentDemo('accept')}
              >
                <View style={styles.miniCrosshair}>
                  <View style={styles.miniCrosshairH} />
                  <View style={styles.miniCrosshairV} />
                </View>
                <Text style={styles.demoButtonText}>Accept</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.warning }]}
                onPress={() => setCurrentDemo('consider')}
              >
                <Text style={styles.demoIcon}>!</Text>
                <Text style={styles.demoButtonText}>Consider</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.demoButton, { backgroundColor: colors.secondary }]}
                onPress={() => setCurrentDemo('reject')}
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
            <DollarSign size={48} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Minimum Fare</Text>
            <Text style={styles.stepDescription}>
              Set your minimum acceptable fare amount
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
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <MapPin size={48} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Maximum Pickup Distance</Text>
            <Text style={styles.stepDescription}>
              Set your maximum pickup distance
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
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {currentDemo ? (
        <OverlayDemo 
          recommendation={currentDemo} 
          onClose={() => setCurrentDemo(null)} 
        />
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {renderStep()}
          </ScrollView>
          
          <View style={styles.footer}>
            {currentStep > 0 && (
              <Pressable style={styles.backButton} onPress={handleBack}>
                <ChevronLeft size={20} color={colors.textSecondary} />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            )}
            
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep < 2 ? 'Next' : 'Get Started'}
              </Text>
              <ChevronRight size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepContainer: {
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  crosshair: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 3,
    height: 60,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
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
    padding: 16,
    alignItems: 'center',
  },
  miniCrosshair: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  miniCrosshairH: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  miniCrosshairV: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#FFFFFF',
  },
  demoIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepIcon: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textSecondary,
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
});