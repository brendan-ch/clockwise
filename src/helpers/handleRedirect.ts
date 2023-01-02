import { Platform } from 'react-native';
import handleOpenLink from './handleOpenLink';

/**
 * Handle redirects based on the provided path string.
 */
function handleRedirect() {
  if (Platform.OS !== 'web') return;

  // Check URL path
  switch (window.location.pathname) {
    default:
      handleOpenLink('/', false);
      break;
  }
}

export default handleRedirect;
