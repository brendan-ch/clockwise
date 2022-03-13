import 'dotenv/config';

export default {
  name: 'Clockwise',
  description: 'Pomodoro timer and task management - An app designed to help you focus.',
  slug: 'clockwise',
  scheme: 'clockwise',
  userInterfaceStyle: 'automatic',
  version: '1.3.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: [
    '**/*',
  ],
  runtimeVersion: {
    policy: 'nativeVersion',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'co.birb.session',
    buildNumber: '7',
    usesIcloudStorage: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'co.birb.session',
    softwareKeyboardLayoutMode: 'pan',
    versionCode: 7,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    privacyPolicyLink: process.env.PRIVACY_POLICY_LINK,
    githubLink: process.env.GITHUB_LINK,
    githubProfileLink: process.env.GITHUB_PROFILE_LINK,
    prodBuild: process.env.PROD_BUILD,
  },
};
