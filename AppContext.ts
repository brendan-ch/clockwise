import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import { Overlay, TimerState } from './src/types';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  setTimeRemaining: Dispatch<SetStateAction<number>>,
  timerState: TimerState,
  setTimerState: Dispatch<SetStateAction<TimerState>>,
  timeout?: number,
  setTimeoutState: Dispatch<SetStateAction<any>>,
  clearTimerInterval: () => any,
  overlay: Overlay,
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
  timeRemaining: 0,
  setTimeRemaining: () => {},
  timerState: 'stopped',
  setTimerState: () => {},
  timeout: undefined,
  setTimeoutState: () => {},
  clearTimerInterval: () => {},
  overlay: 'none',
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
