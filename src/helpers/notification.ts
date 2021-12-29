import { Platform } from 'react-native';
import * as MobileNotifications from 'expo-notifications';

async function requestNotifications() {
  if (Platform.OS === 'web') {
    const result = await Notification.requestPermission();
    return result;
  }

  const result = await MobileNotifications.requestPermissionsAsync();
  return result.granted;
}

/**
 * Return whether notification permission has been granted.
 */
async function checkNotifications() {
  // Check whether permission status granted
  // Check the built-in Notification interface for web
  if (Platform.OS === 'web' && Notification.permission === 'granted') {
    return {
      granted: true,
      canAskAgain: false,
    };
  // Otherwise check via MobileNotifications
  }

  if (Platform.OS === 'web') {
    return {
      granted: false,
      canAskAgain: false,
    };
  }

  const value = await MobileNotifications.getPermissionsAsync();
  return {
    granted: value.granted,
    canAskAgain: value.canAskAgain,
  };
}

export { requestNotifications, checkNotifications };
