import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
/**
 * Open the link in the in-app web browser, or
 * a new tab on web.
 * @param link
 */
async function handleOpenLink(link: string) {
  if (Platform.OS === 'web') {
    await Linking.openURL(link);
  } else {
    await WebBrowser.openBrowserAsync(link, {
      enableBarCollapsing: true,
    });
  }
}

export default handleOpenLink;
