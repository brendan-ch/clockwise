import {
  useContext, useEffect, useState,
} from 'react';
import { AppState } from 'react-native';
import AppContext from '../../AppContext';
import { MODE, START, TIMER_LENGTH } from '../StorageKeys';
import { getData, removeData, storeData } from './storage';

// interface ContextSubset {
//   setMode: Dispatch<SetStateAction<'focus' | 'break'>>,
//   setTimerState: Dispatch<SetStateAction<TimerState>>,
//   timerState: TimerState,
// }

/**
 * Hook that enables timer handling based on background states.
 * Only works on mobile.
 */
function useBackgroundTimer() {
  // Stores whether timer is running when backgrounded
  // const [backgrounded, setBackgrounded] = useState(false);
  const [backgroundState, setBackgroundState] = useState<'active' | 'inactive' | 'background'>('active');

  const context = useContext(AppContext);

  useEffect(() => {
    AppState.addEventListener('change', async (state) => {
      switch (state) {
        case 'active':
          setBackgroundState('active');
          break;
        case 'background':
          setBackgroundState('background');
          break;
        case 'inactive':
          setBackgroundState('inactive');
          break;
        default:
          setBackgroundState('background');
      }
    });

    return () => AppState.removeEventListener('change', () => {});
  });

  /**
   * Store the current timer data into storage, and pause the timer.
   */
  async function storeTimerData(start: number, timerLength: number) {
    // Store timer data
    storeData(START, `${start}`);
    storeData(TIMER_LENGTH, `${timerLength}`);
    storeData(MODE, context.mode);

    // Pause the timer
    context.pauseTimer();
  }

  /**
   * Restore the timer from storage, and clear the storage.
   * @returns
   */
  async function setTimerFromStorage() {
    // Restore timer state
    const newStartRaw = await getData(START);
    const newTimerLengthRaw = await getData(TIMER_LENGTH);
    const mode = await getData(MODE);

    if (!newStartRaw || !newTimerLengthRaw || !mode) return;

    const newStart = Number(newStartRaw);
    const newTimerLength = Number(newTimerLengthRaw);
    const newTimeRemaining = (newStart + newTimerLength) - Date.now();

    if (newTimeRemaining > 0) {
      context.startTimer(newTimeRemaining);

      context.setMode(mode === 'focus' ? 'focus' : 'break');
    } else {
      context.handleStateSwitch(mode === 'focus' ? 'break' : 'focus');
    }

    removeData(START);
    removeData(TIMER_LENGTH);
    removeData(MODE);
  }

  useEffect(() => {
    if (backgroundState === 'active') {
      setTimerFromStorage();
    } else if (context.timerLength && context.start) {
      storeTimerData(context.start, context.timerLength);
    }
  }, [backgroundState, context.timerLength, context.start]);

  // useEffect(() => {
  //   if (Platform.OS === 'web') return () => {};

  //   AppState.addEventListener('change', async (state) => {
  //     if (state === 'active' && backgrounded) {
  //       setBackgrounded(false);
  //       console.log('App state active');

  //       // Restore timer state
  //       const newStartRaw = await getData(START);
  //       const newTimerLengthRaw = await getData(TIMER_LENGTH);
  //       const mode = await getData(MODE);

  //       if (!newStartRaw || !newTimerLengthRaw || !mode) return;

  //       console.log('Setting from storage');

  //       const newStart = Number(newStartRaw);
  //       const newTimerLength = Number(newTimerLengthRaw);
  //       const newTimeRemaining = (newStart + newTimerLength) - Date.now();

  //       if (newTimeRemaining > 0) {
  //         context.setTimeRemaining(newTimeRemaining);
  //         context.startTimer();

  //         context.setMode(mode === 'focus' ? 'focus' : 'break');
  //       } else {
  //         context.setMode(mode === 'focus' ? 'break' : 'focus');
  //       }

  //       removeData(START);
  //       removeData(TIMER_LENGTH);
  //       removeData(MODE);
  //     } else if (state === 'background' && context.timerState === 'running') {
  //       console.log('App state background');
  //       setBackgrounded(true);

  //       // Store timer data
  //       storeData(START, `${context.start}`);
  //       storeData(TIMER_LENGTH, `${context.timerLength}`);
  //       storeData(MODE, context.mode);

  //       // Pause the timer
  //       context.pauseTimer();
  //     }
  //   });

  // return () => AppState.removeEventListener('change', () => {});
  // }, [context.timeout, backgrounded, context.timerState]);

  // Add listener for background events
  // useEffect(() => {
  //   if (Platform.OS === 'web') return;

  //   if (context.timerLength && context.start && context.timerState === 'running') {
  //     console.log('Setting storage data');
  //     // Store timer data
  //     storeData(START, `${context.start}`);
  //     storeData(TIMER_LENGTH, `${context.timerLength}`);
  //     storeData(MODE, context.mode);
  //   } else {
  //     console.log('Removing storage data');
  //     // Clear timer data
  //     removeData(START);
  //     removeData(TIMER_LENGTH);
  //     removeData(MODE);
  //   }
  // }, [context.timerState, context.timerLength, context.start]);
}

export default useBackgroundTimer;
