export interface ColorScheme {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  backgroundLight: string;
  backgroundAccent: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  inactive: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  gradient: {
    primary: readonly [string, string];
    secondary: readonly [string, string];
    background: readonly [string, string, string];
    cosmic: readonly [string, string, string];
    aurora: readonly [string, string, string];
    sunset: readonly [string, string, string];
    ocean: readonly [string, string, string];
  };
}

export const lightTheme: ColorScheme = {
  primary: "#007AFF",
  primaryLight: "#5AC8FA",
  secondary: "#34C759",
  background: "#FFFFFF",
  backgroundLight: "#F2F2F7",
  backgroundAccent: "#E5E5EA",
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#8E8E93",
  border: "#C6C6C8",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  inactive: "#8E8E93",
  accent1: "#FF2D92",
  accent2: "#5AC8FA",
  accent3: "#007AFF",
  accent4: "#34C759",
  accent5: "#FFCC00",
  gradient: {
    primary: ["#007AFF", "#5AC8FA"] as const,
    secondary: ["#34C759", "#30D158"] as const,
    background: ["#FFFFFF", "#F2F2F7", "#E5E5EA"] as const,
    cosmic: ["#6366F1", "#8B5CF6", "#A855F7"] as const,
    aurora: ["#06B6D4", "#0EA5E9", "#3B82F6"] as const,
    sunset: ["#F59E0B", "#EAB308", "#FDE047"] as const,
    ocean: ["#007AFF", "#5AC8FA", "#34C759"] as const,
  }
};

export const darkTheme: ColorScheme = {
  primary: "#0A84FF",
  primaryLight: "#64D2FF",
  secondary: "#30D158",
  background: "#000000",
  backgroundLight: "#1C1C1E",
  backgroundAccent: "#2C2C2E",
  card: "#1C1C1E",
  text: "#FFFFFF",
  textSecondary: "#8E8E93",
  border: "#38383A",
  error: "#FF453A",
  success: "#30D158",
  warning: "#FF9F0A",
  inactive: "#8E8E93",
  accent1: "#FF2D92",
  accent2: "#64D2FF",
  accent3: "#0A84FF",
  accent4: "#30D158",
  accent5: "#FFD60A",
  gradient: {
    primary: ["#0A84FF", "#64D2FF"] as const,
    secondary: ["#30D158", "#32D74B"] as const,
    background: ["#000000", "#1C1C1E", "#2C2C2E"] as const,
    cosmic: ["#6366F1", "#8B5CF6", "#A855F7"] as const,
    aurora: ["#06B6D4", "#0EA5E9", "#3B82F6"] as const,
    sunset: ["#F59E0B", "#EAB308", "#FDE047"] as const,
    ocean: ["#0A84FF", "#64D2FF", "#30D158"] as const,
  }
};

// Default export for backward compatibility
const colors = darkTheme;
export default colors;