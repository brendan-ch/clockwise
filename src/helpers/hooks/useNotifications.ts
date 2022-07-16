import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as MobileNotifications from 'expo-notifications';
import { checkNotifications } from '../notification';

interface LocalNotification {
  scheduledDate?: Date,
  title: string,
  body?: string,
}

/**
 * Hook that enables the use of notifications on web and mobile.
 */
function useNotifications() {
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

  /**
   * Send a notification immediately (supported on web and mobile)
   * @param notification
   */
  async function sendNotification(notification: LocalNotification) {
    const { granted } = await checkNotifications();
    if (!granted) return;

    // Send notification to web/mobile
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
          vibrate: [0, 250, 250, 250],
          sound: true,
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
    const { granted } = await checkNotifications();
    if (!granted) return '-1';

    const id = await MobileNotifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        vibrate: [0, 250, 250, 0],
        sound: true,
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
    sendNotification,
    scheduleNotification,
    cancelAllNotifications,
  };
}

export default useNotifications;
