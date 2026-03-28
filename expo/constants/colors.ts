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
  primary: "#6366F1",
  primaryLight: "#8B5CF6",
  secondary: "#EC4899",
  background: "#FAFAFA",
  backgroundLight: "#F8FAFC",
  backgroundAccent: "#F1F5F9",
  card: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  inactive: "#94A3B8",
  accent1: "#EC4899",
  accent2: "#06B6D4",
  accent3: "#8B5CF6",
  accent4: "#10B981",
  accent5: "#F59E0B",
  gradient: {
    primary: ["#6366F1", "#8B5CF6"] as const,
    secondary: ["#EC4899", "#F472B6"] as const,
    background: ["#FAFAFA", "#F8FAFC", "#F1F5F9"] as const,
    cosmic: ["#6366F1", "#8B5CF6", "#EC4899"] as const,
    aurora: ["#06B6D4", "#3B82F6", "#8B5CF6"] as const,
    sunset: ["#F59E0B", "#EC4899", "#8B5CF6"] as const,
    ocean: ["#06B6D4", "#3B82F6", "#10B981"] as const,
  }
};

export const darkTheme: ColorScheme = {
  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  secondary: "#F472B6",
  background: "#0F0F23",
  backgroundLight: "#1E1B4B",
  backgroundAccent: "#312E81",
  card: "#1E1B4B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#475569",
  error: "#F87171",
  success: "#34D399",
  warning: "#FBBF24",
  inactive: "#64748B",
  accent1: "#F472B6",
  accent2: "#22D3EE",
  accent3: "#A78BFA",
  accent4: "#34D399",
  accent5: "#FBBF24",
  gradient: {
    primary: ["#8B5CF6", "#A78BFA"] as const,
    secondary: ["#F472B6", "#FB7185"] as const,
    background: ["#0F0F23", "#1E1B4B", "#312E81"] as const,
    cosmic: ["#8B5CF6", "#A855F7", "#F472B6"] as const,
    aurora: ["#22D3EE", "#3B82F6", "#A78BFA"] as const,
    sunset: ["#FBBF24", "#F472B6", "#A78BFA"] as const,
    ocean: ["#22D3EE", "#3B82F6", "#34D399"] as const,
  }
};

// Default export for backward compatibility
const colors = darkTheme;
export default colors;