import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { validateEmail } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError, user, initialize, isInitialized } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoginInProgress, setDemoLoginInProgress] = useState(false);
  
  // Initialize auth store when component mounts if needed
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Initializing auth from login screen...');
      initialize();
    }
  }, [isInitialized, initialize]);
  
  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && user && isInitialized) {
      console.log('✅ User authenticated in login screen, navigating to tabs');
      
      // Reset demo login state if it was in progress
      if (demoLoginInProgress) {
        setDemoLoginInProgress(false);
      }
      
      // Navigate directly to tabs without alert for demo login
      if (demoLoginInProgress || email === 'demo@example.com') {
        console.log('🔄 Demo login successful, redirecting to tabs');
        router.replace('/(tabs)');
        return;
      }
      
      // Show welcome back message for manual login
      Alert.alert(
        "Welcome Back!",
        `Good to see you again, ${user.name}!`,
        [
          { 
            text: "Continue", 
            onPress: () => {
              console.log('🔄 Redirecting to tabs from login');
              router.replace('/(tabs)');
            }
          }
        ]
      );
    }
  }, [isAuthenticated, user, isInitialized, router, demoLoginInProgress, email]);
  
  // Handle login with entered credentials
  const handleLogin = async () => {
    console.log('🔄 Login attempt for:', email);
    clearError();
    
    // Validate email format
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    
    try {
      await login(email.trim(), password);
      console.log('✅ Login successful');
    } catch (error) {
      console.error('❌ Login error:', error);
    }
  };
  
  const navigateToSignup = () => {
    console.log('🔄 Navigating to signup');
    router.push('/auth/signup');
  };
  
  const navigateToRecovery = () => {
    console.log('🔄 Navigating to recovery');
    router.push('/auth/recovery');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Demo credentials auto-login function
  const fillDemoCredentials = async () => {
    console.log('🔄 Starting demo credentials auto-login');
    
    // Set demo login in progress flag
    setDemoLoginInProgress(true);
    clearError();
    
    // Fill in the credentials
    const demoEmail = 'demo@example.com';
    const demoPassword = 'password123';
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      // Direct login with demo credentials
      console.log('🔄 Auto-login with demo credentials');
      await login(demoEmail, demoPassword);
      console.log('✅ Demo login successful');
      // Navigation is handled by the useEffect that watches isAuthenticated
    } catch (error) {
      console.error('❌ Demo login error:', error);
      setDemoLoginInProgress(false);
      Alert.alert("Login Error", "Failed to login with demo credentials. Please try again.");
    }
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
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>
      
      <View style={styles.formContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Demo credentials helper */}
        <Pressable 
          style={[styles.demoButton, demoLoginInProgress && styles.demoButtonActive]} 
          onPress={fillDemoCredentials}
          disabled={isLoading || demoLoginInProgress}
        >
          {demoLoginInProgress ? (
            <View style={styles.demoButtonContent}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.demoButtonText}>Logging in with demo account...</Text>
            </View>
          ) : (
            <Text style={styles.demoButtonText}>Use Demo Credentials (Auto-Login)</Text>
          )}
        </Pressable>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Mail size={20} color={colors.textSecondary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading && !demoLoginInProgress}
          />
        </View>
        {emailError ? (
          <Text style={styles.fieldError}>{emailError}</Text>
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
            editable={!isLoading && !demoLoginInProgress}
          />
          <Pressable style={styles.passwordToggle} onPress={togglePasswordVisibility}>
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>
        
        <Pressable 
          style={styles.forgotPasswordButton} 
          onPress={navigateToRecovery}
          disabled={isLoading || demoLoginInProgress}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password or Email?</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.loginButton, 
            (isLoading || demoLoginInProgress || !email || !password) && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          disabled={isLoading || demoLoginInProgress || !email || !password}
        >
          {isLoading && !demoLoginInProgress ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <>
              <Text style={styles.loginButtonText}>LOGIN</Text>
              <ArrowRight size={20} color={colors.textPrimary} />
            </>
          )}
        </Pressable>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={navigateToSignup} disabled={isLoading || demoLoginInProgress}>
          <Text style={styles.signupText}>Sign Up</Text>
        </Pressable>
      </View>
      
      <Pressable 
        style={styles.helpButton}
        onPress={() => router.push('/help')}
      >
        <Text style={styles.helpButtonText}>Need Help?</Text>
      </Pressable>
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
  demoButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  demoButtonActive: {
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderColor: colors.primary,
  },
  demoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  signupText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  helpButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  helpButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});