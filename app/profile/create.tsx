import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Save, X, ChevronLeft, DollarSign, MapPin, Navigation } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useProfileStore } from '@/store/profileStore';
import * as Haptics from 'expo-haptics';

export default function CreateProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addProfile } = useProfileStore();
  
  const [name, setName] = useState('');
  const [minFare, setMinFare] = useState('10');
  const [maxPickupDistance, setMaxPickupDistance] = useState('5');
  const [maxDrivingDistance, setMaxDrivingDistance] = useState('15');
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleSave = () => {
    if (!name || isNavigating) return;
    setIsNavigating(true);
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    addProfile({
      name,
      minFare: parseFloat(minFare) || 10,
      maxPickupDistance: parseFloat(maxPickupDistance) || 5,
      maxDrivingDistance: parseFloat(maxDrivingDistance) || 15,
      isActive: false,
    });
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      try {
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        router.replace('/');
      }
    }
  };
  
  const handleCancel = () => {
    if (isNavigating) return;
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      try {
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        router.replace('/');
      }
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleCancel}>
          <X size={24} color={colors.textPrimary} />
        </Pressable>
        
        <Text style={styles.headerTitle}>Create Filter Profile</Text>
        
        <Pressable style={styles.headerButton} onPress={handleSave}>
          <Save size={24} color={colors.primary} />
        </Pressable>
      </View>
      
      {/* Back button - only show if we can go back */}
      {navigation.canGoBack() && (
        <Pressable 
          style={styles.backButton} 
          onPress={handleCancel}
        >
          <ChevronLeft size={20} color={colors.textSecondary} />
        </Pressable>
      )}
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter profile name"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>FILTERS</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <DollarSign size={20} color={colors.primary} />
            <Text style={styles.label}>Minimum Fare ($)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={minFare}
            onChangeText={setMinFare}
            placeholder="10"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Minimum acceptable fare for a trip
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.label}>Maximum Pickup Distance (miles)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={maxPickupDistance}
            onChangeText={setMaxPickupDistance}
            placeholder="5"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Maximum distance you're willing to travel for pickup
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <Navigation size={20} color={colors.primary} />
            <Text style={styles.label}>Maximum Driving Distance (miles)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={maxDrivingDistance}
            onChangeText={setMaxDrivingDistance}
            placeholder="15"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Maximum distance you're willing to drive for the trip itself
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Filter Profile</Text>
        </Pressable>
        
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    opacity: 0.7,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cancelButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});