import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
/**
 * Open the link in the in-app web browser, or redirect
 * to it on web.
 * @param link
 * @param newTab
 */
async function handleOpenLink(link: string, newTab = true) {
  if (Platform.OS === 'web' && newTab) {
    window.open(link, '_blank');
  } else if (Platform.OS === 'web') {
    window.location.href = link;
  } else {
    await WebBrowser.openBrowserAsync(link, {
      enableBarCollapsing: true,
    });
  }
}

export default handleOpenLink;
