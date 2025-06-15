import { Link, Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import colors from "@/constants/colors";
import { Home } from "lucide-react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  
  const goHome = () => {
    // Try to navigate to tabs first, then fall back to index
    try {
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error navigating to tabs:', error);
      try {
        router.replace('/');
      } catch (innerError) {
        console.error('Error navigating to index:', innerError);
      }
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Text style={styles.subtitle}>The page you're looking for couldn't be found.</Text>
        
        <Pressable style={styles.button} onPress={goHome}>
          <Home size={20} color={colors.textPrimary} />
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
        
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Or click here to go to the index page</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: 8,
  },
  link: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});