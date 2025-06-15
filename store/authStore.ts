import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '@/utils/validation';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
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

// Mock user database stored in AsyncStorage
const USERS_STORAGE_KEY = 'rideshare_sniper_users';
const CURRENT_USER_KEY = 'rideshare_sniper_current_user';

// Default demo users
const DEFAULT_USERS = {
  'demo@example.com': {
    id: 'user-demo-123',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'password123'
  },
  'test@example.com': {
    id: 'user-test-456',
    email: 'test@example.com',
    name: 'Test User',
    password: 'test123'
  }
};

// Helper functions for mock authentication
const getUsersFromStorage = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (usersJson) {
      return JSON.parse(usersJson);
    }
    // Initialize with default users if none exist
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch (error) {
    console.error('Error getting users from storage:', error);
    return DEFAULT_USERS;
  }
};

const saveUsersToStorage = async (users: any) => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

const getCurrentUserFromStorage = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user from storage:', error);
    return null;
  }
};

const saveCurrentUserToStorage = async (user: User | null) => {
  try {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error saving current user to storage:', error);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
      isInitialized: false,
      
      initialize: async () => {
        if (get().isInitialized) return;
        
        set({ isLoading: true });
        
        try {
          // Check if user is already logged in
          const currentUser = await getCurrentUserFromStorage();
          
          if (currentUser) {
            set({
              user: currentUser,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          }
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          set({
            isLoading: false,
            isInitialized: true,
            error: null
          });
        }
      },
      
      login: async (email: string, password: string) => {
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
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get users from storage
          const users = await getUsersFromStorage();
          const user = users[email.toLowerCase()];
          
          if (!user) {
            set({
              isLoading: false,
              error: "Invalid email or password. Please check your credentials."
            });
            return;
          }
          
          if (user.password !== password) {
            set({
              isLoading: false,
              error: "Invalid email or password. Please check your credentials."
            });
            return;
          }
          
          // Create user object without password
          const authenticatedUser: User = {
            id: user.id,
            email: user.email,
            name: user.name
          };
          
          // Save current user to storage
          await saveCurrentUserToStorage(authenticatedUser);
          
          set({
            user: authenticatedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: "Network error. Please check your connection and try again."
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
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get users from storage
          const users = await getUsersFromStorage();
          
          // Check if user already exists
          if (users[email.toLowerCase()]) {
            set({
              isLoading: false,
              error: "An account with this email already exists. Please try logging in."
            });
            return;
          }
          
          // Create new user
          const newUser = {
            id: `user-${Date.now()}`,
            email: email.toLowerCase(),
            name: name.trim(),
            password
          };
          
          // Add user to storage
          users[email.toLowerCase()] = newUser;
          await saveUsersToStorage(users);
          
          // Create user object without password
          const authenticatedUser: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
          };
          
          // Save current user to storage
          await saveCurrentUserToStorage(authenticatedUser);
          
          set({
            user: authenticatedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Signup error:', error);
          set({
            isLoading: false,
            error: "Network error. Please check your connection and try again."
          });
        }
      },
      
      logout: async () => {
        try {
          // Remove current user from storage
          await saveCurrentUserToStorage(null);
          
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          set({
            error: "Network error during logout. Please try again."
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setRememberMe: (value: boolean) => {
        set({ rememberMe: value });
      },
      
      // Password recovery using mock system
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
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get users from storage
          const users = await getUsersFromStorage();
          const user = users[email.toLowerCase()];
          
          if (!user) {
            set({
              isLoading: false,
              error: "No account found with this email address."
            });
            return;
          }
          
          // For demo purposes, accept any 6-digit code
          if (resetCode !== "123456") {
            set({
              isLoading: false,
              error: "Invalid reset code. For demo, use 123456."
            });
            return;
          }
          
          // Update password
          user.password = newPassword;
          await saveUsersToStorage(users);
          
          set({
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Password recovery error:', error);
          set({
            isLoading: false,
            error: "Network error. Please check your connection and try again."
          });
        }
      },
      
      // Email recovery (mock implementation)
      recoverEmail: async (phoneNumber: string, verificationCode: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simple validation
          if (!phoneNumber || !verificationCode) {
            set({ error: "Please fill all fields", isLoading: false });
            return null;
          }
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, accept any 6-digit code
          if (verificationCode !== "123456") {
            set({
              isLoading: false,
              error: "Invalid verification code. For demo, use 123456."
            });
            return null;
          }
          
          set({
            isLoading: false,
            error: null
          });
          
          // Return demo email - in production, this would come from your backend
          return { email: "demo@example.com" };
        } catch (error: any) {
          console.error('Email recovery error:', error);
          set({
            isLoading: false,
            error: "Network error. Please check your connection and try again."
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
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);