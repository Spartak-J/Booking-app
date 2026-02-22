import 'dotenv/config';
import fs from 'fs';

const iosGoogleServicesFilePath =
  process.env.IOS_GOOGLE_SERVICES_FILE || './GoogleService-Info.plist';
const androidGoogleServicesFilePath =
  process.env.ANDROID_GOOGLE_SERVICES_FILE || './google-services.json';
const hasIosGoogleServicesFile = fs.existsSync(iosGoogleServicesFilePath);
const hasAndroidGoogleServicesFile = fs.existsSync(androidGoogleServicesFilePath);

export default ({ config }) => ({
  ...config,
  name: 'mobile-app',
  slug: 'mobile-app',
  version: '1.0.0',
  scheme: 'mobileapp',

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
    ...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY
      ? { config: { googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY } }
      : {}),
    ...(hasIosGoogleServicesFile ? { googleServicesFile: iosGoogleServicesFilePath } : {}),
  },

  android: {
    package: 'com.booking.like.mobile',
    ...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY
      ? {
          config: {
            googleMaps: {
              apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
            },
          },
        }
      : {}),
    ...(hasAndroidGoogleServicesFile ? { googleServicesFile: androidGoogleServicesFilePath } : {}),
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'mobileapp',
            host: 'payment',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
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
    EXPO_PUBLIC_USE_MOCKS_AUTH: process.env.EXPO_PUBLIC_USE_MOCKS_AUTH ?? 'false',
    USE_MOCKS_AUTH: process.env.EXPO_PUBLIC_USE_MOCKS_AUTH ?? 'false',
    EXPO_PUBLIC_USE_MOCKS_SEARCH: process.env.EXPO_PUBLIC_USE_MOCKS_SEARCH ?? 'false',
    USE_MOCKS_SEARCH: process.env.EXPO_PUBLIC_USE_MOCKS_SEARCH ?? 'false',
    EXPO_PUBLIC_USE_MOCKS_PAYMENT: process.env.EXPO_PUBLIC_USE_MOCKS_PAYMENT,
    USE_MOCKS_PAYMENT: process.env.EXPO_PUBLIC_USE_MOCKS_PAYMENT,
    EXPO_PUBLIC_SENDER_ID: process.env.EXPO_PUBLIC_SENDER_ID,
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
    EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
    IOS_GOOGLE_SERVICES_FILE: process.env.IOS_GOOGLE_SERVICES_FILE,
    ANDROID_GOOGLE_SERVICES_FILE: process.env.ANDROID_GOOGLE_SERVICES_FILE,
  },
});
