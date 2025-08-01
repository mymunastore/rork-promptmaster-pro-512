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
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: Platform.select({
            ios: 0.5,
            android: 0,
            web: 1,
          }),
          paddingTop: Platform.select({
            ios: 8,
            android: 8,
            web: 8,
          }),
          paddingBottom: Platform.select({
            ios: 20,
            android: 8,
            web: 8,
          }),
          height: Platform.select({
            ios: 84,
            android: 60,
            web: 60,
          }),
          ...layout.shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: layout.typography.sizes.caption1,
          fontWeight: layout.typography.weights.medium,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: Platform.select({
            ios: 0.5,
            android: 0,
            web: 1,
          }),
          ...layout.shadows.small,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: layout.typography.weights.semibold,
          fontSize: layout.typography.sizes.headline,
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