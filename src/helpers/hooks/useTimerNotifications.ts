import { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppContext from '../../../AppContext';
import SettingsContext from '../../../SettingsContext';
import { ENABLE_TIMER_ALERTS } from '../../StorageKeys';
import { TimerState } from '../../types';
import { getData } from '../storage';
import useNotifications from './useNotifications';

/**
 * Hook for timer notification management. Calls the `useNotifications` hook.
 */
function useTimerNotification() {
  const context = useContext(AppContext);
  const {
    // requestPermission,
    sendNotification,
    scheduleNotification,
    cancelAllNotifications,
  } = useNotifications();

  const settings = useContext(SettingsContext);

  const [scheduled, setScheduled] = useState(false);

  /**
   * Send a notification on web.
   * @param newMode
   */
  async function sendNotificationWeb(newMode: 'focus' | 'break') {
    if (Platform.OS !== 'web') return;
    const timerAlertsEnabled = await getData(ENABLE_TIMER_ALERTS);
    if (timerAlertsEnabled !== '1') return;

    // Send the notification
    sendNotification({
      title: `Time to ${newMode === 'focus' ? 'focus' : 'take a break'}!`,
    });
  }

  useEffect(() => {
    if (context.timeRemaining < 0) {
      // Send a notification on web
      sendNotificationWeb(context.mode === 'focus' ? 'break' : 'focus');
    }
  }, [context.timeRemaining]);

  async function manageNotifications(timerState: TimerState) {
    if (Platform.OS === 'web') return;
    const timerAlertsEnabled = settings[ENABLE_TIMER_ALERTS];
    if (!timerAlertsEnabled) {
      cancelAllNotifications();
      setScheduled(false);
      return;
    }

    if (timerState === 'running' && !scheduled) {
      scheduleNotification({
        title: `Time to ${context.mode === 'focus' ? 'take a break' : 'focus'}!`,
        body: `Tap here to ${context.mode === 'focus' ? 'plan your next session' : 'start your next session'}.`,
        scheduledDate: new Date(Date.now() + context.timeRemaining),
      });

      setScheduled(true);
    } else if (timerState !== 'running' && !context.timerBackgrounded) {
      cancelAllNotifications();
      setScheduled(false);
    }
  }

  // Hook to handle notification scheduling on mobile
  useEffect(() => {
    if (context.timeRemaining < 0) {
      setScheduled(false);
    }

    manageNotifications(context.timerState);
  }, [context.timerState, context.timeRemaining, settings[ENABLE_TIMER_ALERTS]]);
}

export default useTimerNotification;
