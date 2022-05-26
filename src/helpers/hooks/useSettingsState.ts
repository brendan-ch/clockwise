import { useState } from 'react';
import * as Localization from 'expo-localization';

import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  _24_HOUR_TIME,
} from '../../StorageKeys';
import { DefaultSettingsState } from '../../types';
import { REGIONS_WITH_12H_TIME } from '../../Constants';

function useSettingsState() {
  // Initialize settings state here
  const [settings, setSettings] = useState<DefaultSettingsState>({
    [ENABLE_TIMER_ALERTS]: false,
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

  return { settings, setSettings, setSetting };
}

export default useSettingsState;
