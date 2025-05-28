// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /APIServices\/.*\.[tj]sx?$/, // Exclude .ts, .tsx, .js, .jsx in APIServices
  /components\/.*\.[tj]sx?$/, // Exclude .ts, .tsx, .js, .jsx in components
  /context\/.*\.[tj]sx?$/, // Exclude .ts, .tsx, .js, .jsx in context
  /hooks\/.*\.[tj]s$/, // Exclude .ts, .js in hooks
  /styles\/.*\.[tj]sx?$/, // Exclude .ts, .tsx, .js, .jsx in styles
  /types\/.*\.[tj]s$/, // Exclude .ts, .js in types
  /interface\/.*\.d\.ts$/, // Exclude .d.ts in interface
];

module.exports = config;