// import {
//   useFonts,
//   /* eslint-disable camelcase */
//   AnonymousPro_400Regular,
//   AnonymousPro_400Regular_Italic,
//   AnonymousPro_700Bold,
//   AnonymousPro_700Bold_Italic,
// } from '@expo-google-fonts/anonymous-pro';
// import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, View, useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AppContext from '../../AppContext';
import ActionButtonBar from '../components/ActionButtonBar';
import Introduction from '../components/Introduction';
import PageButtonBar from '../components/PageButtonBar';
import Timer from '../components/Timer';
import calculateTimerDisplay from '../helpers/calculateTimer';

const MIN_25 = 1500000;
const MIN_5 = 300000;
const INTERVAL = 1000;

export default function TimerPage() {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  // const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  // const [timerState, setTimerState] = useState<TimerState>('stopped');
  // const [timeout, setTimeoutState] = useState<any>(null);
  const [introDisplayed, setIntroDisplayed] = useState(true);

  // let timeout: any = null;

  const { height, width } = useWindowDimensions();
  const {
    timeRemaining,
    timerState,
    clearTimerInterval,
    timeout,
    setTimeRemaining,
    setTimerState,
    setTimeoutState,
    keyboardShortcutManager,
  } = useContext(AppContext);

  useEffect(
    () => {
      // Register some keyboard shortcuts
      try {
        const unsubMethods: ((() => any) | undefined)[] = [];
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: [' '],
          action: toggleTimerState,
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['1'],
          action: () => handleStateSwitch('focus'),
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['2'],
          action: () => handleStateSwitch('break'),
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['r'],
          action: () => stopTimer(),
        }));

        return () => {
          unsubMethods.forEach((method) => {
            if (method) {
              method();
            }
          });
        };
      } catch (e) {
        return () => {};
      }
    },
    [timeout, timerState, mode, timeRemaining],
  );

  /**
   * Toggle the timer state between pausing and starting.
   */
  function toggleTimerState() {
    if (timerState === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  /**
   * Handle switching between break and focus modes.
   */
  function handleStateSwitch(newMode: 'focus' | 'break') {
    clearTimerInterval();
    setTimerState('stopped');
    setTimeRemaining(newMode === 'break' ? MIN_5 : MIN_25);
    setMode(newMode);
  }

  /**
   * Set an interval that updates the timer.
   */
  function startTimer() {
    setTimerState('running');

    const expected = Date.now() + INTERVAL;
    const newTimeout = setTimeout(() => updateTimeRemaining(expected, timeRemaining), INTERVAL);

    setTimeoutState(newTimeout);
  }

  /**
   * Pause the timer.
   */
  function pauseTimer() {
    clearTimerInterval();
    setTimerState('paused');
  }

  /**
   * Stop the timer.
   */
  function stopTimer() {
    clearTimerInterval();
    setTimerState('stopped');
    setTimeRemaining(mode === 'break' ? MIN_5 : MIN_25);
  }

  /**
   * Clear the timer updating interval.
   */

  /**
   * Update the time remaining in the state.
   * @param interval
   */
  function updateTimeRemaining(expected: number, timeRemainingActual: number) {
    // Calculate drift
    const dt = Date.now() - expected;

    // Set time remaining
    const updatedTimeRemaining = timeRemainingActual - (INTERVAL + dt);
    if (updatedTimeRemaining <= 0) {
      // Clear timer and change to other mode
      handleStateSwitch(mode === 'break' ? 'focus' : 'break');

      // Haptic feedback
      Haptics.notificationAsync();

      return;
    }
    setTimeRemaining(updatedTimeRemaining);

    // Repeat timeout until cleared
    setTimeoutState(setTimeout(
      () => updateTimeRemaining(expected + INTERVAL, updatedTimeRemaining),
      Math.max(0, INTERVAL - dt),
    ));
  }

  /**
   * Dismiss the introduction component.
   */
  function handleIntroDismiss() {
    setIntroDisplayed(false);
  }

  // console.log(height);
  // console.log(width);

  // Set breakpoints
  // Small window view
  if (height < 400 && width < 700) {
    // Center everything
    return (
      <View style={styles.container}>
        <Timer
          display={calculateTimerDisplay(timeRemaining)}
          style={styles.timer}
        />
        <PageButtonBar
          selected={mode}
          style={styles.pageButtonBar}
          // onPressFocus={() => handleStateSwitch('focus')}
          // onPressBreak={() => handleStateSwitch('break')}
        />
        <ActionButtonBar
          style={styles.actionButtonBar}
          state={timerState}
          onStartPress={() => startTimer()}
          onPausePress={() => pauseTimer()}
          onResetPress={() => stopTimer()}
          onResumePress={() => startTimer()}
        />
      </View>
    );
  }

  // Landscape view
  if (width >= 700) {
    // Display timer and tasks side by side
    return (
      <View style={styles.container}>
        <View style={styles.contentContainerLandscape}>
          <View style={[styles.landscapeContainer, styles.leftContainer]}>
            <View style={styles.leftContentContainer}>
              <Timer
                display={calculateTimerDisplay(timeRemaining)}
                style={styles.timer}
              />
              <PageButtonBar
                selected={mode}
                style={styles.pageButtonBar}
                onPressFocus={() => handleStateSwitch('focus')}
                onPressBreak={() => handleStateSwitch('break')}
              />
              <ActionButtonBar
                style={styles.actionButtonBar}
                state={timerState}
                onStartPress={() => startTimer()}
                onPausePress={() => pauseTimer()}
                onResetPress={() => stopTimer()}
                onResumePress={() => startTimer()}
              />
            </View>
          </View>
          <View style={[styles.landscapeContainer, styles.rightContainer]}>
            <View style={styles.rightContentContainer}>
              <Introduction />
            </View>
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Mobile view
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <Timer
            display={calculateTimerDisplay(timeRemaining)}
            style={styles.timer}
          />
          <PageButtonBar
            selected={mode}
            style={styles.pageButtonBar}
            onPressFocus={() => handleStateSwitch('focus')}
            onPressBreak={() => handleStateSwitch('break')}
          />
        </View>
        <View style={styles.middleContainer}>
          {introDisplayed
            ? <Introduction onDismiss={() => handleIntroDismiss()} />
            : undefined}
        </View>
        <View style={styles.bottomContainer}>
          <ActionButtonBar
            style={styles.actionButtonBar}
            state={timerState}
            onStartPress={() => startTimer()}
            onPausePress={() => pauseTimer()}
            onResetPress={() => stopTimer()}
            onResumePress={() => startTimer()}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    height: '80%',
    width: 268,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainerLandscape: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  topContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  middleContainer: {
    marginTop: 10,
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
  },
  leftContainer: {
    justifyContent: 'flex-end',
  },
  rightContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: '100%',
  },
  rightContainer: {
    marginLeft: 20,
    justifyContent: 'flex-start',
  },
  timer: {
    marginBottom: 15,
  },
  pageButtonBar: {
    height: 31,
    width: 268,
  },
  actionButtonBar: {
    height: 134,
    width: 268,
  },
});
