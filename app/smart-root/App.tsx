// React/React-Native
import * as React from "react";

//Expo
import { StatusBar } from "expo-status-bar";

//Gluestack
import * as CP from "./components";
import { config } from "./components/gluestack-ui.config";

//External libraries
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import './i18n/i18n';
import i18n from './i18n/i18n';
import { useTranslation } from 'react-i18next';

//Internal components
import * as Constants from "./utils/constants";
import HomeScreen from "./screens/Home";
import SettingsScreen from "./screens/Settings";
import FavsScreen from "./screens/Favs";
import * as ThemeContext from "./contexts/ThemeContext";
import * as UserSettingsContext from "./contexts/UserSettingsContext";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Constants.ConstantsProvider>
      <UserSettingsContext.UserSettingsProvider>
        <ThemeContext.ThemeProvider>
          <Container />
        </ThemeContext.ThemeProvider>
      </UserSettingsContext.UserSettingsProvider>
    </Constants.ConstantsProvider>
  );
}
const Container = () => {
  const constants = Constants.useConstants();
  const userSettings = UserSettingsContext.useUserSettings() as any;
  const theme = ThemeContext.useTheme();
  const navigationTheme = ThemeContext.useNavigationTheme();
  const { t } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(userSettings.language);
  }, []);

  return (
    <SafeAreaProvider>
      <CP.GluestackUIProvider colorMode={theme}>
        <NavigationContainer theme={navigationTheme} >
          <Drawer.Navigator
            initialRouteName={t('home')}
            screenOptions={{
              swipeEnabled: false,
              headerShown: true,
              headerTintColor: navigationTheme.colors.text,
              drawerStyle: {
                width: config.tokens.space["5/6"],
                paddingTop: config.tokens.space[4],
              },
              drawerItemStyle: {
                padding: config.tokens.space[2],
                margin: 0,
              },
              drawerLabelStyle: {
                fontSize: config.tokens.fontSizes.lg,
                fontWeight: config.tokens.fontWeights.bold,
              },
            }}
          >
            <Drawer.Screen name={t('home')} component={HomeScreen} />
            <Drawer.Screen name={t('settings')} component={SettingsScreen} />
            <Drawer.Screen name={t('favs')} component={FavsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </CP.GluestackUIProvider>
      <StatusBar style={ThemeContext.useStatusBarTheme()} />
    </SafeAreaProvider>
  );
};
