import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import AppLoading from 'expo-app-loading';
import { Audio } from 'expo-av';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';
import AppContext from './AppContext';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import TimerPage from './src/pages/Timer';
import { KeyboardShortcutGroup, Overlay, TimerState } from './src/types';
import SettingsPage from './src/pages/SettingsPage';
import TextStyles from './src/styles/Text';
import useWindowSize from './src/helpers/hooks/useWindowSize';
import HeaderButton from './src/components/HeaderButton';
import useTheme from './src/helpers/hooks/useTheme';
import SettingsOverlay from './src/overlays/SettingsOverlay';
import LandscapeHeader from './src/components/LandscapeHeader';
import LandscapeFooter from './src/components/LandscapeFooter';
import { getData, getTimerValue, prefillSettings } from './src/helpers/storage';
import usePageTitle from './src/helpers/hooks/usePageTitle';

/* eslint-disable-next-line */
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import { ENABLE_TIMER_SOUND } from './src/StorageKeys';

const MIN_25 = 1500000;
const MIN_5 = 300000;

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Create prefix link
const prefix = Linking.createURL('/');

export default function App() {
  const [
    keyboardShortcutManager, setKeyboardShortcutManager,
  ] = useState<KeyboardShortcutManager | undefined>(undefined);
  const [shortcutsInitialized, setShortcutsInitialized] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [timeout, setTimeoutState] = useState<any>(undefined);
  const [overlay, setOverlayState] = useState<Overlay>('none');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardShortcutGroup>('none');

  const setPageTitle = usePageTitle('Session', timeRemaining, timerState);

  // Use for background timer handling
  // Date in milliseconds timer was started on
  const [start, setStart] = useState<number | undefined>(undefined);
  const [timerLength, setTimerLength] = useState<number | undefined>(undefined);
  const [timerBackgrounded, setTimerBackgrounded] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | undefined>();

  // Helper methods
  /**
   * Load the timer sound from the assets folder.
   */
  async function loadTimerSound() {
    /* eslint-disable global-require */
    const newSound = await Audio.Sound.createAsync(
      require('./assets/timer.mp3'),
    );
    setSound(newSound.sound);
  }

  /**
   * Play the timer sound.
   */
  async function playTimerSound() {
    await sound?.playAsync();
  }

  /**
   * Set the overlay state and keyboard group.
   * @param newOverlay
   */
  function setOverlay(newOverlay: Overlay) {
    if (newOverlay === 'none') {
      setKeyboardGroup('timer');
    } else if (newOverlay === 'settings') {
      setKeyboardGroup('settings');
    }

    setOverlayState(newOverlay);
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
   * Pause the timer.
   */
  function pauseTimer() {
    clearTimerInterval(timeout);
    setStart(undefined);
    setTimerLength(undefined);
    setTimerState('paused');
  }

  /**
   * Stop the timer.
   */
  async function stopTimer() {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    setStart(undefined);
    setTimerLength(undefined);
    await getAndSetTimerValue(mode);
  }

  /**
   * Clear the timer updating interval.
   */

  /**
   * Update the time remaining in the state.
   * @param interval
   */
  function updateTimeRemaining(newStart: number, customTimeRemaining?: number) {
    // Set actual time based on delta
    const delta = Date.now() - newStart;

    setTimeRemaining((customTimeRemaining || timeRemaining) - delta);
  }

  // Hooks
  // Get theme
  const colorValues = useTheme();

  // Get window size
  const windowSize = useWindowSize();

  // Load fonts
  const [fontsLoaded] = useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_400Regular_Italic,
    AnonymousPro_700Bold,
    AnonymousPro_700Bold_Italic,
  });

  useEffect(() => {
    if (timeRemaining < 0) {
      // Clear interval and set new state
      handleStateSwitch(mode === 'focus' ? 'break' : 'focus');

      // Set timer state
      setTimerState('stopped');

      getData(ENABLE_TIMER_SOUND)
        .then((value) => {
          if (value === '1') {
            playTimerSound();
          }
        });
    }
  }, [timeRemaining, sound]);

  useEffect(() => {
    // Initialize keyboard shortcuts on web
    if (Platform.OS === 'web') {
      const manager = new KeyboardShortcutManager();
      setKeyboardShortcutManager(manager);

      // Initialize overlay shortcuts
      manager.registerEvent({
        keys: ['Meta', ','],
        action: () => {
          setOverlay('settings');
        },
      });

      manager.registerEvent({
        keys: ['Control', ','],
        action: () => {
          setOverlay('settings');
        },
      });
    }

    setShortcutsInitialized(true);
  }, []);

  useEffect(() => {
    // Timer and app initialiation
    getAndSetTimerValue(mode);
    loadTimerSound();
    prefillSettings();
  }, []);

  // Links
  const config = {
    screens: {
      Timer: '',
      Settings: 'settings',
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };

  // Rendering
  // Header options
  // These apply to all headers in the app
  const headerOptions = {
    headerShadowVisible: false,
    headerTintColor: colorValues.primary,
    headerStyle: {
      backgroundColor: colorValues.background,
    },
    headerTitleStyle: TextStyles.textBold,
  };

  if (!fontsLoaded || !shortcutsInitialized) {
    return <AppLoading />;
  }

  // Do conditional rendering based on window size
  if (windowSize === 'small' || windowSize === 'landscape') {
    // const SettingsOverlay = React.lazy(() => import('./src/overlays/SettingsOverlay'));

    // Return just the timer (with context provider)
    return (
      <AppContext.Provider value={{
        keyboardShortcutManager,
        timeRemaining,
        setTimeRemaining,
        timerState,
        timeout,
        overlay,
        setOverlay,
        keyboardGroup,
        setKeyboardGroup,
        mode,
        setMode,
        handleStateSwitch,
        startTimer,
        stopTimer,
        pauseTimer,
        setPageTitle,
        start,
        timerLength,
        timerBackgrounded,
        setTimerBackgrounded,
      }}
      >
        <View style={[styles.landscapeContainer, {
          backgroundColor: colorValues.background,
        }]}
        >
          {windowSize === 'landscape' ? (
            <LandscapeHeader />
          ) : undefined}
          <TimerPage />
          {windowSize === 'landscape' ? (
            <LandscapeFooter />
          ) : undefined}
        </View>
        {windowSize === 'landscape' ? (
          <Modal
            isVisible={overlay === 'settings'}
            onBackdropPress={() => setOverlay('none')}
            backdropOpacity={0.3}
            backdropColor={colorValues.primary}
            animationIn="fadeIn"
            animationInTiming={20}
            animationOut="fadeOut"
            backdropTransitionInTiming={20}
            backdropTransitionOutTiming={20}
            animationOutTiming={20}
            style={{
              // alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SettingsOverlay />
          </Modal>
        ) : undefined}
      </AppContext.Provider>
    );
  }

  // Otherwise return stack navigator
  return (
    <AppContext.Provider value={{
      keyboardShortcutManager,
      timeRemaining,
      timerState,
      timeout,
      overlay,
      setOverlay,
      keyboardGroup,
      setKeyboardGroup,
      mode,
      setMode,
      handleStateSwitch,
      startTimer,
      stopTimer,
      pauseTimer,
      setPageTitle,
      setTimeRemaining,
      start,
      timerLength,
      timerBackgrounded,
      setTimerBackgrounded,
    }}
    >
      <NavigationContainer
        linking={linking}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Timer"
            component={TimerPage}
            options={{
              ...headerOptions,
              headerTitle: '',
              headerRight: () => HeaderButton({
                iconName: 'ellipsis-vertical',
                to: {
                  screen: 'Settings',
                  params: {},
                },
              }),
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              ...headerOptions,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  landscapeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

if (Platform.OS === 'web') {
  serviceWorkerRegistration.register();
}
