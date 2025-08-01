import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PromptStoreProvider } from "@/hooks/usePromptStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="prompt/editor" options={{ presentation: 'modal', title: 'Prompt Editor' }} />
      <Stack.Screen name="prompt/view" options={{ title: 'Prompt Details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const GestureWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <QueryClientProvider client={queryClient}>
      <PromptStoreProvider>
        <GestureWrapper style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureWrapper>
      </PromptStoreProvider>
    </QueryClientProvider>
  );
}