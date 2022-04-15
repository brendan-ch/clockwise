import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../../SettingsContext';
import { SettingsOptionProps, SettingsOptionPropsStatic } from '../../types';
import { getData, storeData } from '../storage';
import handleHaptic from '../handleHaptic';

/**
 * Hook that manages initialization of settings data.
 * @param initialData
 */
function useSettingsData(options: SettingsOptionPropsStatic[]) {
  const [settingsData, setSettingsData] = useState<SettingsOptionProps[]>([]);

  // Global settings
  const settings = useContext(SettingsContext);

  /**
   * Handle storing data
   * @param key The storage key or item index in the array.
   * If an index is provided, it's assumed that the options array has
   * a matching item at index.
   * @param data
   */
  async function handleChange(key: string | number, data: number | boolean | string) {
    // Haptic feedback
    if (typeof data === 'boolean') {
      handleHaptic('selection');
    }

    const matchingOption = typeof key === 'number' ? options[key] : options.find((value) => value.storageKey === key);
    if (!matchingOption) return;

    // Set in state
    const settingsIndex = typeof key === 'number' ? key : settingsData.findIndex(
      (value) => matchingOption?.title === value.title,
    );

    if (settingsIndex > -1) {
      const modifiedSetting: SettingsOptionProps = {
        ...settingsData[settingsIndex],
        value: data,
      };

      const modifiedSettingsData = settingsData.slice();
      modifiedSettingsData[settingsIndex] = modifiedSetting;
      setSettingsData(modifiedSettingsData);

      // Update in storage
    }

    // Attempt to serialize data
    let convertedData: string;

    if (typeof data === 'number') {
      convertedData = `${data}`;
    } else if (typeof data === 'boolean') {
      convertedData = data ? '1' : '0';
    } else if (typeof data === 'string') {
      convertedData = data;
    } else {
      return;
    }

    // Set data in storage
    await storeData(matchingOption.storageKey, convertedData);

    // Reactive settings
    // Update in global state for other components to update
    // @ts-ignore
    if (settings[matchingOption.storageKey] !== undefined && settings.setSetting) {
      // Update the key
      settings.setSetting(matchingOption.storageKey, data);
    }
  }

  /**
   * Load the settings options from local storage.
   * This should only be used for initializing the settings.
   */
  async function loadOptionsFromStorage() {
    const settingsDataTemp: SettingsOptionProps[] = [];

    await Promise.all(options.map(async (option) => {
      const data = await getData(option.storageKey);
      let convertedData: number | boolean | string;

      switch (option.type) {
        case 'number':
          // Convert number to string
          convertedData = !Number.isNaN(Number(data)) ? Number(data) : 0;

          break;
        case 'toggle':
          // Convert numbers 0/1 to boolean
          convertedData = data === '1';

          break;
        case 'selection':
          // Read data as string
          convertedData = data !== null ? data : '';
          break;
        default:
          // Populate with value of 0
          convertedData = 0;
      }

      settingsDataTemp.push({
        ...option,
        value: convertedData,
      });
    }));

    setSettingsData(settingsDataTemp);
  }

  useEffect(() => {
    // Load things from storage, and set item key for each option
    loadOptionsFromStorage();
  }, [options]);

  return { settingsData, handleChange };
}

export default useSettingsData;
