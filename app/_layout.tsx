import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PromptStoreProvider } from "@/hooks/usePromptStore";
import { ThemeProvider } from "@/hooks/useTheme";
import { ApiKeysProvider } from "@/hooks/useApiKeys";
import { trpc, trpcClient } from "@/lib/trpc";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider, useToast } from "@/components/Toast";
import { NetworkStatus } from "@/components/NetworkStatus";
import { setupGlobalErrorHandling } from "@/hooks/useErrorHandler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { ToastContainer } = useToast();
  
  return (
    <>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="prompt/editor" options={{ presentation: 'modal', title: 'Prompt Editor' }} />
        <Stack.Screen name="prompt/view" options={{ title: 'Prompt Details' }} />
      </Stack>
      <ToastContainer />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    setupGlobalErrorHandling();
  }, []);

  const GestureWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <ApiKeysProvider>
                <PromptStoreProvider>
                  <GestureWrapper style={{ flex: 1 }}>
                    <NetworkStatus />
                    <RootLayoutNav />
                  </GestureWrapper>
                </PromptStoreProvider>
              </ApiKeysProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}