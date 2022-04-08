import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { REGIONS_WITH_12H_TIME } from '../Constants';
import {
  AUTO_APPEARANCE,
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  AUTO_START_TIMERS,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  MODE,
  START,
  SUPPRESS_INTRODUCTION,
  TASKS,
  _24_HOUR_TIME,
} from '../StorageKeys';

/**
 * Retrieve the relevant timer value from AsyncStorage, if existent.
 */
async function getTimerValue(state: 'break' | 'focus') {
  const timerValue = await getData(state === 'break' ? BREAK_TIME_MINUTES : FOCUS_TIME_MINUTES);
  if (!timerValue) return undefined;

  return timerValue;
}

async function storeData(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

async function getData(key: string) {
  const data = await AsyncStorage.getItem(key);
  return data;
}

async function removeData(key: string) {
  await AsyncStorage.removeItem(key);
}

/**
 * Clear all storage keys from storage.
 */
async function clearAll() {
  const keys = [
    AUTO_APPEARANCE,
    FOCUS_TIME_MINUTES,
    BREAK_TIME_MINUTES,
    ENABLE_BACKGROUND,
    ENABLE_TIMER_SOUND,
    ENABLE_TIMER_ALERTS,
    DARK_MODE,
    SUPPRESS_INTRODUCTION,
    AUTO_START_TIMERS,
    TASKS,
    START,
    MODE,
    AUTO_START_BREAK,
    AUTO_START_FOCUS,
  ];

  await Promise.all(keys.map(async (value) => {
    await removeData(value);
  }));
}

/**
 * Prefill some settings values on first-time app launch.
 */
async function prefillSettings() {
  const { region } = Localization;

  // Check if each key exists, and write to storage if it doesn't
  const defaultSettings = {
    [BREAK_TIME_MINUTES]: '5',
    [FOCUS_TIME_MINUTES]: '25',
    [LONG_BREAK_TIME_MINUTES]: '25',
    [LONG_BREAK_ENABLED]: '1',
    [LONG_BREAK_INTERVAL]: '4',
    [ENABLE_BACKGROUND]: '1',
    [AUTO_APPEARANCE]: '1',
    [_24_HOUR_TIME]: !(region && REGIONS_WITH_12H_TIME.includes(region)) ? '1' : '0',
  };

  await Promise.all(Object.keys(defaultSettings).map(async (key) => {
    const data = await getData(key);
    if (data === null) {
      // Fill default setting
      // @ts-ignore
      await storeData(key, defaultSettings[key]);
    }
  }));
}

export {
  storeData, getData, getTimerValue, removeData, prefillSettings, clearAll,
};
