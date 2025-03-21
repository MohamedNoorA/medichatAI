import { Stack, useRouter } from "expo-router";
import { LogBox, ActivityIndicator, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    const unsubscribe = setInterval(checkLoginStatus, 2000);
    return () => clearInterval(unsubscribe);
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: "#25292e" }, headerTintColor: "#fff" }}>
        <Stack.Screen
          name={isLoggedIn ? "(tabs)" : "login"}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="signup" options={{ headerTitle: "Sign Up" }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
});
