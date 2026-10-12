module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        disableStaticViewConfigsCodegen: true,
      },
    ],
  ],
  plugins: ['react-native-worklets/plugin'],
};