import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../../SettingsContext';
import { SettingsOptionProps, SettingsOptionPropsStatic } from '../../types';
import { getData, storeData } from '../storage';

/**
 * Hook that manages initialization and updating of settings data.
 * @param initialData
 */
function useSettingsData(options: SettingsOptionPropsStatic[]) {
  const [settingsData, setSettingsData] = useState<SettingsOptionProps[]>([]);
  // Force re-rendering of updated settings data
  const [renderCount, setRenderCount] = useState(0);

  const settings = useContext(SettingsContext);

  /**
   * Handle storing data
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

    // @ts-ignore
    if (settings[key] && settings.setSetting) {
      // Update the key
      settings.setSetting(key, data);
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
          if (option.validator) {
            const result = await option.validator(newData);
            if (!result) return;
          }
          // Serialize the data
          await handleChange(option.storageKey, newData);

          setRenderCount(renderCount === 0 ? 1 : 0);
        },
      });
    }));

    setSettingsData(settingsDataTemp);
  }

  useEffect(() => {
    // Load things from storage, and set item key for each option
    loadOptionsFromStorage();
  }, [options, renderCount]);

  return settingsData;
}

export default useSettingsData;
