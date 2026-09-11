module.exports = {
  expo: {
    name: 'G-One Sarthi',
    slug: 'g-one-sarthi',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    androidNavigationBar: {
      backgroundColor: '#F9F6F0',
      barStyle: 'dark-content',
    },
    plugins: ['@react-native-community/datetimepicker'],
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
    assetBundlePatterns: ['**/*'],
  },
};
