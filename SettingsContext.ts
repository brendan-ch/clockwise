import React from 'react';
import {
  BREAK_TIME_MINUTES, ENABLE_BACKGROUND, ENABLE_TIMER_ALERTS, FOCUS_TIME_MINUTES,
} from './src/StorageKeys';
import { DefaultSettingsState } from './src/types';

const defaultSettingsState: DefaultSettingsState = {
  [ENABLE_TIMER_ALERTS]: false,
  [FOCUS_TIME_MINUTES]: 25,
  [BREAK_TIME_MINUTES]: 5,
  [ENABLE_BACKGROUND]: true,
};

const SettingsContext = React.createContext(defaultSettingsState);
export default SettingsContext;
