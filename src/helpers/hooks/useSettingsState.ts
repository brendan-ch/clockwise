import { useEffect, useState } from 'react';
import * as Localization from 'expo-localization';

import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  EXPORT_VERSION_KEY,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  _24_HOUR_TIME,
} from '../../StorageKeys';
import { DefaultSettingsState } from '../../types';
import { EXPORT_VERSION_NUM, REGIONS_WITH_12H_TIME } from '../../Constants';
import { getData, prefillSettings, storeData } from '../storage';

function useSettingsState() {
  // Initialize settings state here
  const [settings, setSettings] = useState<DefaultSettingsState>({
    [ENABLE_TIMER_ALERTS]: false,
    [ENABLE_TIMER_SOUND]: false,
    [FOCUS_TIME_MINUTES]: 25,
    [BREAK_TIME_MINUTES]: 5,
    [LONG_BREAK_ENABLED]: true,
    [LONG_BREAK_TIME_MINUTES]: 15,
    [LONG_BREAK_INTERVAL]: 4,
    [ENABLE_BACKGROUND]: false,
    [AUTO_APPEARANCE]: true,
    [DARK_MODE]: false,
    [_24_HOUR_TIME]: !(Localization.region && REGIONS_WITH_12H_TIME.includes(Localization.region)),
  });

  /**
   * Update a setting in the settings state.
   * @param key
   * @param value
   *
   * @todo Validate that key exists before setting.
   */
  function setSetting(key: string, value: boolean | number | string) {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  /**
   * Load the settings data specified in the `settings` state.
   */
  async function initializeSettingsData() {
    const temp: DefaultSettingsState = {
      ...settings,
    };

    await Promise.all(Object.keys(settings).map(async (key) => {
      // Load the data
      const data = await getData(key);
      if (!data) return;
      // @ts-ignore
      const type = typeof temp[key];

      if (type === 'number') {
        // Convert the data
        // @ts-ignore
        temp[key] = !Number.isNaN(Number(data)) ? Number(data) : temp[key];
      } else if (type === 'boolean') {
        // @ts-ignore
        temp[key] = data === '1';
      }
    }));

    setSettings(temp);
  }

  useEffect(() => {
    // To-do: add data migration
    prefillSettings()
      .then(() => storeData(EXPORT_VERSION_KEY, `${EXPORT_VERSION_NUM}`))
      .then(() => initializeSettingsData());
  }, []);

  return { settings, setSettings, setSetting };
}

export default useSettingsState;
