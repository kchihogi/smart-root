require('dotenv').config({path: '../../.env'});

module.exports = ({config}) => {
  const androidKey = process.env.GOOGLE_MAP_API_KEY_ANDROID;
  const iosKey = process.env.GOOGLE_MAP_API_KEY_IOS;
  config.android.config.googleMaps.apiKey = androidKey;
  config.ios.config.googleMapsApiKey = iosKey;
  return {
    ...config,
  };
};
