// import 'dotenv/config';

export default {
  name: 'Clockwise',
  description: 'A Pomodoro timer designed to help you focus.',
  slug: 'clockwise',
  scheme: 'clockwise',
  userInterfaceStyle: 'automatic',
  version: '1.4.3',
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
  runtimeVersion: '1.4.3(12)',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'co.birb.session',
    buildNumber: '12',
    usesIcloudStorage: true,
  },
  plugins: [
    [
      'expo-document-picker',
      {
        appleTeamId: '4A9XHUS87Q',
        iCloudContainerEnvironment: 'Production',
      },
    ],
  ],
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'co.birb.session',
    softwareKeyboardLayoutMode: 'pan',
    versionCode: 12,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    privacyPolicyLink: process.env.PRIVACY_POLICY_LINK,
    githubLink: process.env.GITHUB_LINK,
    githubProfileLink: process.env.GITHUB_PROFILE_LINK,
    prodBuild: process.env.PROD_BUILD,
    appStoreLink: process.env.APP_STORE_LINK,
    googlePlayLink: process.env.GOOGLE_PLAY_LINK,
    supportLink: process.env.SUPPORT_LINK,
    licensesLink: process.env.LICENSES_LINK,
    whatsNewLink: process.env.WHATS_NEW,

    eas: {
      projectId: '09da71e5-0293-4bfa-9835-ee84f9b2eabb',
    },
  },
};
