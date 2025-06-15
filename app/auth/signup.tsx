import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, validateName } from '@/utils/validation';

export default function SignupScreen() {
  const router = useRouter();
  const { 
    signup, 
    isAuthenticated, 
    isLoading, 
    error, 
    clearError, 
    initialize, 
    isInitialized,
    user
  } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Initialize auth store when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Initializing auth from signup screen...');
      initialize();
    }
  }, [isInitialized, initialize]);
  
  useEffect(() => {
    if (isAuthenticated && user && isInitialized) {
      console.log('✅ User authenticated in signup screen, showing welcome');
      // Show welcome message before redirecting
      Alert.alert(
        "Account Created Successfully!",
        `Welcome to Rideshare Sniper, ${user.name}! Your account has been created and you are now logged in.`,
        [
          { 
            text: "Continue", 
            onPress: () => {
              console.log('🔄 Redirecting to tabs from signup');
              router.replace('/(tabs)');
            }
          }
        ]
      );
    }
  }, [isAuthenticated, user, isInitialized, router]);
  
  const validateForm = () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    let confirmPasswordError = '';
    
    if (password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match";
    }
    
    setValidationErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || '',
      confirmPassword: confirmPasswordError
    });
    
    return !nameError && !emailError && !passwordError && !confirmPasswordError;
  };
  
  const handleSignup = async () => {
    console.log('🔄 Signup attempt for:', email);
    clearError();
    
    // Client-side validation first
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    try {
      await signup(email.trim(), password, name.trim());
      console.log('✅ Signup successful');
    } catch (error) {
      console.error('❌ Signup error in component:', error);
    }
  };
  
  const navigateToLogin = () => {
    console.log('🔄 Navigating to login');
    router.push('/auth/login');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Show loading while initializing
  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>RIDESHARE SNIPER</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>
        
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>
          {validationErrors.name ? (
            <Text style={styles.fieldError}>{validationErrors.name}</Text>
          ) : null}
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>
          {validationErrors.email ? (
            <Text style={styles.fieldError}>{validationErrors.email}</Text>
          ) : null}
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <Pressable style={styles.passwordToggle} onPress={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          {validationErrors.password ? (
            <Text style={styles.fieldError}>{validationErrors.password}</Text>
          ) : null}
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <Pressable style={styles.passwordToggle} onPress={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          {validationErrors.confirmPassword ? (
            <Text style={styles.fieldError}>{validationErrors.confirmPassword}</Text>
          ) : null}
          
          <Pressable 
            style={[
              styles.signupButton, 
              (isLoading || !name || !email || !password || !confirmPassword) && styles.signupButtonDisabled
            ]} 
            onPress={handleSignup}
            disabled={isLoading || !name || !email || !password || !confirmPassword}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <>
                <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
                <ArrowRight size={20} color={colors.textPrimary} />
              </>
            )}
          </Pressable>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={navigateToLogin} disabled={isLoading}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  formContainer: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.2)',
  },
  errorText: {
    color: colors.secondary,
    fontSize: 14,
  },
  fieldError: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  passwordToggle: {
    padding: 12,
  },
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  loginText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});