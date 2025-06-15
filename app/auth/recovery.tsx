import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff, Phone } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/utils/validation';

export default function RecoveryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { recoverPassword, recoverEmail, isLoading, error, clearError } = useAuthStore();
  
  // State for recovery mode
  const [recoveryMode, setRecoveryMode] = useState<'password' | 'email'>('password');
  
  // State for password recovery
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  
  // State for email recovery
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [recoveredEmail, setRecoveredEmail] = useState<string | null>(null);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    resetCode?: string;
    newPassword?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    verificationCode?: string;
  }>({});
  
  // Success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const validatePasswordRecoveryForm = (checkResetCode = false): boolean => {
    const errors: {
      email?: string;
      resetCode?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      errors.email = emailError;
    }
    
    // Validate reset code if needed
    if (checkResetCode && (!resetCode || resetCode.trim().length !== 6)) {
      errors.resetCode = "Please enter the 6-digit code sent to your email";
    }
    
    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateEmailRecoveryForm = (checkVerificationCode = false): boolean => {
    const errors: {
      phoneNumber?: string;
      verificationCode?: string;
    } = {};
    
    // Validate phone number
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      errors.phoneNumber = phoneError;
    }
    
    // Validate verification code if needed
    if (checkVerificationCode && (!verificationCode || verificationCode.trim().length !== 6)) {
      errors.verificationCode = "Please enter the 6-digit verification code";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSendResetCode = async () => {
    console.log('🔄 Sending reset code for:', email);
    clearError();
    setSuccessMessage(null);
    
    // Validate email before sending reset code
    if (!validatePasswordRecoveryForm(false)) {
      return;
    }
    
    try {
      // Simulate sending reset code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetCodeSent(true);
      setSuccessMessage("A password reset code has been sent to your email. Please check your inbox and spam folder. Use code: 123456");
      console.log('✅ Reset code sent successfully');
    } catch (error) {
      console.error('❌ Error sending reset code:', error);
    }
  };
  
  const handlePasswordReset = async () => {
    console.log('🔄 Resetting password for:', email);
    clearError();
    setSuccessMessage(null);
    
    // Validate form before submission
    if (!validatePasswordRecoveryForm(true)) {
      return;
    }
    
    try {
      await recoverPassword(email.trim(), resetCode.trim(), newPassword);
      setSuccessMessage("Password has been reset successfully. You can now login with your new password.");
      
      // Clear form
      setEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setResetCodeSent(false);
      console.log('✅ Password reset successfully');
    } catch (error) {
      console.error('❌ Password recovery error:', error);
    }
  };
  
  const handleSendVerification = async () => {
    console.log('🔄 Sending verification code for:', phoneNumber);
    clearError();
    setSuccessMessage(null);
    
    // Validate phone number before sending verification
    if (!validateEmailRecoveryForm(false)) {
      return;
    }
    
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerificationSent(true);
      setSuccessMessage("A verification code has been sent to your phone. Please enter it to recover your email. Use code: 123456");
      console.log('✅ Verification code sent successfully');
    } catch (error) {
      console.error('❌ Error sending verification:', error);
    }
  };
  
  const handleEmailRecovery = async () => {
    console.log('🔄 Recovering email for phone:', phoneNumber);
    clearError();
    setSuccessMessage(null);
    setRecoveredEmail(null);
    
    // Validate form before submission
    if (!validateEmailRecoveryForm(true)) {
      return;
    }
    
    try {
      const result = await recoverEmail(phoneNumber.trim(), verificationCode.trim());
      if (result && result.email) {
        setRecoveredEmail(result.email);
        setSuccessMessage("Email has been recovered successfully.");
        console.log('✅ Email recovered successfully:', result.email);
      }
    } catch (error) {
      console.error('❌ Email recovery error:', error);
    }
  };
  
  const switchMode = (mode: 'password' | 'email') => {
    console.log('🔄 Switching recovery mode to:', mode);
    setRecoveryMode(mode);
    clearError();
    setSuccessMessage(null);
    setRecoveredEmail(null);
    setValidationErrors({});
    
    // Reset state for password recovery
    setEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetCodeSent(false);
    
    // Reset state for email recovery
    setPhoneNumber('');
    setVerificationCode('');
    setVerificationSent(false);
  };
  
  const navigateToLogin = () => {
    try {
      console.log('🔄 Navigating to login');
      router.push('/auth/login');
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };
  
  const goBack = () => {
    if (navigation.canGoBack()) {
      console.log('🔄 Going back');
      navigation.goBack();
    } else {
      // Navigate to login if we can't go back
      try {
        console.log('🔄 Cannot go back, navigating to login');
        router.replace('/auth/login');
      } catch (error) {
        console.error('❌ Navigation error:', error);
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Back button */}
          <Pressable 
            style={styles.backButton} 
            onPress={goBack}
          >
            <ChevronLeft size={20} color={colors.textSecondary} />
          </Pressable>
          
          <View style={styles.header}>
            <View style={styles.crosshairLogo}>
              <View style={styles.crosshairHorizontal} />
              <View style={styles.crosshairVertical} />
              <View style={styles.crosshairCenter} />
              <View style={styles.crosshairRing} />
            </View>
            
            <Text style={styles.title}>RIDESHARE SNIPER</Text>
            <Text style={styles.subtitle}>
              {recoveryMode === 'password' ? 'Reset Your Password' : 'Recover Your Email'}
            </Text>
          </View>
          
          {/* Mode selector */}
          <View style={styles.modeSelector}>
            <Pressable
              style={[
                styles.modeButton,
                recoveryMode === 'password' && styles.modeButtonActive
              ]}
              onPress={() => switchMode('password')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  recoveryMode === 'password' && styles.modeButtonTextActive
                ]}
              >
                Forgot Password
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.modeButton,
                recoveryMode === 'email' && styles.modeButtonActive
              ]}
              onPress={() => switchMode('email')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  recoveryMode === 'email' && styles.modeButtonTextActive
                ]}
              >
                Forgot Email
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={clearError}>
                  <Text style={styles.dismissText}>Dismiss</Text>
                </Pressable>
              </View>
            )}
            
            {successMessage && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
                {recoveredEmail && (
                  <Text style={styles.recoveredEmailText}>Your email: {recoveredEmail}</Text>
                )}
                <Pressable onPress={() => setSuccessMessage(null)}>
                  <Text style={styles.dismissText}>Dismiss</Text>
                </Pressable>
              </View>
            )}
            
            {recoveryMode === 'password' ? (
              // Password Recovery Form
              <>
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
                      if (validationErrors.email) {
                        setValidationErrors({...validationErrors, email: undefined});
                      }
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!resetCodeSent}
                    testID="email-input"
                  />
                </View>
                {validationErrors.email && (
                  <Text style={styles.validationErrorText}>{validationErrors.email}</Text>
                )}
                
                {!resetCodeSent ? (
                  <Pressable 
                    style={[
                      styles.resetButton,
                      !email && styles.resetButtonDisabled
                    ]} 
                    onPress={handleSendResetCode}
                    disabled={isLoading || !email}
                    testID="send-reset-code-button"
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                      <>
                        <Text style={styles.resetButtonText}>SEND RESET CODE</Text>
                        <ArrowRight size={20} color={colors.textPrimary} />
                      </>
                    )}
                  </Pressable>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Lock size={20} color={colors.textSecondary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="6-Digit Reset Code"
                        placeholderTextColor={colors.textMuted}
                        value={resetCode}
                        onChangeText={(text) => {
                          // Only allow digits and limit to 6 characters
                          const formattedText = text.replace(/[^0-9]/g, '').slice(0, 6);
                          setResetCode(formattedText);
                          if (validationErrors.resetCode) {
                            setValidationErrors({...validationErrors, resetCode: undefined});
                          }
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        testID="reset-code-input"
                      />
                    </View>
                    {validationErrors.resetCode && (
                      <Text style={styles.validationErrorText}>{validationErrors.resetCode}</Text>
                    )}
                    
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Lock size={20} color={colors.textSecondary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor={colors.textMuted}
                        value={newPassword}
                        onChangeText={(text) => {
                          setNewPassword(text);
                          if (validationErrors.newPassword) {
                            setValidationErrors({...validationErrors, newPassword: undefined});
                          }
                        }}
                        secureTextEntry={!showPassword}
                        testID="new-password-input"
                      />
                      <Pressable 
                        style={styles.passwordToggle} 
                        onPress={togglePasswordVisibility}
                        testID="toggle-password-visibility"
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={colors.textSecondary} />
                        ) : (
                          <Eye size={20} color={colors.textSecondary} />
                        )}
                      </Pressable>
                    </View>
                    {validationErrors.newPassword && (
                      <Text style={styles.validationErrorText}>{validationErrors.newPassword}</Text>
                    )}
                    
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Lock size={20} color={colors.textSecondary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor={colors.textMuted}
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (validationErrors.confirmPassword) {
                            setValidationErrors({...validationErrors, confirmPassword: undefined});
                          }
                        }}
                        secureTextEntry={!showConfirmPassword}
                        testID="confirm-password-input"
                      />
                      <Pressable 
                        style={styles.passwordToggle} 
                        onPress={toggleConfirmPasswordVisibility}
                        testID="toggle-confirm-password-visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color={colors.textSecondary} />
                        ) : (
                          <Eye size={20} color={colors.textSecondary} />
                        )}
                      </Pressable>
                    </View>
                    {validationErrors.confirmPassword && (
                      <Text style={styles.validationErrorText}>{validationErrors.confirmPassword}</Text>
                    )}
                    
                    <View style={styles.actionButtonsContainer}>
                      <Pressable 
                        style={styles.secondaryButton} 
                        onPress={() => {
                          setResetCodeSent(false);
                          setResetCode('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setSuccessMessage(null);
                        }}
                        testID="back-button"
                      >
                        <Text style={styles.secondaryButtonText}>BACK</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[
                          styles.primaryButton,
                          (!resetCode || !newPassword || !confirmPassword) && styles.primaryButtonDisabled
                        ]} 
                        onPress={handlePasswordReset}
                        disabled={isLoading || !resetCode || !newPassword || !confirmPassword}
                        testID="reset-password-button"
                      >
                        {isLoading ? (
                          <ActivityIndicator color={colors.textPrimary} />
                        ) : (
                          <Text style={styles.primaryButtonText}>RESET PASSWORD</Text>
                        )}
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            ) : (
              // Email Recovery Form
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIcon}>
                    <Phone size={20} color={colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor={colors.textMuted}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      // Format phone number as user types
                      const formattedText = text.replace(/[^0-9]/g, '');
                      setPhoneNumber(formattedText);
                      if (validationErrors.phoneNumber) {
                        setValidationErrors({...validationErrors, phoneNumber: undefined});
                      }
                    }}
                    keyboardType="phone-pad"
                    editable={!verificationSent}
                    testID="phone-input"
                  />
                </View>
                {validationErrors.phoneNumber && (
                  <Text style={styles.validationErrorText}>{validationErrors.phoneNumber}</Text>
                )}
                
                {!verificationSent ? (
                  <Pressable 
                    style={[
                      styles.resetButton,
                      !phoneNumber && styles.resetButtonDisabled
                    ]} 
                    onPress={handleSendVerification}
                    disabled={isLoading || !phoneNumber}
                    testID="send-verification-button"
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                      <>
                        <Text style={styles.resetButtonText}>SEND VERIFICATION CODE</Text>
                        <ArrowRight size={20} color={colors.textPrimary} />
                      </>
                    )}
                  </Pressable>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Lock size={20} color={colors.textSecondary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="6-Digit Verification Code"
                        placeholderTextColor={colors.textMuted}
                        value={verificationCode}
                        onChangeText={(text) => {
                          // Only allow digits and limit to 6 characters
                          const formattedText = text.replace(/[^0-9]/g, '').slice(0, 6);
                          setVerificationCode(formattedText);
                          if (validationErrors.verificationCode) {
                            setValidationErrors({...validationErrors, verificationCode: undefined});
                          }
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        testID="verification-code-input"
                      />
                    </View>
                    {validationErrors.verificationCode && (
                      <Text style={styles.validationErrorText}>{validationErrors.verificationCode}</Text>
                    )}
                    
                    <View style={styles.actionButtonsContainer}>
                      <Pressable 
                        style={styles.secondaryButton} 
                        onPress={() => {
                          setVerificationSent(false);
                          setVerificationCode('');
                          setSuccessMessage(null);
                        }}
                        testID="back-button"
                      >
                        <Text style={styles.secondaryButtonText}>BACK</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[
                          styles.primaryButton,
                          !verificationCode && styles.primaryButtonDisabled
                        ]} 
                        onPress={handleEmailRecovery}
                        disabled={isLoading || !verificationCode}
                        testID="recover-email-button"
                      >
                        {isLoading ? (
                          <ActivityIndicator color={colors.textPrimary} />
                        ) : (
                          <Text style={styles.primaryButtonText}>RECOVER EMAIL</Text>
                        )}
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            )}
            
            <Pressable 
              style={styles.loginButton} 
              onPress={navigateToLogin}
              testID="back-to-login-button"
            >
              <Text style={styles.loginButtonText}>BACK TO LOGIN</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    opacity: 0.7,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  crosshairLogo: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 80,
    height: 2,
    backgroundColor: colors.primary,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 80,
    backgroundColor: colors.primary,
  },
  crosshairCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  crosshairRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
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
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.textPrimary,
  },
  formContainer: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: colors.secondary,
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#00C853',
    fontSize: 14,
    marginBottom: 4,
  },
  recoveredEmailText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  validationErrorText: {
    color: colors.secondary,
    fontSize: 12,
    marginLeft: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  dismissText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    alignSelf: 'flex-end',
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
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  loginButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});