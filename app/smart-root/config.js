import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from 'react-native-logs';
import * as FileSystem from 'expo-file-system';

const config = {
  transport: (process.env.NODE_ENV == 'development') ?
   consoleTransport : fileAsyncTransport,
  severity: (process.env.NODE_ENV == 'development') ?
   'debug' : 'info',
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
    FS: FileSystem,
    fileName: `logs_{date-today}`,
  },
};

const LOG = logger.createLogger(config);

export {LOG};
