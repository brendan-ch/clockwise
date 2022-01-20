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

  // On web, determines if timer state changed from running -> stopped
  const [shouldSendNotification, setShouldSendNotification] = useState<boolean>(false);
  const [tempMode, setTempMode] = useState('focus');

  async function manageNotificationsWeb(timerState: TimerState) {
    if (Platform.OS !== 'web') return;
    const timerAlertsEnabled = await getData(ENABLE_TIMER_ALERTS);
    if (timerAlertsEnabled !== '1') return;

    if (timerState === 'running') {
      setShouldSendNotification(true);
      setTempMode(context.mode);
    } else if (
      timerState === 'stopped'
      && shouldSendNotification
      && context.mode !== tempMode) {
      // Send the notification
      sendNotification({
        title: `Time to ${context.mode === 'focus' ? 'focus' : 'take a break'}!`,
      });
    }
  }

  useEffect(() => {
    manageNotificationsWeb(context.timerState);
  }, [context.timerState]);

  async function manageNotifications(timerState: TimerState) {
    if (Platform.OS === 'web') return;
    const timerAlertsEnabled = settings[ENABLE_TIMER_ALERTS];
    if (!timerAlertsEnabled) {
      cancelAllNotifications();
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
    manageNotifications(context.timerState);
  }, [context.timerState, settings[ENABLE_TIMER_ALERTS]]);
}

export default useTimerNotification;
