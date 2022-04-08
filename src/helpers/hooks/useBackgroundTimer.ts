import {
  useContext, useEffect, useState,
} from 'react';
import { AppState, Platform } from 'react-native';
import AppContext from '../../../AppContext';
import {
  MODE, SELECTED, SESSION_NUM, START, TIMER_LENGTH,
} from '../../StorageKeys';
import { getData, removeData, storeData } from '../storage';
/**
 * Hook that enables timer handling based on background states.
 * Only works on mobile.
 */
function useBackgroundTimer() {
  // Stores whether timer is running when backgrounded
  const [backgroundState, setBackgroundState] = useState<'active' | 'inactive' | 'background'>('active');
  const [lastActive, setLastActive] = useState<Date | undefined>();

  const context = useContext(AppContext);

  useEffect(() => {
    if (Platform.OS === 'web') return () => {};

    AppState.addEventListener('change', async (state) => {
      switch (state) {
        case 'active':
          // console.log('active');
          setBackgroundState('active');
          setLastActive(new Date());
          break;
        case 'background':
          // console.log('background');
          setBackgroundState('background');
          break;
        case 'inactive':
          // console.log('inactive');
          setBackgroundState('inactive');
          break;
        default:
          setBackgroundState('background');
      }
    });

    return () => AppState.removeEventListener('change', () => {});
  }, []);

  /**
   * Store the current timer data into storage, and pause the timer.
   */
  async function storeTimerData(start: number, timerLength: number) {
    // Store timer data
    storeData(START, `${start}`);
    storeData(TIMER_LENGTH, `${timerLength}`);
    storeData(MODE, context.mode);
    storeData(SELECTED, JSON.stringify(context.selected));
    storeData(SESSION_NUM, `${context.currentSessionNum}`);

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
    const selectedRaw = await getData(SELECTED);
    const sessionNum = await getData(SESSION_NUM);

    if (!newStartRaw || !newTimerLengthRaw || !mode || !selectedRaw || !sessionNum) return;
    if (!(mode === 'focus' || mode === 'break' || mode === 'longBreak')) {
      return;
    }

    const newStart = Number(newStartRaw);
    const newTimerLength = Number(newTimerLengthRaw);
    const newTimeRemaining = (newStart + newTimerLength) - Date.now();
    const selected = JSON.parse(selectedRaw);
    const newSessionNum = Number(sessionNum);

    context.startTimer(newTimeRemaining);
    context.setMode(mode);
    context.setSelected(selected);
    context.setCurrentSessionNum(newSessionNum);
  }

  /**
   * Remove timer data from storage.
   */
  async function removeTimerData() {
    await removeData(START);
    await removeData(TIMER_LENGTH);
    await removeData(MODE);
    await removeData(SELECTED);
    await removeData(SESSION_NUM);
  }

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const now = Date.now();

    if (backgroundState === 'active') {
      // If state is active when timer state changes
      setTimerFromStorage()
        // Ensure that data is removed
        .then(() => removeTimerData())
        .then(() => context.setTimerBackgrounded(false));
    } else if (context.timerLength
      && context.start
      // Workaround: AppState is bugged, sends active event when pulling down
      // notification screen on iOS
      // Compare last active time and inactive event before storing timer data
      && (
        (backgroundState === 'inactive' && (!lastActive || now - lastActive.getTime() > 200))
        || backgroundState === 'background'
      )
    ) {
      // If timer is running and backgrounded
      storeTimerData(context.start, context.timerLength);
      context.setTimerBackgrounded(true);
    }
  }, [backgroundState, context.timerLength, context.start]);
}

export default useBackgroundTimer;
