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
  primary: "#6200EE",
  primaryLight: "#BB86FC",
  secondary: "#03DAC6",
  background: "#FFFFFF",
  backgroundLight: "#F8F9FA",
  backgroundAccent: "#F1F3F4",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#666666",
  border: "#E1E4E8",
  error: "#FF6B6B",
  success: "#4ECDC4",
  warning: "#FFE66D",
  inactive: "#9E9E9E",
  accent1: "#FF6B9D",
  accent2: "#4ECDC4",
  accent3: "#45B7D1",
  accent4: "#96CEB4",
  accent5: "#FFEAA7",
  gradient: {
    primary: ["#6200EE", "#9D4EDD"] as const,
    secondary: ["#03DAC6", "#018786"] as const,
    background: ["#FFFFFF", "#F8F9FA", "#F1F3F4"] as const,
    cosmic: ["#667eea", "#764ba2", "#f093fb"] as const,
    aurora: ["#4facfe", "#00f2fe", "#43e97b"] as const,
    sunset: ["#fa709a", "#fee140", "#ffeaa7"] as const,
    ocean: ["#2196F3", "#21CBF3", "#4ECDC4"] as const,
  }
};

export const darkTheme: ColorScheme = {
  primary: "#6200EE",
  primaryLight: "#BB86FC",
  secondary: "#03DAC6",
  background: "#0F0F23",
  backgroundLight: "#1A1A2E",
  backgroundAccent: "#16213E",
  card: "#1E1E3F",
  text: "#FFFFFF",
  textSecondary: "#A0A0B8",
  border: "#2A2A4A",
  error: "#FF6B6B",
  success: "#4ECDC4",
  warning: "#FFE66D",
  inactive: "#6C6C8A",
  accent1: "#FF6B9D",
  accent2: "#4ECDC4",
  accent3: "#45B7D1",
  accent4: "#96CEB4",
  accent5: "#FFEAA7",
  gradient: {
    primary: ["#6200EE", "#9D4EDD"] as const,
    secondary: ["#03DAC6", "#018786"] as const,
    background: ["#0F0F23", "#1A1A2E", "#16213E"] as const,
    cosmic: ["#667eea", "#764ba2", "#f093fb"] as const,
    aurora: ["#4facfe", "#00f2fe", "#43e97b"] as const,
    sunset: ["#fa709a", "#fee140", "#ffeaa7"] as const,
    ocean: ["#2196F3", "#21CBF3", "#4ECDC4"] as const,
  }
};

// Default export for backward compatibility
const colors = darkTheme;
export default colors;