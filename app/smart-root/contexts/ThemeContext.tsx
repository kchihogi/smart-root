import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { config } from "../components/gluestack-ui.config";

import { useUserSettings } from "../contexts/UserSettingsContext";

// データを保存する関数
const storeData = async (key: string, value: string) => {
  let wait_time = 1 * 1000; // 1秒
  let retry_count = 3;

  let error = null;
  while (retry_count > 0) {
    try {
      await AsyncStorage.setItem(key, value);
      break;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, wait_time));
      retry_count -= 1;
    }
  }
  if (retry_count === 0) {
    //crash here
    throw new Error('Failed to store data. Please contact the developer.');
  }
};

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: config.tokens.colors.primary,
    background: config.tokens.colors.background,
    text: config.tokens.colors.onBackground,
    border: config.tokens.colors.borderLight400,
    card: config.tokens.colors.background,
    notification: config.tokens.colors.primary,
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primaryDark: config.tokens.colors.primary,
    backgroundDark: config.tokens.colors.background,
    textDark: config.tokens.colors.onBackground,
    borderDark: config.tokens.colors.borderLight400,
    cardDark: config.tokens.colors.background,
    notificationDark: config.tokens.colors.primary,
  },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {userSettings} = useUserSettings() as any;
  const [theme, setTheme] = useState<Theme>(userSettings.theme);

  React.useEffect(() => {
    loadTheme();
  }
  , []);

  React.useEffect(() => {
    storeData('theme', theme);
  }
  , [theme]);

  const loadTheme = async () => {
    const theme = await AsyncStorage.getItem('theme');
    if (theme !== null) {
      setTheme(theme as Theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = ():  undefined | ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useNavigationTheme = () => {
  const { theme } = useTheme() as ThemeContextType;
  return theme === "dark" ? MyDarkTheme : MyLightTheme;
}

export const useStatusBarTheme = () => {
  const { theme } = useTheme() as ThemeContextType;
  return theme === "dark" ? "light" : "dark";
}

export const useMapTheme = () => {
  const { theme } = useTheme() as ThemeContextType;
  return theme === "dark" ? "dark" : "light";
}
