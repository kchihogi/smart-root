// React/React-Native
import * as React from 'react';

//Expo
import { StatusBar } from 'expo-status-bar';

//Gluestack
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';

//External libraries
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//Internal components
import HomeScreen from './screens/Home';
import SettingsScreen from './screens/Settings';
import { ThemeProvider, useTheme } from './hooks/ThemeContext';

const Drawer = createDrawerNavigator();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <Container />
    </ThemeProvider>
  );
}

const Container = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaProvider>
        <GluestackUIProvider colorMode={theme} config={config}>
          <NavigationContainer theme={theme === 'dark' ? MyDarkTheme : MyLightTheme}>
            <Drawer.Navigator initialRouteName="Home"
              screenOptions={{
                headerShown: true,
                headerTintColor: theme === 'dark' ? MyDarkTheme.colors.text : MyLightTheme.colors.text,
              }}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
              <Drawer.Screen name="Settings" component={SettingsScreen}/>
            </Drawer.Navigator>
          </NavigationContainer>
        </GluestackUIProvider>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  )
}
