import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

/**
 * Hook that changes state every time the time changes (every minute).
 * @param onUpdate
 */
function useTimeUpdates() {
  const [now, setNow] = useState(new Date());
  const [timeout, setTimeoutInState] = useState<any>();

  /**
   * Based on the app state, update the current time.
   * @param state
   */
  function updateCurrentTime(state: AppStateStatus) {
    switch (state) {
      case 'background':
      case 'inactive':
        // Stop updating (clear timeout)
        clearTimeout(timeout);
        break;
      case 'active':
        // Start updating again
        // Changing `now` will cause useEffect hook to re-run
        setNow(new Date());
        break;
      default:
        // Do something
        setNow(new Date());
    }
  }

  useEffect(() => {
    // Execute the callback every time `now` changes
    // Note: this will run when the hook is first called
    // Create another timeout
    let secondsRemaining = 60 - now.getSeconds();

    // If on Android, set a shorter timeout (~20 seconds)
    // See RN issue https://github.com/facebook/react-native/issues/12981
    if (Platform.OS === 'android') {
      secondsRemaining = Math.min(secondsRemaining, 20);
    }

    setTimeoutInState(setTimeout(() => {
      setNow(new Date());
    }, secondsRemaining * 1000 + 250));
    // Add 500 ms delay to execution

    if (Platform.OS !== 'web') {
      // Listen to background state
      AppState.addEventListener('change', updateCurrentTime);
    }

    return () => {
      clearTimeout(timeout);
      if (Platform.OS !== 'web') {
        AppState.removeEventListener('change', updateCurrentTime);
      }
    };
  }, [now]);

  return now;
}

export default useTimeUpdates;
