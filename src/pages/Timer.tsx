import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, View, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
// import { useNavigation } from '@react-navigation/native';
import AppContext from '../../AppContext';
import ActionButtonBar from '../components/ActionButtonBar';
import PageButtonBar from '../components/PageButtonBar';
import Timer from '../components/Timer';
import calculateTimerDisplay from '../helpers/calculateTimer';
import useTheme from '../helpers/useTheme';
import useWindowSize from '../helpers/useWindowSize';
import { getTimerValue } from '../helpers/storage';
import TaskList from '../components/TaskList';
// import HeaderButton from '../components/HeaderButton';

const MIN_25 = 1500000;
const MIN_5 = 300000;
// const MIN_5 = 10000; // for testing purposes
// const INTERVAL = 1000;

export default function TimerPage() {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  // const [introDisplayed, setIntroDisplayed] = useState(true);

  const colorValues = useTheme();

  const size = useWindowSize();
  const {
    timeRemaining,
    timerState,
    clearTimerInterval,
    timeout,
    setTimeRemaining,
    setTimerState,
    setTimeoutState,
    keyboardShortcutManager,
    keyboardGroup,
    setKeyboardGroup,
  } = useContext(AppContext);

  useEffect(() => {
    // Read value in storage and set in context
    getAndSetTimerValue(mode);

    setKeyboardGroup('timer');
  }, []);

  useEffect(
    () => {
      if (keyboardGroup === 'timer') {
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
      }

      return () => {};
    },
    [timeout, timerState, mode, timeRemaining, keyboardGroup],
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
  async function handleStateSwitch(newMode: 'focus' | 'break') {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    setMode(newMode);

    await getAndSetTimerValue(newMode);
  }

  /**
   * Set the time remaining based on AsyncStorage value.
   * @param mode
   */
  async function getAndSetTimerValue(newMode: 'focus' | 'break') {
    const timerValueMinutes = await getTimerValue(newMode);

    if (timerValueMinutes && !Number.isNaN(Number(timerValueMinutes))) {
      setTimeRemaining(Number(timerValueMinutes) * 60 * 1000);
    } else {
      setTimeRemaining(newMode === 'break' ? MIN_5 : MIN_25);
    }
  }

  /**
   * Set an interval that updates the timer.
   */
  function startTimer() {
    setTimerState('running');

    const start = Date.now();
    // const expected = Date.now() + INTERVAL;
    // const newTimeout = setTimeout(() => updateTimeRemaining(expected, timeRemaining), INTERVAL);
    const newTimeout = setInterval(() => updateTimeRemaining(start), 100);

    setTimeoutState(newTimeout);
  }

  /**
   * Pause the timer.
   */
  function pauseTimer() {
    clearTimerInterval(timeout);
    setTimerState('paused');
  }

  /**
   * Stop the timer.
   */
  async function stopTimer() {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    // setTimeRemaining(mode === 'break' ? MIN_5 : MIN_25);
    await getAndSetTimerValue(mode);
  }

  /**
   * Clear the timer updating interval.
   */

  /**
   * Update the time remaining in the state.
   * @param interval
   */
  function updateTimeRemaining(start: number) {
    // Set actual time based on delta
    const delta = Date.now() - start;

    // if (Platform.OS === 'web') {
    //   window.document.title = `${calculateTimerDisplay(timeRemaining - delta)} | Session`;
    // }
    if (timeRemaining - delta <= 0) {
      // Clear timer and change to other mode
      handleStateSwitch(mode === 'break' ? 'focus' : 'break');

      // Haptic feedback
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.notificationAsync();
      }

      return;
    }

    setTimeRemaining(timeRemaining - delta);
  }

  // Set breakpoints
  // Small window view
  if (size === 'small') {
    // Center everything
    return (
      <View style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
      >
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
  if (size === 'landscape') {
    // Display timer and tasks side by side
    return (
      <View style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
      >
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
              <TaskList />
            </View>
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Mobile view
  return (
    <View style={[styles.container, {
      backgroundColor: colorValues.background,
    }]}
    >
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
          <TaskList />
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
    height: '85%',
    width: 268,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
    width: '100%',
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
    height: 280,
  },
  leftContainer: {
    justifyContent: 'flex-end',
  },
  rightContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 280,
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
