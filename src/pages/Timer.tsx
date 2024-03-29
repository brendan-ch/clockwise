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
import Timer from '../components/Timer';
import calculateTimerDisplay from '../helpers/calculateTimer';
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
import {
  BREAK_TIME_MINUTES,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  _24_HOUR_TIME,
} from '../StorageKeys';
import SelectionBar from '../components/SelectionBar';
import handleHaptic from '../helpers/handleHaptic';

/**
 * Component that displays information about the timer.
 * @returns
 */
export default function TimerPage() {
  // Depending on selection, update timer state
  const [barSelection, setBarSelection] = useState<'focus' | 'short break' | 'long break'>('focus');

  // const { width } = useWindowDimensions();

  const [isAtTop, setAtTop] = useState(true);
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
    timerBackgrounded,
    setTimeRemaining,
    currentSessionNum,
    colors,
  } = useContext(AppContext);
  const colorValues = colors;
  const isLightMode = colorValues.primary === ColorValues.primary;

  const now = useTimeUpdates();

  const {
    selected,
    tasks,
  } = useContext(TaskContext);

  const size = useWindowSize();

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

  /**
   * Handle selection of a timer option.
   * @param selection
   */
  function handleSelect(selection: 'focus' | 'short break' | 'long break') {
    if (selection === 'short break') {
      handleStateSwitch('break');
    } else if (selection === 'long break') {
      handleStateSwitch('longBreak');
    } else {
      handleStateSwitch('focus');
    }

    setBarSelection(selection);
  }

  // Calculate finish time, based on provide est. sessions data
  // Get the task w/ the longest number of sessions
  let max = 0;
  selected.forEach((id) => {
    const task = tasks.find((value) => value.id === id);
    const actual = task?.actualPomodoros ? task.actualPomodoros : 0;
    if (task?.estPomodoros && max < task.estPomodoros - actual) {
      // Set number of sessions to account for
      max = task.estPomodoros - actual;
    }
  });

  // Number of sessions until long break
  const numSessionsUntilLongBreak = settings[LONG_BREAK_INTERVAL]
    - ((currentSessionNum) % settings[LONG_BREAK_INTERVAL]);

  const numSessionsAfterLongBreak = max - numSessionsUntilLongBreak;
  // Number of long breaks to account for
  const numLongBreaks = numSessionsAfterLongBreak >= 0
    ? Math.floor(numSessionsAfterLongBreak / settings[LONG_BREAK_INTERVAL]) + 1
    : 0;

  // Check if long break is next
  const subtractLongBreak = (max + currentSessionNum) % settings[LONG_BREAK_INTERVAL] === 0;

  const timeFinish = new Date(
    now.getTime() + (settings[LONG_BREAK_ENABLED] ? (
      // Total time of focus-break sessions - extra break session
      ((settings[FOCUS_TIME_MINUTES] * max)
      + (settings[BREAK_TIME_MINUTES] * (max - numLongBreaks))
      + (settings[LONG_BREAK_TIME_MINUTES] * numLongBreaks))
      * 60 * 1000
      - (max === 0
        ? 0
        : settings[subtractLongBreak ? LONG_BREAK_TIME_MINUTES : BREAK_TIME_MINUTES] * 60 * 1000)
    ) : (
      ((settings[FOCUS_TIME_MINUTES] * max)
      + (settings[BREAK_TIME_MINUTES] * max))
      * 60 * 1000
      - (max === 0
        ? 0
        : settings[BREAK_TIME_MINUTES] * 60 * 1000)
    )),
  );

  let actionBarText;
  if (
    timerState === 'stopped'
    && mode === 'focus'
    && selected.length === 0
  ) {
    actionBarText = `Select some tasks ${size === 'portrait' ? 'above' : 'on the right'} to work on during your session.`;
  } else if (mode === 'focus' && timerState === 'stopped') {
    actionBarText = `${selected.length}/${tasks.length} tasks selected\nEst. time finish: ${
      calculateTime(timeFinish, settings[_24_HOUR_TIME] ? '24h' : '12h')
    }`;
  } else if (mode === 'break' || mode === 'longBreak') {
    actionBarText = 'Use this time to plan your next session.';
  }

  useBackgroundTimer();
  useTimerNotification();
  useUnsavedChanges();

  useEffect(() => {
    setPageTitle(mode === 'focus' ? 'Focus' : 'Break');

    if (mode === 'longBreak') {
      // If long break
      // Set selection bar state
      setBarSelection('long break');
    } else if (mode === 'break') {
      setBarSelection('short break');
    } else {
      setBarSelection('focus');
    }
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
            keys: ['l'],
            action: () => handleStateSwitch('longBreak'),
          }));

          unsubMethods.push(keyboardShortcutManager?.registerEvent({
            keys: ['r'],
            action: () => stopTimer(),
          }));

          if (timerState === 'running') {
            unsubMethods.push(keyboardShortcutManager?.registerEvent({
              keys: ['s'],
              action: () => handleFastForward(),
            }));
          }

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
   * Handle pressing of the fast forward button.
   */
  function handleFastForward() {
    // Haptic feedback
    handleHaptic('impact');
    setTimeRemaining(-1);
  }

  // Set breakpoints
  // Small window view
  if (size === 'small') {
    // Center everything
    return (
      <View style={[styles.container]}>
        <Timer
          display={calculateTimerDisplay(timeRemaining)}
          style={styles.timer}
        />
        <SelectionBar
          style={[styles.pageButtonBar, {
            width: 268,
          }]}
          selected={barSelection}
          // @ts-ignore
          onSelect={(newSelection) => handleSelect(newSelection)}
          options={['focus', 'short break', 'long break']}
        />
        {/* <PageButtonBar
          selected={mode}
          style={styles.pageButtonBar}
          onPressFocus={() => handleStateSwitch('focus')}
          onPressBreak={() => handleStateSwitch('break')}
        /> */}
        <ActionButtonBar
          style={styles.actionButtonBar}
          state={timerState}
          onStartPress={() => startTimer()}
          onPausePress={() => pauseTimer()}
          onResetPress={() => stopTimer()}
          onResumePress={() => startTimer()}
          onSkipPress={() => handleFastForward()}
          // Disable button press if timer backgrounded
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
            <SelectionBar
              selected={barSelection}
              style={[styles.pageButtonBar, {
                width: 268,
              }]}
              // @ts-ignore
              onSelect={(newSelection) => handleSelect(newSelection)}
              options={['focus', 'short break', 'long break']}
            />
            {/* <PageButtonBar
              selected={mode}
              style={styles.pageButtonBar}
              onPressFocus={() => handleStateSwitch('focus')}
              onPressBreak={() => handleStateSwitch('break')}
            /> */}
            <ActionButtonBar
              style={[styles.actionButtonBar, {
                height: 134,
              }]}
              state={timerState}
              onStartPress={() => startTimer()}
              onPausePress={() => pauseTimer()}
              onResetPress={() => stopTimer()}
              onResumePress={() => startTimer()}
              text={actionBarText}
              onSkipPress={() => handleFastForward()}
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
          style={[styles.container]}
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
  const children = (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorValues.background,
    }}
    >
      <Animated.View style={[styles.contentContainer, {
        opacity: fadeIn,
        // width: width - 80,
      }]}
      >
        <View style={styles.topContainer}>
          <Timer
            display={calculateTimerDisplay(timeRemaining)}
            style={styles.timer}
          />
          <SelectionBar
            selected={barSelection}
            style={[styles.pageButtonBar, {
              width: 275,
            }]}
            // @ts-ignore
            onSelect={(newSelection) => handleSelect(newSelection)}
            options={['focus', 'short break', 'long break']}
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
          <View
            style={{
              height: 20,
            }}
          />
          <ActionButtonBar
            style={[styles.actionButtonBar, {
              // width: width - 80,
            }]}
            state={timerBackgrounded ? 'running' : timerState}
            onStartPress={() => startTimer()}
            onPausePress={() => pauseTimer()}
            onResetPress={() => stopTimer()}
            onResumePress={() => startTimer()}
            text={actionBarText}
            disabled={timerBackgrounded}
            onSkipPress={() => handleFastForward()}
          />
        </View>
      ) : undefined}
      <StatusBar style={isLightMode ? 'dark' : 'light'} />
    </View>
  );

  if (Platform.OS === 'web') {
    return children;
  }

  return (
    <Pressable
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
      onPress={() => Keyboard.dismiss()}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  contentContainer: {
    height: '85%',
    width: 275,
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
    alignItems: 'center',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    // height: 200,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 60,
    alignItems: 'center',
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
    // height: 134,
    width: 268,
  },
});
