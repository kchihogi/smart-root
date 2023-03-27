require('dotenv').config({path: '../../.env'});
import {LOG} from './config';

module.exports = ({config}) => {
  const androidKey = process.env.GOOGLE_MAP_API_KEY_ANDROID;
  const iosKey = process.env.GOOGLE_MAP_API_KEY_IOS;
  config.extra.googleMaps ={
    android: {apiKey: androidKey},
    ios: {apiKey: iosKey},
  };
  LOG.debug('---config---');
  LOG.debug(config);
  LOG.debug('---config---');
  return {
    ...config,
  };
};
