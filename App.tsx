import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, useWindowDimensions, Text,
} from 'react-native';
import ActionButtonBar from './src/components/ActionButtonBar';
import PageButtonBar from './src/components/PageButtonBar';
import Timer from './src/components/Timer';
import calculateTimerDisplay from './src/helpers/calculateTimer';
import TextStyles from './src/styles/Text';

type TimerState = 'running' | 'paused' | 'stopped';

const MIN_25 = 1500000;
const MIN_5 = 300000;

export default function App() {
  const [fontsLoaded] = useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_400Regular_Italic,
    AnonymousPro_700Bold,
    AnonymousPro_700Bold_Italic,
  });

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [timeout, setTimeoutState] = useState<any>(null);

  // let timeout: any = null;

  const { height, width } = useWindowDimensions();

  useEffect(() => () => clearTimerInterval(), []);

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

    const expected = Date.now() + 1000;
    setTimeoutState(
      setTimeout(() => updateTimeRemaining(expected, timeRemaining), 1000),
    );
  }

  /**
   * Clear the timer updating interval.
   */
  function clearTimerInterval() {
    clearTimeout(timeout);
    setTimeoutState(null);
  }

  /**
   * Update the time remaining in the state.
   * @param interval
   */
  function updateTimeRemaining(expected: number, timeRemainingActual: number) {
    // Calculate drift
    const dt = Date.now() - expected;

    // Set time remaining
    const updatedTimeRemaining = timeRemainingActual - (1000 + dt);
    setTimeRemaining(updatedTimeRemaining);
    // console.log(timeRemainingActual - (1000 + dt));

    // Repeat timeout until cleared
    setTimeoutState(setTimeout(
      () => updateTimeRemaining(expected + 1000, updatedTimeRemaining),
      Math.max(0, 1000 - dt),
    ));
  }

  if (!fontsLoaded) {
    return <AppLoading />;
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
          display="25:00"
          style={styles.timer}
        />
        <PageButtonBar
          selected="focus"
          style={styles.pageButtonBar}
          // onPressFocus={() => handleStateSwitch('focus')}
          // onPressBreak={() => handleStateSwitch('break')}
        />
        <ActionButtonBar
          style={styles.actionButtonBar}
          text="The quick brown fox jumps over the lazy dog."
          state="stopped"
        />
        <StatusBar style="auto" />
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
                text="The quick brown fox jumps over the lazy dog."
                state={timerState}
              />
            </View>
          </View>
          <View style={[styles.landscapeContainer, styles.rightContainer]}>
            <View style={styles.rightContentContainer}>
              <Text style={TextStyles.textRegular}>
                Placeholder text for task management component
              </Text>
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
        <View style={styles.bottomContainer}>
          <ActionButtonBar
            style={styles.actionButtonBar}
            text="The quick brown fox jumps over the lazy dog."
            state={timerState}
            onStartPress={() => startTimer()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainerLandscape: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  topContainer: {
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    justifyContent: 'flex-start',
  },
  landscapeContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer: {
    justifyContent: 'flex-end',
  },
  rightContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
