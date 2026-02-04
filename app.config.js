import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'mobile-app',
  slug: 'mobile-app',
  version: '1.0.0',

  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,

  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.booking.like.mobile.ios',
    googleServicesFile: './GoogleService-Info.plist',
  },

  android: {
    package: 'com.booking.like.mobile',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },

  web: {
    favicon: './assets/favicon.png',
  },

  plugins: ['expo-secure-store', 'expo-notifications'],

  extra: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true',
    USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true',
    EXPO_PUBLIC_SENDER_ID: process.env.EXPO_PUBLIC_SENDER_ID,
  },
});
