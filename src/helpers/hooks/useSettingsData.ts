import { useEffect, useState } from 'react';
import { SettingsOptionProps, SettingsOptionPropsStatic } from '../../types';
import { getData, storeData } from '../storage';

/**
 * Hook that manages initialization and updating of settings data.
 * @param initialData
 */
function useSettingsData(options: SettingsOptionPropsStatic[]) {
  const [settingsData, setSettingsData] = useState<SettingsOptionProps[]>([]);

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

    // Set data in storage
    await storeData(key, convertedData);

    // Set data in state
    const settingsIndex = settingsData.findIndex(
      (value) => value.title === options.find((option) => option.storageKey === key)?.title,
    );

    if (settingsIndex > -1) {
      const modifiedSetting: SettingsOptionProps = {
        ...settingsData[settingsIndex],
        value: data,
      };

      const modifiedSettingsData = settingsData.slice();
      modifiedSettingsData[settingsIndex] = modifiedSetting;
      setSettingsData(modifiedSettingsData);
    }
  }

  /**
   * Load the settings options from local storage.
   */
  async function loadOptionsFromStorage() {
    const settingsDataTemp: SettingsOptionProps[] = [];

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
        ...option,
        value: convertedData,
        onChange: async (newData: any) => {
          // Serialize the data
          await handleChange(option.storageKey, newData);
        },
      });
    }));

    setSettingsData(settingsDataTemp);
  }

  useEffect(() => {
    // Load things from storage, and set item key for each option
    loadOptionsFromStorage();
  }, [options]);

  return settingsData;
}

export default useSettingsData;
