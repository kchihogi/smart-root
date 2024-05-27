import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    EXPO_PUBLIC_GOOGLE_MAP_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
  },
});
