import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
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
  }, [isAuthenticated, user, isInitialized]);
  
  const validateForm = () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setValidationErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || ''
    });
    
    return !nameError && !emailError && !passwordError;
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
        
        <Pressable 
          style={[
            styles.signupButton, 
            isLoading && styles.signupButtonDisabled
          ]} 
          onPress={handleSignup}
          disabled={isLoading || !name || !email || !password}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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