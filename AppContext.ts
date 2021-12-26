import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import { KeyboardShortcutGroup, Overlay, TimerState } from './src/types';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  timerState: TimerState,
  timeout?: number,
  mode: 'focus' | 'break',
  /* eslint-disable-next-line */
  handleStateSwitch: (newMode: 'focus' | 'break') => any,
  /* eslint-disable-next-line */
  overlay: Overlay,
  setOverlay: Dispatch<SetStateAction<any>>,
  keyboardGroup: KeyboardShortcutGroup,
  setKeyboardGroup: Dispatch<SetStateAction<KeyboardShortcutGroup>>,
  startTimer: () => any,
  stopTimer: () => any,
  pauseTimer: () => any,
  setPageTitle: Dispatch<SetStateAction<string>>,
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
  timeRemaining: 0,
  timerState: 'stopped',
  timeout: undefined,
  overlay: 'none',
  setOverlay: () => {},
  keyboardGroup: 'none',
  setKeyboardGroup: () => {},
  mode: 'focus',
  handleStateSwitch: () => {},
  startTimer: () => {},
  stopTimer: () => {},
  pauseTimer: () => {},
  setPageTitle: () => {},
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
