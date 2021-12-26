import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import { KeyboardShortcutGroup, Overlay, TimerState } from './src/types';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  // setTimeRemaining: Dispatch<SetStateAction<number>>,
  timerState: TimerState,
  // setTimerState: Dispatch<SetStateAction<TimerState>>,
  timeout?: number,
  // setTimeoutState: Dispatch<SetStateAction<any>>,
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
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
  timeRemaining: 0,
  // setTimeRemaining: () => {},
  timerState: 'stopped',
  // setTimerState: () => {},
  timeout: undefined,
  // setTimeoutState: () => {},
  overlay: 'none',
  setOverlay: () => {},
  keyboardGroup: 'none',
  setKeyboardGroup: () => {},
  mode: 'focus',
  handleStateSwitch: () => {},
  startTimer: () => {},
  stopTimer: () => {},
  pauseTimer: () => {},
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
