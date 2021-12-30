import { Platform } from 'react-native';
import * as MobileNotifications from 'expo-notifications';

async function requestNotifications() {
  if (Platform.OS === 'web') {
    const result = await Notification.requestPermission();
    return {
      granted: result === 'granted',
      canAskAgain: false,
    };
  }

  const result = await MobileNotifications.requestPermissionsAsync();
  return {
    granted: result.granted,
    canAskAgain: result.canAskAgain,
  };
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
      canAskAgain: true,
    };
  // Otherwise check via MobileNotifications
  }

  if (Platform.OS === 'web') {
    return {
      granted: false,
      canAskAgain: true,
    };
  }

  const value = await MobileNotifications.getPermissionsAsync();
  return {
    granted: value.granted,
    canAskAgain: value.canAskAgain,
  };
}

export { requestNotifications, checkNotifications };
