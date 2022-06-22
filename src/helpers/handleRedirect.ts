import { Platform } from 'react-native';
import {
  GITHUB_LINK, LICENSES_LINK, PRIVACY_POLICY_LINK, SUPPORT_LINK, WHATS_NEW,
} from '../Constants';
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
    case '/github':
      handleOpenLink(GITHUB_LINK, false);
      break;
    case '/support':
      handleOpenLink(SUPPORT_LINK, false);
      break;
    case '/licenses':
      handleOpenLink(LICENSES_LINK, false);
      break;
    case '/whats-new':
      handleOpenLink(WHATS_NEW, false);
      break;
    default:
      handleOpenLink('/', false);
      break;
  }
}

export default handleRedirect;
