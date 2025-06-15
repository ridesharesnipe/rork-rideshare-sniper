import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter, useNavigation } from "expo-router";
import colors from "@/constants/colors";

export default function ModalScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  const goBack = () => {
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
    <View style={styles.container}>
      {/* Back button - only show if we can go back */}
      {navigation.canGoBack() && (
        <Pressable 
          style={styles.backButton} 
          onPress={goBack}
        >
          <ChevronLeft size={20} color={colors.textSecondary} />
        </Pressable>
      )}
      
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />
      <Text style={styles.text}>This is an example modal. You can edit it in app/modal.tsx.</Text>

      <Pressable style={styles.closeButton} onPress={goBack}>
        <Text style={styles.closeButtonText}>Close Modal</Text>
      </Pressable>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
    backgroundColor: colors.border,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    opacity: 0.7,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});