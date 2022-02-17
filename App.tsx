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
import {
  ImageBackground, Platform, StyleSheet, useWindowDimensions, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';
import AppContext from './AppContext';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import TimerPage from './src/pages/Timer';
import {
  DefaultSettingsState, ImageInfo, KeyboardShortcutGroup, Overlay, TimerState,
} from './src/types';
import SettingsPage from './src/pages/SettingsPage';
import TextStyles from './src/styles/Text';
import useWindowSize from './src/helpers/hooks/useWindowSize';
import HeaderButton from './src/components/HeaderButton';
import useTheme from './src/helpers/hooks/useTheme';
import SettingsOverlay from './src/overlays/SettingsOverlay';
import LandscapeHeader from './src/components/LandscapeHeader';
import LandscapeFooter from './src/components/LandscapeFooter';
import { getData, prefillSettings } from './src/helpers/storage';
import usePageTitle from './src/helpers/hooks/usePageTitle';

/* eslint-disable-next-line */
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
  SUPPRESS_INTRODUCTION,
} from './src/StorageKeys';
import SettingsContext from './SettingsContext';
import useTasks from './src/helpers/hooks/useTasks';
import TaskContext from './TaskContext';
import getBaseURL from './src/helpers/getBaseURL';
import ImageContext from './ImageContext';
import IntroductionOverlay from './src/overlays/IntroductionOverlay';

const MIN_25 = 1500000;
// const MIN_5 = 300000;

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Create prefix link
const prefix = Linking.createURL('/');

