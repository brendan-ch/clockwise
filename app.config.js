import 'dotenv/config';

export default {
  name: 'Session',
  description: 'Pomodoro timer and task management - An app designed to help you focus.',
  slug: 'session',
  scheme: 'session',
  userInterfaceStyle: 'automatic',
  version: '1.0.0',
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
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'co.birb.session',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'co.birb.session',
    softwareKeyboardLayoutMode: 'pan',
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
