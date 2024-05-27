import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from "../utils/constants";
import {currentLanguage} from '../i18n/i18n';

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

type UserSettings = {
  name: string;
  email: string;
  num_of_markers: number;
  max_markers: number;
  walk_speed: number;
  unit_index: number;
  theme: string;
  language: string;
};

interface UserSettingsContextType {
  userSettings: UserSettings;
  setUserSettings: (userSettings: UserSettings) => void;
  favRoutes: any[];
  setFavRoutes: (favRoutes: any[]) => void;
  saveUserSettings: (userSettings: UserSettings) => void;
  saveFavRoutes: (favRoutes: any[]) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    email: "",
    num_of_markers: 1,
    max_markers: 1,
    walk_speed: 80,
    unit_index: C.UNIT_INDEX.minutes,
    theme: "light",
    language: currentLanguage,
  });
  const [favRoutes, setFavRoutes] = useState<any[]>([]);

  React.useEffect(() => {
    loadUserSettings();
    loadFavRoutes();
  }
  , []);

  React.useEffect(() => {
    saveUserSettings(userSettings);
  }
  , [userSettings]);

  React.useEffect(() => {
    saveFavRoutes(favRoutes);
  }
  , [favRoutes]);

  const loadUserSettings = async () => {
    const value = await AsyncStorage.getItem("userSettings");
    if (value !== null) {
      setUserSettings(JSON.parse(value));
    }
  }

  const loadFavRoutes = async () => {
    const value = await AsyncStorage.getItem("favRoutes");
    if (value !== null) {
      setFavRoutes(JSON.parse(value));
    }
  }

  const saveUserSettings = async (input: UserSettings) => {
    await storeData("userSettings", JSON.stringify(input));
  }

  const saveFavRoutes = async (input: any[]) => {
    await storeData("favRoutes", JSON.stringify(input));
  }

  return (
    <UserSettingsContext.Provider value={{ userSettings, setUserSettings, favRoutes, setFavRoutes, saveUserSettings, saveFavRoutes }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = (): undefined | UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
};