export default function App() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>();

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

  // Initialize settings state here
  const [settings, setSettings] = useState<DefaultSettingsState>({
    [ENABLE_TIMER_ALERTS]: false,
    [FOCUS_TIME_MINUTES]: 25,
    [BREAK_TIME_MINUTES]: 5,
    [ENABLE_BACKGROUND]: false,
    [AUTO_APPEARANCE]: true,
    [DARK_MODE]: false,
  });

  // Track selected task IDs
  // const [selected, setSelected] = useState<number[]>([]);

  const {
    selected,
    setSelected,
    tasks,
    setTasks,
    handleAddTask,
    handleChangeTask,
    handleDeleteTask,
    bumpActualPomodoros,
  } = useTasks();

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
  function handleStateSwitch(newMode: 'focus' | 'break') {
    clearTimerInterval(timeout);
    setTimerState('stopped');
    setMode(newMode);
    setTimerLength(undefined);
    setStart(undefined);

    getAndSetTimerValue(newMode);
  }

  /**
   * Set the time remaining based on AsyncStorage value.
   * @param mode
   */
  function getAndSetTimerValue(newMode: 'focus' | 'break') {
    const timerValueMinutes = newMode === 'focus' ? settings[FOCUS_TIME_MINUTES] : settings[BREAK_TIME_MINUTES];
    setTimeRemaining(timerValueMinutes * 60 * 1000);
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
    getAndSetTimerValue(mode);
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

  /**
   * Update a setting in the settings state.
   * @param key
   * @param value
   */
  function setSetting(key: string, value: boolean | number) {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  /**
   * Load the settings data specified in the `settings` state.
   */
  async function initializeSettingsData() {
    const temp: DefaultSettingsState = {
      ...settings,
    };

    await Promise.all(Object.keys(settings).map(async (key) => {
      // Load the data
      const data = await getData(key);
      if (!data) return;
      // @ts-ignore
      const type = typeof temp[key];

      if (type === 'number') {
        // Convert the data
        // @ts-ignore
        temp[key] = !Number.isNaN(Number(data)) ? Number(data) : temp[key];
      } else if (type === 'boolean') {
        // @ts-ignore
        temp[key] = data === '1';
      }
    }));

    setSettings(temp);
  }

  /**
   * Attempt to load and set a background image.
   */
  async function setBackgroundImage() {
    const res = await fetch(`${getBaseURL()}/api/getBackground`);
    if (res.status === 200) {
      const json = await res.json();

      setImageInfo({
        uri: json.uri,
        author: json.author,
        link: json.link,
      });
    }
  }

  // Hooks
  // Get theme
  const colorValues = useTheme(settings);

  // Get window size
  const windowSize = useWindowSize();
  const { height, width } = useWindowDimensions();

  // Load fonts
  const [fontsLoaded] = useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_400Regular_Italic,
    AnonymousPro_700Bold,
    AnonymousPro_700Bold_Italic,
  });

  useEffect(() => {
    if (timeRemaining < 0) {
      // Update actual sessions of selected tasks
      if (mode === 'focus') {
        bumpActualPomodoros();
      }

      // Clear interval and set new state
      handleStateSwitch(mode === 'focus' ? 'break' : 'focus');

      // Set timer state
      setTimerState('stopped');

      // Play the timer sound
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
    // getAndSetTimerValue(mode);
    loadTimerSound();
    prefillSettings();
    initializeSettingsData();
  }, []);

  useEffect(() => {
    getData(SUPPRESS_INTRODUCTION)
      .then((result) => {
        if (!result) {
          setOverlay('introduction');
        }
      });
  }, []);

  useEffect(() => {
    // Change timer display if timer is stopped
    // and timer setting changes
    if (timerState === 'stopped') {
      setTimeRemaining(
        settings[mode === 'focus' ? FOCUS_TIME_MINUTES : BREAK_TIME_MINUTES] * 60 * 1000,
      );
    }
  }, [settings, timerState]);

  // Attempt to set background image
  useEffect(() => {
    if (!imageInfo && windowSize === 'landscape' && settings[ENABLE_BACKGROUND]) {
      setBackgroundImage()
        .catch(() => {
          /* eslint-disable-next-line */
          console.log('Unable to set background image.');
        });
    } else if (imageInfo && (windowSize !== 'landscape' || !settings[ENABLE_BACKGROUND])) {
      // Remove image
      setImageInfo(undefined);
    }
  }, [imageInfo, windowSize, settings[ENABLE_BACKGROUND]]);

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

  // Render custom backdrop that uses height/width provided by
  // useWindowDimensions
  const customBackdrop = (
    <View
      style={{
        height,
        width,
        backgroundColor: colorValues.gray3,
      }}
      onTouchStart={() => setOverlay('none')}
    />
  );

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
        selected,
        setSelected,
      }}
      >
        <ImageBackground
          source={{
            uri: imageInfo?.uri,
          }}
          style={[styles.landscapeContainer, {
            backgroundColor: colorValues.background,
          }]}
          blurRadius={2}
          loadingIndicatorSource={{
            uri: '',
          }}
        >
          <View style={[{
            flex: 1,
            width: '100%',
            backgroundColor: colorValues.background,
            opacity: imageInfo ? 0.9 : 1.0,
          }]}
          >
            <SettingsContext.Provider value={{
              ...settings,
            }}
            >
              {windowSize === 'landscape' ? (
                <LandscapeHeader />
              ) : undefined}
              <TaskContext.Provider
                value={{
                  tasks,
                  selected,
                  setTasks,
                  setSelected,
                  handleAddTask,
                  handleChangeTask,
                  handleDeleteTask,
                }}
              >
                <TimerPage />
              </TaskContext.Provider>
              {windowSize === 'landscape' ? (
                <ImageContext.Provider
                  value={{
                    imageInfo,
                  }}
                >
                  <LandscapeFooter />
                </ImageContext.Provider>
              ) : undefined}
            </SettingsContext.Provider>
          </View>
        </ImageBackground>
        {windowSize === 'landscape' ? (
          <SettingsContext.Provider value={{
            ...settings,
            setSetting,
          }}
          >
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
              customBackdrop={customBackdrop}
              animationOutTiming={20}
              style={{
                // alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SettingsOverlay />
            </Modal>
            <Modal
              // TO-DO @unnameduser95: sort out image resizing issues on mobile platforms
              isVisible={overlay === 'introduction' && Platform.OS === 'web'}
              onBackdropPress={() => setOverlay('none')}
              backdropOpacity={0.3}
              backdropColor={colorValues.primary}
              animationIn="fadeIn"
              animationInTiming={20}
              animationOut="fadeOut"
              animationOutTiming={20}
              backdropTransitionInTiming={20}
              backdropTransitionOutTiming={20}
              customBackdrop={customBackdrop}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IntroductionOverlay />
            </Modal>
          </SettingsContext.Provider>
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
      selected,
      setSelected,
    }}
    >
      <SettingsContext.Provider value={{
        ...settings,
        setSetting,
      }}
      >
        <TaskContext.Provider
          value={{
            tasks,
            selected,
            setTasks,
            setSelected,
            handleAddTask,
            handleChangeTask,
            handleDeleteTask,
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
        </TaskContext.Provider>
      </SettingsContext.Provider>
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
