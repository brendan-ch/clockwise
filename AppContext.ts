import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import {
  KeyboardShortcutGroup, Overlay, TimerState,
} from './src/types';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  timerState: TimerState,
  timeout?: number,
  mode: 'focus' | 'break',
  /* eslint-disable-next-line */
  setMode: (newMode: 'focus' | 'break') => any,
  /* eslint-disable-next-line */
  handleStateSwitch: (newMode: 'focus' | 'break', isLongBreak?: boolean) => any,
  /* eslint-disable-next-line */
  overlay: Overlay,
  setOverlay: Dispatch<SetStateAction<any>>,
  keyboardGroup: KeyboardShortcutGroup,
  setKeyboardGroup: Dispatch<SetStateAction<KeyboardShortcutGroup>>,
  /* eslint-disable-next-line */
  startTimer: (customTimerValue?: number) => any,
  stopTimer: () => any,
  /* eslint-disable-next-line */
  pauseTimer: (background?: boolean) => any,
  setPageTitle: Dispatch<SetStateAction<string>>,
  setTimeRemaining: Dispatch<SetStateAction<number>>,
  start?: number,
  timerLength?: number,
  timerBackgrounded: boolean,
  setTimerBackgrounded: Dispatch<SetStateAction<boolean>>,
  selected: number[],
  setSelected: Dispatch<SetStateAction<number[]>>,
  /**
   * Tracks the number of sessions since app open.
   */
  currentSessionNum: number,
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
  setTimeRemaining: () => {},
  setMode: () => {},
  timerBackgrounded: false,
  setTimerBackgrounded: () => {},
  selected: [],
  setSelected: () => {},
  currentSessionNum: 0,
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
