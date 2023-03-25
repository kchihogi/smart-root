require('dotenv').config({path: '../../.env'});

module.exports = ({config}) => {
  const androidKey = process.env.GOOGLE_MAP_API_KEY_ANDROID;
  const iosKey = process.env.GOOGLE_MAP_API_KEY_IOS;
  config.extra.googleMaps ={
    android: {apiKey: androidKey},
    ios: {apiKey: iosKey},
  };
  return {
    ...config,
  };
};
