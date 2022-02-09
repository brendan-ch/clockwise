import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTO_APPEARANCE, BREAK_TIME_MINUTES, ENABLE_BACKGROUND, FOCUS_TIME_MINUTES,
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
 * Prefill some settings values on first-time app launch.
 */
async function prefillSettings() {
  // Check if each key exists, and write to storage if it doesn't
  const defaultSettings = {
    [BREAK_TIME_MINUTES]: '5',
    [FOCUS_TIME_MINUTES]: '25',
    [ENABLE_BACKGROUND]: '1',
    [AUTO_APPEARANCE]: '1',
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
  storeData, getData, getTimerValue, removeData, prefillSettings,
};
