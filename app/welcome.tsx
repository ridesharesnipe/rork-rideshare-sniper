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
import { Shield, Target, Clock, DollarSign, Focus, Filter } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const { user } = useAuthStore();
  
  // Animation values
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;
  const fadeAnim6 = useRef(new Animated.Value(0)).current;
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
      Animated.timing(fadeAnim4, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim5, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim6, {
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
    if (user) {
      // If user is logged in, go to tabs
      router.replace('/(tabs)');
    } else {
      // If not logged in, go to creator page
      router.replace('/creator');
    }
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
            <View style={styles.logoContainer}>
              <View style={styles.crosshair}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
                <View style={styles.crosshairRing} />
              </View>
            </View>
            <Animated.Text style={[styles.title, { opacity: fadeAnim1 }]}>
              {user ? `Welcome back, ${user.name}!` : 'Welcome to Rideshare Sniper'}
            </Animated.Text>
          </View>

          <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim2 }]}>
            <Text style={styles.tagline}>
              No ads. No tracking. No distractions.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.messageCard, { opacity: fadeAnim3 }]}>
            <Text style={styles.messageText}>
              Just clarity, safety, and control in a world where rideshare apps overwhelm and pressure drivers into unsafe choices.
            </Text>
            <View style={styles.iconContainer}>
              <Shield color={colors.primary} size={24} />
            </View>
          </Animated.View>

          <Animated.View style={[styles.messageCard, { opacity: fadeAnim4 }]}>
            <View style={styles.iconContainer}>
              <Target color={colors.primary} size={24} />
            </View>
            <Text style={styles.messageText}>
              Sniper is your co-pilot for smarter, safer driving — filtering trips by your standards, not theirs.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.messageCard, { opacity: fadeAnim5 }]}>
            <Text style={styles.messageText}>
              When that perfect trip appears, Sniper reacts instantly — so even if you're tired or mid-ride, you'll have the edge over every other driver still fumbling with their screen.
            </Text>
            <View style={styles.iconContainer}>
              <Clock color={colors.primary} size={24} />
            </View>
          </Animated.View>

          <Animated.View style={[styles.protectContainer, { opacity: fadeAnim6 }]}>
            <Text style={styles.protectTitle}>Protect:</Text>
            <View style={styles.protectItemsContainer}>
              <View style={styles.protectItem}>
                <Clock color={colors.primary} size={20} />
                <Text style={styles.protectText}>your time</Text>
              </View>
              <View style={styles.protectItem}>
                <Focus color={colors.primary} size={20} />
                <Text style={styles.protectText}>your focus</Text>
              </View>
              <View style={styles.protectItem}>
                <DollarSign color={colors.primary} size={20} />
                <Text style={styles.protectText}>your earnings</Text>
              </View>
            </View>
            <Text style={styles.protectFinal}>
              And most importantly, protect yourself and your passengers.
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
              <Text style={styles.buttonText}>
                {user ? 'Continue to App' : 'Meet the Creator'}
              </Text>
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
  logoContainer: {
    marginBottom: 16,
  },
  crosshair: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 60,
    height: 1.5,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 1.5,
    height: 60,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  crosshairRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  taglineContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  iconContainer: {
    marginLeft: 16,
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
  protectContainer: {
    marginTop: 8,
    marginBottom: 32,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  protectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  protectItemsContainer: {
    marginBottom: 16,
  },
  protectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  protectText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  protectFinal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
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