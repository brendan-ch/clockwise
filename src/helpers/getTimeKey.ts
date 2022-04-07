import {
  BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES, LONG_BREAK_TIME_MINUTES,
} from '../StorageKeys';
import { TimerMode } from '../types';

/**
   * Based on the mode provided, return the correct time storage key.
   * @param mode
   */
function getTimeKey(newMode: TimerMode) {
  let timeKey = FOCUS_TIME_MINUTES;
  if (newMode === 'break') {
    timeKey = BREAK_TIME_MINUTES;
  } else if (newMode === 'longBreak') {
    timeKey = LONG_BREAK_TIME_MINUTES;
  }

  return timeKey;
}

export default getTimeKey;
