require('dotenv').config({path: '../../.env'});

module.exports = ({config}) => {
  const androidKey = process.env.GOOGLE_MAP_API_KEY_ANDROID;
  const iosKey = process.env.GOOGLE_MAP_API_KEY_IOS;
  config.extra.googleMaps ={
    android: {apiKey: androidKey},
    ios: {apiKey: iosKey},
  };
  config.updates = {url: 'https://u.expo.dev/1b78ab5b-7b20-4758-b224-793e2489ac54'};
  return {
    runtimeVersion: {policy: 'sdkVersion'},
    ...config,
  };
};
