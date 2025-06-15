import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Home, Settings, Activity, Crosshair, LogOut, HelpCircle } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
  const { logout, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  
  // Redirect to login if not authenticated (only after initialization)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      console.log("Not authenticated in tabs, redirecting to welcome");
      router.replace('/welcome');
    }
  }, [isAuthenticated, isInitialized, router]);
  
  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      await logout();
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Logout button component
  const LogoutButton = () => {
    return (
      <Pressable 
        onPress={handleLogout}
        style={{ marginRight: 16 }}
      >
        <LogOut size={20} color={colors.textSecondary} />
      </Pressable>
    );
  };

  // Help button component
  const HelpButton = () => {
    return (
      <Pressable 
        onPress={() => router.push('/help')}
        style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center' }}
      >
        <HelpCircle size={20} color={colors.primary} />
        <Text style={{ color: colors.primary, marginLeft: 4, fontWeight: '600' }}>Help</Text>
      </Pressable>
    );
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <>
            <HelpButton />
            <LogoutButton />
          </>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="simulator"
        options={{
          title: "Simulator",
          tabBarIcon: ({ color }) => <Crosshair size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}