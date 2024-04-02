/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts, assetResolutions },
} = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetResolutions: ['xhdpi', 'hdpi', 'mdpi', 'ldpi', 'nodpi'],
    assetExts: [...assetExts, 'ttf', 'otf','png','bin'],
    sourceExts: [...sourceExts,'sass','scss'],
    extraNodeModules: {
      'missing-asset-registry-path': __dirname,
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  //  babelTransformerPath: require.resolve('react-native-svg-transformer'),
    babelTransformerPath: require.resolve('./transformer.js'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
