module.exports = {
  expo: {
    name: 'G-One Sarthi',
    slug: 'g-one-sarthi',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    androidNavigationBar: {
      backgroundColor: '#F9F6F0',
      barStyle: 'dark-content',
    },
    android: {
      package: 'com.gonesarthi.app',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#F9F6F0',
      },
    },
    plugins: ['@react-native-community/datetimepicker'],
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY,
      eas: {
        projectId: 'b49b8b91-772d-49d8-9d44-294cbe3a23ed',
      },
    },
    assetBundlePatterns: ['**/*'],
  },
};
