import { Platform } from 'react-native';
import { GITHUB_LINK, PRIVACY_POLICY_LINK } from '../Constants';
import handleOpenLink from './handleOpenLink';

/**
 * Handle redirects based on the provided path string.
 */
function handleRedirect() {
  if (Platform.OS !== 'web') return;

  // Check URL path
  switch (window.location.pathname) {
    case '/privacy':
      handleOpenLink(PRIVACY_POLICY_LINK, false);
      break;
    case '/licenses':
      handleOpenLink(GITHUB_LINK, false);
      break;
    // case '/support':
    default:
      break;
  }
}

export default handleRedirect;
