import AsyncStorage from '@react-native-async-storage/async-storage';
import { BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES } from '../StorageKeys';

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

export { storeData, getData, getTimerValue };
