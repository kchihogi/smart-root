require('dotenv').config({path: '../../.env'});

module.exports = ({config}) => {
  const androidKey = process.env.GOOGLE_MAP_API_KEY_ANDROID;
  const iosKey = process.env.GOOGLE_MAP_API_KEY_IOS;
  config.extra.googleMaps ={
    android: {apiKey: androidKey},
    ios: {apiKey: iosKey},
  };
  config.android.config.googleMaps.apiKey = androidKey;
  config.ios.config.googleMapsApiKey = androidKey;
  // console.log('---config---');
  // console.log(config);
  // console.log('---config---');
  return {
    ...config,
  };
};
