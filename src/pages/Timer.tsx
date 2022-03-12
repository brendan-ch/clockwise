import { StatusBar } from 'expo-status-bar';
import React, {
  useEffect, useContext, useRef, useState,
} from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet, View,
} from 'react-native';
import AppContext from '../../AppContext';
import ActionButtonBar from '../components/ActionButtonBar';
import PageButtonBar from '../components/PageButtonBar';
import Timer from '../components/Timer';
import calculateTimerDisplay from '../helpers/calculateTimer';
import useTheme from '../helpers/hooks/useTheme';
import useWindowSize from '../helpers/hooks/useWindowSize';
import TaskList from '../components/TaskList';
import useBackgroundTimer from '../helpers/hooks/useBackgroundTimer';
import useTimerNotification from '../helpers/hooks/useTimerNotifications';
import useUnsavedChanges from '../helpers/hooks/useUnsavedChanges';
import ColorValues from '../styles/Color';
import TaskContext from '../../TaskContext';
import useTimeUpdates from '../helpers/hooks/useTimeUpdates';
import calculateTime from '../helpers/calculateTime';
import SettingsContext from '../../SettingsContext';
import { BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES, _24_HOUR_TIME } from '../StorageKeys';

/**
 * Component that displays information about the timer.
 * @returns
 */
export default function TimerPage() {
  const [isAtTop, setAtTop] = useState(true);
  const colorValues = useTheme();
  const isLightMode = colorValues.primary === ColorValues.primary;

  const now = useTimeUpdates();

  const {
    selected,
    tasks,
  } = useContext(TaskContext);

  const size = useWindowSize();
  const {
    timeRemaining,
    timerState,
    timeout,
    keyboardShortcutManager,
    keyboardGroup,
    setKeyboardGroup,
    mode,
    handleStateSwitch,
    startTimer,
    stopTimer,
    pauseTimer,
    setPageTitle,
  } = useContext(AppContext);

  const settings = useContext(SettingsContext);

  const fadeIn = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;

  /**
   * Fade in the app interface after the splash screen.
   */
  function fadeInView() {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }

  // Calculate finish time, based on provide est. sessions data
  // Get the task w/ the longest number of sessions
  let max = 0;
  selected.forEach((id) => {
    const task = tasks.find((value) => value.id === id);
    const actual = task?.actualPomodoros ? task.actualPomodoros : 0;
    if (task?.estPomodoros && max < task.estPomodoros - actual) {
      max = task.estPomodoros - actual;
    }
  });
  const timeFinish = new Date(
    now.getTime() + (
      ((settings[FOCUS_TIME_MINUTES] + settings[BREAK_TIME_MINUTES]) * 60 * 1000 * max)
      - (max === 0 ? 0 : settings[BREAK_TIME_MINUTES] * 60 * 1000)
    ),
  );

  let actionBarText;
  if (
    timerState === 'stopped'
    && mode === 'focus'
    && selected.length === 0
  ) {
    actionBarText = `Select some tasks ${size === 'portrait' ? 'above' : 'on the right'} to work on during your session.`;
  } else if (mode === 'focus' && timerState === 'stopped') {
    actionBarText = `${selected.length}/${tasks.length} tasks selected. Est. time finish: ${
      calculateTime(timeFinish, settings[_24_HOUR_TIME] ? '24h' : '12h')
    }`;
  } else if (mode === 'break') {
    actionBarText = 'Use this time to plan your next session.';
  }

  useBackgroundTimer();
  useTimerNotification();
  useUnsavedChanges();

  useEffect(() => {
    setPageTitle(mode === 'focus' ? 'Focus' : 'Break');
  }, [mode]);

  useEffect(() => {
    setKeyboardGroup('timer');

    if (Platform.OS !== 'web') {
      fadeInView();
    }
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
            keys: ['f'],
            action: () => handleStateSwitch('focus'),
          }));

          unsubMethods.push(keyboardShortcutManager?.registerEvent({
            keys: ['b'],
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
    );
  }

  // Landscape view
  if (size === 'landscape') {
    const children = (
      <KeyboardAvoidingView
        style={styles.contentContainerLandscape}
        behavior="padding"
      >
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
              text={actionBarText}
            />
          </View>
        </View>
        <View style={[styles.landscapeContainer, styles.rightContainer]}>
          <View style={styles.rightContentContainer}>
            <TaskList />
          </View>
        </View>
      </KeyboardAvoidingView>
    );

    // Display timer and tasks side by side
    if (Platform.OS === 'web') {
      return (
        <View
          style={[styles.container, {
            backgroundColor: colorValues.background,
          }]}
        >
          {children}
        </View>
      );
    }
    return (
      <Pressable
        style={[styles.container, {
          backgroundColor: colorValues.background,
        }]}
        onPress={() => Keyboard.dismiss()}
      >
        {children}
        <StatusBar style="auto" />
      </Pressable>
    );
  }

  // Mobile view
  return (
    <Pressable
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
      onPress={() => Keyboard.dismiss()}
    >
      <Animated.View style={[styles.contentContainer, {
        opacity: fadeIn,
      }]}
      >
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
          <TaskList
            setAtTop={setAtTop}
          />
        </View>
      </Animated.View>
      {isAtTop ? (
        <View style={[styles.bottomContainer, {
          backgroundColor: colorValues.background,
        }]}
        >
          <ActionButtonBar
            style={styles.actionButtonBar}
            state={timerState}
            onStartPress={() => startTimer()}
            onPausePress={() => pauseTimer()}
            onResetPress={() => stopTimer()}
            onResumePress={() => startTimer()}
            text={actionBarText}
          />
        </View>
      ) : undefined}
      <StatusBar style={isLightMode ? 'dark' : 'light'} />
    </Pressable>
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
    width: 280,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    height: 200,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  middleContainer: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    zIndex: 0,
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
