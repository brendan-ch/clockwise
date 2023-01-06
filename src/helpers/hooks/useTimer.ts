import { Dispatch, SetStateAction, useState } from 'react';
import { DefaultSettingsState, TimerMode, TimerState } from '../../types';
import getTimeKey from '../getTimeKey';

const MIN_25 = 1500000;

interface TimerStateObject {
  setTimerState: Dispatch<SetStateAction<TimerState>>,
  timerState: TimerState,
  mode: TimerMode,
  setMode: Dispatch<SetStateAction<TimerMode>>,
}

/**
 * Timer handling.
 */
function useTimer(settings: DefaultSettingsState, timerStateObj: TimerStateObject) {
  const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  const [timeout, setTimeoutState] = useState<any>(undefined);

  const {
    timerState,
    setTimerState,
    mode,
    setMode,
  } = timerStateObj;

  // Use for background timer handling
  // Date in milliseconds timer was started on
  const [start, setStart] = useState<number | undefined>(undefined);
  const [timerLength, setTimerLength] = useState<number | undefined>(undefined);
  const [timerBackgrounded, setTimerBackgrounded] = useState(false);

  /**
   * Update the time remaining in the state.
   * @param newStart
   * @param customTimeRemaining
   */
  function updateTimeRemaining(newStart: number, customTimeRemaining?: number) {
    // Set actual time based on delta
    const delta = Date.now() - newStart;

    setTimeRemaining((customTimeRemaining || timeRemaining) - delta);
  }

  /**
   * Set the time remaining based on AsyncStorage value.
   * @param newMode
   */
  function getAndSetTimerValue(newMode: TimerMode) {
    const timeKey = getTimeKey(newMode);
    // @ts-ignore
    const timerValueMinutes = settings[timeKey];
    setTimeRemaining(timerValueMinutes * 60 * 1000);
  }

  /**
   * Stop the timer and reset the time.
   */
  async function stopTimer() {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    setStart(undefined);
    setTimerLength(undefined);
    getAndSetTimerValue(mode);
  }

  /**
   * Pause the timer.
   */
  function pauseTimer() {
    clearTimerInterval(timeout);
    setStart(undefined);
    setTimerLength(undefined);
    setTimerState('paused');
  }

  /**
   * Clear the timer and set timeout state to undefined.
   * @param passedInterval The interval to clear.
   */
  function clearTimerInterval(passedInterval: any) {
    clearInterval(passedInterval);
    // setTimeoutState(undefined);
  }

  /**
   * Handle automatic timer starting.
   * @param newMode
   */
  function handleAutoStart(newMode: TimerMode) {
    // Change the mode
    setMode(newMode);
    // Change the time remaining
    const timeKey = getTimeKey(newMode);
    // @ts-ignore
    const newTimeRemaining = settings[timeKey] * 60 * 1000;
    setTimeRemaining(newTimeRemaining);
    // Clear the existing interval
    clearTimerInterval(timeout);
    // Create a new timeout with said time remaining
    const newStart = Date.now();
    setStart(newStart);

    setTimerLength(newTimeRemaining);
    const newTimeout = setInterval(() => updateTimeRemaining(newStart, newTimeRemaining), 100);

    setTimeoutState(newTimeout);
  }

  /**
   * Set an interval that updates the timer.
   * @param customTimeRemaining Pass a time value here to skip to a value not specified in state.
   */
  function startTimer(customTimeRemaining?: number) {
    if (timerState === 'running') return;
    setTimerState('running');

    const newStart = Date.now();
    setStart(newStart);

    setTimerLength(customTimeRemaining || timeRemaining);
    const newTimeout = setInterval(() => updateTimeRemaining(newStart, customTimeRemaining), 100);

    setTimeoutState(newTimeout);
  }

  /**
   * Handle switching between break and focus modes.
   * @param newMode
   */
  function handleStateSwitch(newMode: TimerMode) {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    setMode(newMode);
    setTimerLength(undefined);
    setStart(undefined);

    getAndSetTimerValue(newMode);
  }

  return {
    state: {
      timeRemaining,
      start,
      timerLength,
      timerBackgrounded,
      timeout,
    },
    methods: {
      setTimeRemaining,
      handleAutoStart,
      handleStateSwitch,
      startTimer,
      pauseTimer,
      stopTimer,
      setTimerBackgrounded,
    },
  };
}

export default useTimer;
