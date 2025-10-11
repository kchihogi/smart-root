const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// TurboModuleの設定を有効化
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
