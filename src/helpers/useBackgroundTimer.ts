import {
  useContext, useEffect, useState,
} from 'react';
import { AppState, Platform } from 'react-native';
import AppContext from '../../AppContext';
import {
  ENABLE_BACKGROUND_TIMER, MODE, START, TIMER_LENGTH,
} from '../StorageKeys';
import { getData, removeData, storeData } from './storage';
/**
 * Hook that enables timer handling based on background states.
 * Only works on mobile.
 */
function useBackgroundTimer() {
  // Stores whether timer is running when backgrounded
  const [enabled, setEnabled] = useState(false);
  const [backgroundState, setBackgroundState] = useState<'active' | 'inactive' | 'background'>('active');

  const context = useContext(AppContext);

  useEffect(() => {
    setEnabledFromStorage();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' || !enabled) return () => {};

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
  }, [enabled]);

  /**
   * Enable this hook based on the ENABLE_BACKGROUND_TIMER setting.
   */
  async function setEnabledFromStorage() {
    const enabledSetting = await getData(ENABLE_BACKGROUND_TIMER);
    setEnabled(enabledSetting === '1');
  }

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
    if (Platform.OS === 'web' || !enabled) return;

    if (backgroundState === 'active') {
      setTimerFromStorage();
    } else if (context.timerLength && context.start) {
      storeTimerData(context.start, context.timerLength);
    }
  }, [backgroundState, context.timerLength, context.start]);
}

export default useBackgroundTimer;
