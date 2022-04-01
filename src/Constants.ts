import Constants from 'expo-constants';

// Regions that don't use 24-hour time
/* eslint-disable-next-line */
export const REGIONS_WITH_12H_TIME = [
  'AU',
  'CA',
  'BD',
  'CO',
  'EG',
  'SV',
  'HN',
  'IN',
  'IE',
  'JO',
  'MY',
  'MX',
  'NZ',
  'NI',
  'PK',
  'PH',
  'SA',
  'US',
];

// This is added to export files to indicate compatibility with future versions
// Export files from previous versions should always be compatible with new ones,
// but files generated from newer versions can break compatibility with previous
// versions.
export const EXPORT_VERSION_NUM = 1;

export const APP_STORE_LINK = Constants.manifest?.extra?.appStoreLink;
export const GOOGLE_PLAY_LINK = Constants.manifest?.extra?.googlePlayLink;

export const PRIVACY_POLICY_LINK = Constants.manifest?.extra?.privacyPolicyLink;
export const GITHUB_LINK = Constants.manifest?.extra?.githubLink;
export const GITHUB_PROFILE_LINK = Constants.manifest?.extra?.githubProfileLink;

export const SENTRY_DSN = Constants.manifest?.extra?.sentryDsn;

export const RELEASE_CODE = 'v1.4.0-1';
