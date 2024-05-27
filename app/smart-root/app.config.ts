import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';
import appJson from './app.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    EXPO_PUBLIC_GOOGLE_MAP_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
  },
});
