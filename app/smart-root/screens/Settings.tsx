//React/React-Native
import * as React from 'react';

//Expo

//Gluestack
import { Button, ButtonText, Text, View } from '@gluestack-ui/themed';

//External libraries

//Internal components
import { useTheme } from '../hooks/ThemeContext';

export default function SettingsScreen({ navigation }: any) {
  const { theme, setTheme } = useTheme();
  return (
    <View
      justifyContent="center"
      alignItems="center"
      h="100%"
      sx={{
        _dark: {
          bg: '$light900',
        },
        _light: {
          bg: '$light200',
        },
      }}
    >
      <Text
        sx={{
          _dark: {
            color: '$light200',
          },
          _light: {
            color: '$light900',
          },
        }}
      >This is the Settings screen
      </Text>
      <Button
        sx={{
          _dark: {
            bg: '$light200',
          },
          _light: {
            bg: '$light900',
          },
        }}
        onPress={() => navigation.navigate('Home')}
      >
        <ButtonText
          sx={{
            _dark: {
              color: '$light900',
            },
            _light: {
              color: '$light200',
            },
          }}
        >Go to Home
        </ButtonText>
      </Button>
      <Button
        sx={{
          _dark: {
            bg: '$light200',
          },
          _light: {
            bg: '$light900',
          },
        }}
        onPress={ () => { setTheme(theme === 'light' ? 'dark' : 'light') } }
      >
        <ButtonText
          sx={{
            _dark: {
              color: '$light900',
            },
            _light: {
              color: '$light200',
            },
          }}
        >Toggle theme to {theme}</ButtonText>
      </Button>
    </View>
  );
}
