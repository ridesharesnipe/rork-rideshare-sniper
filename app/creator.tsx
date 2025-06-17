import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Heart, AlertTriangle } from 'lucide-react-native';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function CreatorScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  
  // Animation values
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Animated.Text style={[styles.title, { opacity: fadeAnim1 }]}>
              Why I Built Rideshare Sniper
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, { opacity: fadeAnim1 }]}>
              Built by a rideshare driver for rideshare drivers
            </Animated.Text>
          </View>

          <Animated.View style={[styles.messageCard, { opacity: fadeAnim2 }]}>
            <Text style={styles.messageText}>
              "After 13 years hauling heavy equipment across the U.S., I know what distracted driving can cost.
            </Text>
            <Text style={[styles.messageText, styles.messageParagraph]}>
              When I became a rideshare driver, I saw the same danger — nonstop trip requests while you're already driving passengers.
            </Text>
            <Text style={[styles.messageText, styles.messageParagraph]}>
              One story stuck with me: a driver and passenger killed while she was trying to check a trip alert.
            </Text>
            <Text style={[styles.messageText, styles.messageParagraph]}>
              That's why I built Rideshare Sniper — to give drivers a faster, safer way to stay in control.
            </Text>
            <View style={styles.iconContainer}>
              <Heart color={colors.primary} size={24} />
            </View>
          </Animated.View>

          <Animated.View style={[styles.messageCard, { opacity: fadeAnim3 }]}>
            <View style={styles.iconContainer}>
              <Shield color={colors.primary} size={24} />
            </View>
            <Text style={styles.messageText}>
              With Sniper, you set your minimum fare and distance filters once. When a trip pops up, you instantly see:
            </Text>
            <View style={styles.highlightContainer}>
              <View style={[styles.highlight, styles.greenHighlight]}>
                <Text style={styles.highlightText}>Green = Good Trip. Tap. Go.</Text>
              </View>
              <View style={[styles.highlight, styles.redHighlight]}>
                <Text style={styles.highlightText}>Red = Skip It. No second guessing.</Text>
              </View>
            </View>
            <Text style={[styles.messageText, styles.messageParagraph]}>
              You no longer need to look over tiny details, do mental math, or rush decisions.
            </Text>
            <Text style={[styles.messageText, styles.messageParagraph, styles.finalMessage]}>
              Just clean, fast, profitable driving — and less risk for you and your passengers.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { 
            opacity: buttonAnim,
            transform: [{ 
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) 
            }]
          }]}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue to Tutorial</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  messageParagraph: {
    marginTop: 16,
  },
  finalMessage: {
    fontWeight: '600',
  },
  iconContainer: {
    alignSelf: 'center',
    marginTop: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  highlightContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  highlight: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  greenHighlight: {
    backgroundColor: 'rgba(75, 181, 67, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: 'rgb(75, 181, 67)',
  },
  redHighlight: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: 'rgb(239, 68, 68)',
  },
  highlightText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});