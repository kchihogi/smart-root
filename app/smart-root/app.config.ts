import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';
import appJson from './app.json';

export default ({ config }: ConfigContext): ExpoConfig => {

  let key = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

  return {
    ...config,
    ...appJson.expo,
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: key,
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        googleMapsApiKey: key,
      },
    },
    extra: {
      ...appJson.expo.extra,
      EXPO_PUBLIC_GOOGLE_MAP_API_KEY: key,
    },
  };
};
