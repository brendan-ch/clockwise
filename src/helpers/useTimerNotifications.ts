import { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppContext from '../../AppContext';
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
    permissionGranted,
    cancelAllNotifications,
  } = useNotifications();

  // On web, determines if timer state changed from running -> stopped
  const [shouldSendNotification, setShouldSendNotification] = useState<boolean>(false);
  const [tempMode, setTempMode] = useState('focus');
  useEffect(() => {
    if (Platform.OS !== 'web' || !permissionGranted) return;

    if (context.timerState === 'running') {
      setShouldSendNotification(true);
      setTempMode(context.mode);
    } else if (
      context.timerState === 'stopped'
      && shouldSendNotification
      && context.mode !== tempMode) {
      // Send the notification
      sendNotification({
        title: `Time to ${context.mode === 'focus' ? 'focus' : 'take a break'}!`,
      });
    }
  }, [context.timerState]);

  // Hook to handle notification scheduling on mobile
  useEffect(() => {
    if (Platform.OS === 'web' || !permissionGranted) return;

    if (context.timerState === 'running') {
      scheduleNotification({
        title: `Time to ${context.mode === 'focus' ? 'take a break' : 'focus'}!`,
        scheduledDate: new Date(Date.now() + context.timeRemaining),
      });
    } else {
      cancelAllNotifications();
    }
  }, [context.timerState]);
}

export default useTimerNotification;
