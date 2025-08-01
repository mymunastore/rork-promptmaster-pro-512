import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Home, BookTemplate, Bookmark, Settings } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import layout from "@/constants/layout";

export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactive,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.card + 'F0',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          paddingTop: Platform.select({
            ios: 12,
            android: 12,
            web: 12,
          }),
          paddingBottom: Platform.select({
            ios: 24,
            android: 12,
            web: 12,
          }),
          height: Platform.select({
            ios: 88,
            android: 64,
            web: 64,
          }),
          ...layout.shadows.medium,
          position: 'absolute',
          borderRadius: Platform.select({
            ios: 0,
            android: 0,
            web: 0,
          }),
        },
        tabBarLabelStyle: {
          fontSize: layout.typography.sizes.caption1,
          fontWeight: layout.typography.weights.semibold,
          marginTop: 4,
          letterSpacing: -0.1,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.background + 'F8',
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
          borderBottomWidth: 1,
          ...layout.shadows.small,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: layout.typography.weights.bold,
          fontSize: layout.typography.sizes.headline,
          letterSpacing: -0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={focused ? 24 : 22} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          headerTitle: "PromptMaster Pro",
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: "Templates",
          tabBarIcon: ({ color, focused }) => (
            <BookTemplate 
              size={focused ? 24 : 22} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Bookmark 
              size={focused ? 24 : 22} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Settings 
              size={focused ? 24 : 22} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}