import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, DollarSign, MapPin, Navigation, Shield, Bell, Battery, Eye, Crosshair, Settings, Activity, Home } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function HelpScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WELCOME TO RIDESHARE SNIPER</Text>
          <Text style={styles.description}>
            Rideshare Sniper helps you make quick decisions about trip requests while driving.
            This guide will help you understand how to use all features of the app effectively.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GETTING STARTED</Text>
          
          <View style={styles.helpItem}>
            <Text style={styles.helpItemTitle}>1. Enable Sniper Permission</Text>
            <Text style={styles.helpItemDescription}>
              Go to Settings and toggle on "Sniper Permission" to allow the app to function properly.
              This is required for the overlay to appear on your screen.
            </Text>
          </View>
          
          <View style={styles.helpItem}>
            <Text style={styles.helpItemTitle}>2. Set Up Your Driver Profile</Text>
            <Text style={styles.helpItemDescription}>
              Create a driver profile with your preferences for minimum fare, maximum pickup distance, and other criteria.
              These settings determine which trips are considered profitable.
            </Text>
          </View>
          
          <View style={styles.helpItem}>
            <Text style={styles.helpItemTitle}>3. Start Sniper</Text>
            <Text style={styles.helpItemDescription}>
              Press the "START SNIPER" button on the home screen to activate the overlay.
              The app will attempt to launch your rideshare app automatically.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UNDERSTANDING THE OVERLAY</Text>
          
          <View style={styles.helpItem}>
            <View style={styles.overlayExample}>
              <View style={styles.crosshairIcon}>
                <View style={styles.crosshairHorizontal} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairCenter} />
              </View>
              <Text style={styles.overlayExampleTitle}>Green Crosshair</Text>
              <Text style={styles.overlayExampleDescription}>
                Indicates a profitable trip that meets all your criteria. Position this directly over the "Accept" button.
              </Text>
            </View>
            
            <View style={styles.overlayExample}>
              <View style={[styles.demoIcon, styles.yellowIcon]}>
                <Text style={styles.demoIconText}>!</Text>
              </View>
              <Text style={styles.overlayExampleTitle}>Yellow Warning</Text>
              <Text style={styles.overlayExampleDescription}>
                Indicates a borderline trip that barely meets your criteria. Position this above the trip details for closer inspection.
              </Text>
            </View>
            
            <View style={styles.overlayExample}>
              <View style={[styles.demoIcon, styles.redIcon]}>
                <Text style={styles.demoIconText}>X</Text>
              </View>
              <Text style={styles.overlayExampleTitle}>Red X</Text>
              <Text style={styles.overlayExampleDescription}>
                Indicates an unprofitable trip that doesn't meet your criteria. Position this near the close button.
              </Text>
            </View>
          </View>
          
          <View style={styles.helpItem}>
            <Text style={styles.helpItemTitle}>Tactical Panel</Text>
            <Text style={styles.helpItemDescription}>
              The tactical panel shows key information about the trip, including fare amount, pickup distance, and dropoff distance.
              Position it where it won't block important information in your rideshare app.
            </Text>
          </View>
          
          <View style={styles.helpItem}>
            <Text style={styles.helpItemTitle}>Auto-Dimming</Text>
            <Text style={styles.helpItemDescription}>
              For safety, the overlay automatically dims after 5 seconds. Tap anywhere on the screen to restore full visibility.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NAVIGATING THE APP</Text>
          
          <View style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Home size={24} color={colors.primary} />
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navItemTitle}>Home</Text>
              <Text style={styles.navItemDescription}>
                View your active profile, toggle online/offline status, and start the sniper overlay.
              </Text>
            </View>
          </View>
          
          <View style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Crosshair size={24} color={colors.primary} />
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navItemTitle}>Simulator</Text>
              <Text style={styles.navItemDescription}>
                Practice with simulated trip requests to understand how the app evaluates profitability.
              </Text>
            </View>
          </View>
          
          <View style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Activity size={24} color={colors.primary} />
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navItemTitle}>Stats</Text>
              <Text style={styles.navItemDescription}>
                View your driving statistics, including total trips, acceptance rate, and earnings.
              </Text>
            </View>
          </View>
          
          <View style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Settings size={24} color={colors.primary} />
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navItemTitle}>Settings</Text>
              <Text style={styles.navItemDescription}>
                Configure app preferences, manage driver profiles, and adjust display options.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRIP FILTERS EXPLAINED</Text>
          
          <View style={styles.filterItem}>
            <View style={styles.filterIconContainer}>
              <DollarSign size={24} color={colors.textPrimary} />
            </View>
            <View style={styles.filterTextContainer}>
              <Text style={styles.filterItemTitle}>Minimum Fare</Text>
              <Text style={styles.filterItemDescription}>
                The minimum amount you're willing to accept for a trip. Trips below this amount will be marked with a red X.
              </Text>
            </View>
          </View>
          
          <View style={styles.filterItem}>
            <View style={styles.filterIconContainer}>
              <MapPin size={24} color={colors.textPrimary} />
            </View>
            <View style={styles.filterTextContainer}>
              <Text style={styles.filterItemTitle}>Maximum Pickup Distance</Text>
              <Text style={styles.filterItemDescription}>
                The maximum distance you're willing to travel to pick up a passenger. Longer pickup distances reduce your hourly earnings.
              </Text>
            </View>
          </View>
          
          <View style={styles.filterItem}>
            <View style={styles.filterIconContainer}>
              <Navigation size={24} color={colors.textPrimary} />
            </View>
            <View style={styles.filterTextContainer}>
              <Text style={styles.filterItemTitle}>Maximum Driving Distance</Text>
              <Text style={styles.filterItemDescription}>
                The maximum trip length you're willing to accept. Set this based on your preferred driving range.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISPLAY OPTIONS</Text>
          
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Eye size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionItemTitle}>Minimal Mode</Text>
              <Text style={styles.optionItemDescription}>
                Shows only a colored dot indicator instead of the full overlay panel. Useful for experienced drivers who need minimal distraction.
              </Text>
            </View>
          </View>
          
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Bell size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionItemTitle}>Sound Notifications</Text>
              <Text style={styles.optionItemDescription}>
                Plays sound alerts when trip requests arrive. Different sounds indicate profitable vs. unprofitable trips.
              </Text>
            </View>
          </View>
          
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Battery size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionItemTitle}>Battery Optimization</Text>
              <Text style={styles.optionItemDescription}>
                Reduces power usage while running in the background. Recommended for long driving sessions.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAFETY FEATURES</Text>
          
          <View style={styles.safetyItem}>
            <View style={styles.safetyIconContainer}>
              <Eye size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.safetyTextContainer}>
              <Text style={styles.safetyItemTitle}>Auto-Hide Overlay</Text>
              <Text style={styles.safetyItemDescription}>
                Automatically hides the overlay after 5 seconds for safety while driving. Tap anywhere to restore visibility.
              </Text>
            </View>
          </View>
          
          <View style={styles.safetyItem}>
            <View style={styles.safetyIconContainer}>
              <Shield size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.safetyTextContainer}>
              <Text style={styles.safetyItemTitle}>Emergency Disable</Text>
              <Text style={styles.safetyItemDescription}>
                Quickly disables all overlays if needed. Use this if you need to immediately clear your screen.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEED MORE HELP?</Text>
          
          <Pressable 
            style={styles.tutorialButton}
            onPress={() => router.push('/tutorial')}
          >
            <Text style={styles.tutorialButtonText}>GO TO INTERACTIVE TUTORIAL</Text>
          </Pressable>
          
          <Text style={styles.contactInfo}>
            For additional support, contact us at support@ridesharesniper.com
          </Text>
        </View>
      </ScrollView>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  helpItem: {
    marginBottom: 20,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  helpItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  overlayExample: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  crosshairIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginRight: 12,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: colors.textPrimary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: colors.textPrimary,
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textPrimary,
  },
  demoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demoIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  yellowIcon: {
    backgroundColor: colors.warning,
  },
  redIcon: {
    backgroundColor: colors.secondary,
  },
  overlayExampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  overlayExampleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    marginRight: 12,
  },
  navTextContainer: {
    flex: 1,
  },
  navItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  navItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  filterItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTextContainer: {
    flex: 1,
  },
  filterItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  filterItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  optionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optionItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  safetyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  safetyIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    marginRight: 12,
  },
  safetyTextContainer: {
    flex: 1,
  },
  safetyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  safetyItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tutorialButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorialButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});