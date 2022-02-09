import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Get a base URL for interacting with endpoints.
 */
function getBaseURL() {
  if (Constants.manifest?.extra?.prodBuild && Platform.OS !== 'web') {
    return Constants.manifest.extra?.prodBuild as string;
  }

  return '';
}

export default getBaseURL;
