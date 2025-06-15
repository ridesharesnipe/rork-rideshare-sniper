import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '@/utils/validation';
import { trpcClient } from '@/lib/trpc';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
  isInitialized: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setRememberMe: (value: boolean) => void;
  initialize: () => Promise<void>;
  
  // Recovery methods
  recoverPassword: (email: string, resetCode: string, newPassword: string) => Promise<void>;
  recoverEmail: (phoneNumber: string, verificationCode: string) => Promise<{ email: string } | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
      isInitialized: false,
      
      initialize: async () => {
        const state = get();
        
        // Skip if already initialized
        if (state.isInitialized) {
          console.log('Auth already initialized, skipping');
          return;
        }
        
        console.log('Starting auth initialization...');
        set({ isLoading: true, error: null });
        
        try {
          // Check if we have a stored user and token
          const { user, token } = get();
          
          if (user && token) {
            console.log('Found stored credentials, validating...');
            // In a real app, you would validate the token with the backend here
            // For now, we'll just consider the user authenticated if we have a token
            set({
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          } else {
            console.log('No stored credentials found');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          }
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          // Always mark as initialized to prevent getting stuck
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            error: error?.message || "Failed to initialize authentication"
          });
        }
      },
      
      login: async (email: string, password: string) => {
        console.log(`Login attempt for: ${email}`);
        set({ isLoading: true, error: null });
        
        try {
          // Simple validation
          if (!email || !password) {
            set({ error: "Please enter email and password", isLoading: false });
            return;
          }
          
          // Validate email format
          const emailError = validateEmail(email);
          if (emailError) {
            set({ error: emailError, isLoading: false });
            return;
          }
          
          // Call backend login endpoint
          const response = await trpcClient.auth.login.mutate({
            email: email.trim().toLowerCase(),
            password
          });
          
          console.log('Login response:', response);
          
          if (response.success && response.user && response.token) {
            // Store user and token
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            console.log('Login successful for:', email);
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: error?.message || "Network error. Please check your connection and try again."
          });
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simple validation
          if (!email || !password || !name) {
            set({ error: "Please fill all fields", isLoading: false });
            return;
          }
          
          // Validate email format
          const emailError = validateEmail(email);
          if (emailError) {
            set({ error: emailError, isLoading: false });
            return;
          }
          
          // Call backend signup endpoint
          const response = await trpcClient.auth.signup.mutate({
            email: email.trim().toLowerCase(),
            password,
            name: name.trim()
          });
          
          console.log('Signup response:', response);
          
          if (response.success && response.user && response.token) {
            // Store user and token
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            console.log('Signup successful for:', email);
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error: any) {
          console.error('Signup error:', error);
          set({
            isLoading: false,
            error: error?.message || "Network error. Please check your connection and try again."
          });
        }
      },
      
      logout: async () => {
        try {
          console.log('Logging out user...');
          set({ isLoading: true });
          
          // In a real app, you would call a logout endpoint here
          // For now, just clear the state
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });
          
          console.log('Logout successful');
        } catch (error: any) {
          console.error('Logout error:', error);
          set({
            error: error?.message || "Network error during logout. Please try again.",
            isLoading: false
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setRememberMe: (value: boolean) => {
        set({ rememberMe: value });
      },
      
      // Password recovery using backend
      recoverPassword: async (email: string, resetCode: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simple validation
          if (!email) {
            set({ error: "Please enter your email address", isLoading: false });
            return;
          }
          
          // Validate email format
          const emailError = validateEmail(email);
          if (emailError) {
            set({ error: emailError, isLoading: false });
            return;
          }
          
          // Call backend recovery endpoint
          const response = await trpcClient.auth.recovery.mutate({
            recoveryType: "password",
            email: email.trim().toLowerCase(),
            resetCode: resetCode.trim(),
            newPassword
          });
          
          console.log('Password recovery response:', response);
          
          if (response.success) {
            set({
              isLoading: false,
              error: null
            });
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error: any) {
          console.error('Password recovery error:', error);
          set({
            isLoading: false,
            error: error?.message || "Network error. Please check your connection and try again."
          });
        }
      },
      
      // Email recovery using backend
      recoverEmail: async (phoneNumber: string, verificationCode: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simple validation
          if (!phoneNumber || !verificationCode) {
            set({ error: "Please fill all fields", isLoading: false });
            return null;
          }
          
          // Call backend recovery endpoint
          const response = await trpcClient.auth.recovery.mutate({
            recoveryType: "email",
            phoneNumber: phoneNumber.trim(),
            verificationCode: verificationCode.trim()
          });
          
          console.log('Email recovery response:', response);
          
          set({
            isLoading: false,
            error: null
          });
          
          if (response.success && response.email) {
            return { email: response.email };
          }
          
          return null;
        } catch (error: any) {
          console.error('Email recovery error:', error);
          set({
            isLoading: false,
            error: error?.message || "Network error. Please check your connection and try again."
          });
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrated:', state?.isAuthenticated ? 'authenticated' : 'not authenticated');
        // Don't mark as initialized here - let the initialize function handle it
      },
    }
  )
);