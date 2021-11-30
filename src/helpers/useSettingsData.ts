import { useEffect, useState } from 'react';
import { SettingsData, SettingsOptionProps } from '../types';
import { getData, storeData } from './storage';

/**
 * Hook that manages initialization and updating of settings data.
 * @param initialData
 */
function useSettingsData(options: SettingsOptionProps[]) {
  const [settingsData, setSettingsData] = useState<SettingsData[]>([]);
  // Initialize using static options

  /**
   * Handle storing data and changing state.
   * @param key The storage key.
   * @param data
   */
  async function handleChange(key: string, data: number | boolean) {
    // Attempt to serialize data
    let convertedData: string;

    if (typeof data === 'number') {
      convertedData = `${data}`;
    } else if (typeof data === 'boolean') {
      convertedData = data ? '1' : '0';
    } else {
      return;
    }

    // Set in state
    const settingsIndex = settingsData.findIndex((value) => value.storageKey === key);
    if (settingsIndex > -1) {
      const modifiedSetting: SettingsData = {
        ...settingsData[settingsIndex],
        value: data,
      };

      const modifiedSettingsData = settingsData.slice();
      modifiedSettingsData[settingsIndex] = modifiedSetting;
      setSettingsData(modifiedSettingsData);

      // Update in storage
      await storeData(key, convertedData);
    }
  }

  /**
   * Set the settings data in state.
   */
  async function initializeSettingsData() {
    // Initialize settings data once
    // Subsequent changes to settings should also be made to settingsData state

    const settingsDataTemp: SettingsData[] = [];

    // Loop through static options and get data for each
    await Promise.all(options.map(async (option) => {
      const data = await getData(option.storageKey);
      let convertedData: number | boolean;

      switch (option.type) {
        case 'number':
          // Convert number to string
          convertedData = !Number.isNaN(Number(data)) ? Number(data) : 0;

          break;
        case 'toggle':
          // Convert numbers 0/1 to boolean
          convertedData = data === '1';

          break;
        default:
          // Populate with value of 0
          convertedData = 0;
      }

      settingsDataTemp.push({
        storageKey: option.storageKey,
        value: convertedData,
      });
    }));

    setSettingsData(settingsDataTemp);
  }

  useEffect(() => {
    initializeSettingsData();
  }, [options]);

  return { settingsData, handleChange };
}

export default useSettingsData;
