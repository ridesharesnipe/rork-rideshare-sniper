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
  
  // Initialize auth store when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Initializing auth from login screen...');
      initialize();
    }
  }, [isInitialized, initialize]);
  
  useEffect(() => {
    if (isAuthenticated && user && isInitialized) {
      console.log('✅ User authenticated in login screen, showing welcome');
      // Show welcome back message before redirecting
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
  }, [isAuthenticated, user, isInitialized]);
  
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
  
  const fillDemoCredentials = () => {
    console.log('🔄 Filling demo credentials and auto-login');
    setEmail('demo@example.com');
    setPassword('password123');
    
    // Auto-login after a short delay to allow user to see the credentials
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password123') {
        handleLogin();
      }
    }, 1000);
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
        <Pressable style={styles.demoButton} onPress={fillDemoCredentials}>
          <Text style={styles.demoButtonText}>Use Demo Credentials (Auto-Login)</Text>
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
            editable={!isLoading}
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
        
        <Pressable 
          style={styles.forgotPasswordButton} 
          onPress={navigateToRecovery}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password or Email?</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
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
        <Pressable onPress={navigateToSignup} disabled={isLoading}>
          <Text style={styles.signupText}>Sign Up</Text>
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
  demoButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
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
});