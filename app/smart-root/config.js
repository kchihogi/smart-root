import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from 'react-native-logs';
import * as FileSystem from 'expo-file-system';

const config = {
  transport: [
    consoleTransport,
    fileAsyncTransport,
  ],
  severity: (process.env.NODE_ENV == 'development') ?
    'debug' : 'debug',
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
    FS: FileSystem,
    fileName: `logs_{date-today}.log`,
    filePath: FileSystem.documentDirectory,
  },
};

const LOG = logger.createLogger(config);

export {LOG};
