import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import { TimerState } from './src/types';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  setTimeRemaining: Dispatch<SetStateAction<number>>,
  timerState: TimerState,
  setTimerState: Dispatch<SetStateAction<TimerState>>,
  timeout?: NodeJS.Timeout,
  setTimeoutState: Dispatch<SetStateAction<NodeJS.Timeout | undefined>>,
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
  timeRemaining: 0,
  setTimeRemaining: () => {},
  timerState: 'stopped',
  setTimerState: () => {},
  timeout: undefined,
  setTimeoutState: () => {},
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
