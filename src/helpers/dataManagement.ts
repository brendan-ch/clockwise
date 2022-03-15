import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  AUTO_APPEARANCE,
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
  SUPPRESS_INTRODUCTION, TASKS, _24_HOUR_TIME,
} from '../StorageKeys';
import { getData, removeData, storeData } from './storage';
import { Task } from '../types';
import generateTaskId from './generateId';
import { EXPORT_VERSION_NUM } from '../Constants';

// Read storage data
const keys = [
  FOCUS_TIME_MINUTES, BREAK_TIME_MINUTES, ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND, ENABLE_BACKGROUND, AUTO_APPEARANCE, DARK_MODE,
  SUPPRESS_INTRODUCTION, AUTO_START_BREAK, AUTO_START_FOCUS,
  _24_HOUR_TIME,
];

/**
 * Read the contens of a URI as text.
 * @param uri
 */
async function readDataFromUri(uri: string) {
  if (Platform.OS === 'web') {
    throw new Error('This function can only be called on mobile.');
  }

  const data = await FileSystem.readAsStringAsync(uri);
  return data;
}

/**
 * Read the contents of a file as text.
 * @param file
 */
function readDataWeb(file: File) {
  if (Platform.OS !== 'web') {
    throw new Error('This function can only be called on web.');
  }

  const promise: Promise<string> = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsText(file);
  });

  return promise;
}

/**
 * Prompt the user for a document, and write data
 * to storage.
 * @throws If file cannot be read, or file data is invalid.
 */
async function importData(overwriteTasks: boolean = false) {
  // Retrieve the file
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: 'application/json',
  });

  let data: string;
  if (result.type === 'success' && result.file && Platform.OS === 'web') {
    data = await readDataWeb(result.file);
  } else if (result.type === 'success' && Platform.OS !== 'web' && result.uri) {
    data = await readDataFromUri(result.uri);
  } else if (result.type === 'cancel') {
    throw new Error('User canceled file selection.');
  } else {
    throw new Error('Unable to read file.');
  }

  let parsed: any;

  // Validate the data
  try {
    parsed = JSON.parse(data);

    // Check if keys exist
    // These keys should be pre-populated on first app load
    const keysToValidate = [
      FOCUS_TIME_MINUTES,
      BREAK_TIME_MINUTES,
      AUTO_APPEARANCE,
    ];
    keysToValidate.forEach((key) => {
      if (!parsed[key]) {
        throw new Error('Invalid configuration.');
      }
    });
  } catch (e) {
    throw new Error('Invalid configuration.');
  }

  // Write to storage
  const importKeys = keys.slice();
  importKeys.push(TASKS);

  try {
    await Promise.all(importKeys.map(async (key) => {
      if (parsed[key] && key === TASKS && !overwriteTasks) {
        // Append to existing tasks
        const existing = await getData(TASKS);
        if (!existing) {
          await storeData(TASKS, parsed[key]);
        } else {
          // Merge tasks
          const decoded: Task[] = JSON.parse(existing);
          const toMerge: Task[] = JSON.parse(parsed[key]);
          await Promise.all(toMerge.map(async (value) => {
            // Regenerate task ID
            const id = await generateTaskId();
            decoded.push({
              ...value,
              id,
            });
          }));

          // Write to storage
          storeData(TASKS, JSON.stringify(decoded));
        }
      } else if (parsed[key]) {
        await storeData(key, parsed[key]);
      } else if (key !== TASKS || overwriteTasks) {
        // Remove data key from storage
        await removeData(key);
      }
    }));
  } catch (e) {
    throw new Error('An unknown error occurred.');
  }
}

/**
 * On web, prompts the user to save a file with the given
 * data to their computer.
 * @param data
 */
function downloadWeb(data: string): void {
  if (Platform.OS !== 'web') {
    throw new Error('This function can only be called on web.');
  }
  const filename = 'clockwise-config.json';

  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * On mobile, saves the file to the app's cache directory,
 * and prompts user to save it using share menu.
 * @param data
 */
async function downloadMobile(data: string) {
  const filename = 'clockwise-config.json';
  const path = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(path, data);

  // Share the file
  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(path);
  }
}

/**
 * Read storage data and prompt the user to save a file.
 * @param withTasks Indicate whether to export tasks.
 */
async function exportData(withTasks: boolean = false) {
  const exportKeys = keys.slice();

  if (withTasks) {
    exportKeys.push(TASKS);
  }

  // Store data
  const data = {
    version: EXPORT_VERSION_NUM,
  };

  await Promise.all(exportKeys.map(async (item) => {
    const storageData = await getData(item);
    if (storageData) {
      // @ts-ignore
      data[item] = storageData;
    }
  }));

  // Convert to JSON
  const json = JSON.stringify(data);

  if (Platform.OS === 'web') {
    downloadWeb(json);
  } else {
    downloadMobile(json);
  }
}

export { exportData, importData };
