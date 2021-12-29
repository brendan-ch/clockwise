import { useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as MobileNotifications from 'expo-notifications';

interface LocalNotification {
  scheduledDate?: Date,
  title: string,
  body?: string,
}

/**
 * Hook that enables the use of notifications on web and mobile.
 */
function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [canAskAgain, setCanAskAgain] = useState(true);

  // Track app background state to refresh permissionGranted and canAskAgain
  const [backgrounded, setBackgrounded] = useState(false);

  const os = Platform.OS;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      MobileNotifications.setNotificationHandler({
        handleNotification: async () => {
          // Enable this code to disable notifications while app is foregrounded
          if (!backgrounded) {
            return {
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: false,
            };
          }

          return {
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: false,
          };
        },
      });
    }
  }, []);

  // Add event listener to track background state
  useEffect(() => {
    AppState.addEventListener('change', (value) => {
      switch (value) {
        case 'active':
          setBackgrounded(false);
          break;
        case 'inactive':
        case 'background':
          setBackgrounded(true);
          break;
        default:
          setBackgrounded(false);
      }
    });

    return () => AppState.removeEventListener('change', () => {});
  }, []);

  useEffect(() => {
    // Don't check if backgrounded
    if (backgrounded) return;

    checkPermission();
  }, [backgrounded]);

  /**
   * Refresh the permission stored in local state.
   */
  async function checkPermission() {
    // Check whether permission status granted
    // Check the built-in Notification interface for web
    if (os === 'web' && Notification.permission === 'granted') {
      setPermissionGranted(true);
    // Otherwise check via MobileNotifications
    } else {
      const value = await MobileNotifications.getPermissionsAsync();
      setPermissionGranted(value.granted);
      setCanAskAgain(value.canAskAgain);
    }
  }

  async function requestPermission() {
    if (os === 'web') {
      const result = await Notification.requestPermission();
      setPermissionGranted(result === 'granted');
    } else if (canAskAgain) {
      const result = await MobileNotifications.requestPermissionsAsync();
      if (result.canAskAgain) {
        setPermissionGranted(result.granted);
      } else {
        setCanAskAgain(false);
      }
    } else {
      // Works only for iOS to open notification settings
      Linking.openURL('app-settings:');
    }
  }

  /**
   * Send a notification immediately (supported on web and mobile)
   * @param notification
   */
  async function sendNotification(notification: LocalNotification) {
    if (!permissionGranted) return;

    if (os === 'web') {
      /* eslint-disable-next-line */
      const notif = new Notification(notification.title, {
        body: notification.body,
      });
    } else {
      await MobileNotifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
        },
        trigger: null,
      });
    }
  }

  /**
   * Schedule a notification based on the `scheduledDate` provided.
   * Only works on mobile.
   * @param notification
   *
   * @returns The notification ID. If no scheduled date provided, returns '-1'.
   */
  async function scheduleNotification(notification: LocalNotification) {
    if (!notification.scheduledDate || os === 'web') return '-1';

    const id = await MobileNotifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
      },
      trigger: notification.scheduledDate,
    });

    return id;
  }

  /**
   * Cancel all scheduled notifications.
   */
  async function cancelAllNotifications() {
    await MobileNotifications.cancelAllScheduledNotificationsAsync();
  }

  return {
    requestPermission,
    sendNotification,
    scheduleNotification,
    permissionGranted,
    cancelAllNotifications,
  };
}

export default useNotifications;
