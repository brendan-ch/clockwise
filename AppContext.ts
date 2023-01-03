import React, { Dispatch, SetStateAction } from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import ColorValues from './src/styles/Color';
import {
  Colors,
  KeyboardShortcutGroup, Overlay, TimerMode, TimerState,
} from './src/types';

// TO-DO: nest everything inside objects
interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
  timeRemaining: number,
  timerState: TimerState,
  timeout?: number,
  mode: TimerMode,
  /* eslint-disable-next-line */
  setMode: (newMode: TimerMode) => any,
  /* eslint-disable-next-line */
  handleStateSwitch: (newMode: TimerMode) => any,
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
  setCurrentSessionNum: Dispatch<SetStateAction<number>>,
  colors: Colors,
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
  setCurrentSessionNum: () => {},
  colors: ColorValues,
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
