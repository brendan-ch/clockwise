import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
// import AppContext from '../../AppContext';
import { TimerState } from '../types';
import calculateTimerDisplay from './calculateTimer';

/**
 * Hook that provides a method to set the page title. If timer is running,
 * sets the title to the time remaining, concatenated to the page title.
 */
function usePageTitle(initial: string, timeRemaining: number, timerState: TimerState) {
  // const { timeRemaining, timerState } = useContext(AppContext);
  const [pageTitle, setPageTitle] = useState(initial);

  useEffect(() => {
    // Run platform check
    if (Platform.OS !== 'web') {
      return;
    }

    if (timerState === 'running') {
      window.document.title = `${calculateTimerDisplay(timeRemaining)} | ${pageTitle}`;
    } else {
      window.document.title = pageTitle;
    }
  }, [timeRemaining, timerState, pageTitle]);

  return setPageTitle;
}

export default usePageTitle;