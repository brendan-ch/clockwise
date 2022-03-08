import React from 'react';
import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  FOCUS_TIME_MINUTES,
  _24_HOUR_TIME,
} from './src/StorageKeys';
import { DefaultSettingsState } from './src/types';

const defaultSettingsState: DefaultSettingsState = {
  [ENABLE_TIMER_ALERTS]: false,
  [FOCUS_TIME_MINUTES]: 25,
  [BREAK_TIME_MINUTES]: 5,
  [ENABLE_BACKGROUND]: true,
  [AUTO_APPEARANCE]: true,
  [DARK_MODE]: false,
  [_24_HOUR_TIME]: true,
};

const SettingsContext = React.createContext(defaultSettingsState);
export default SettingsContext;
