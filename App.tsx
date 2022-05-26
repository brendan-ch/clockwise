import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import { Audio } from 'expo-av';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground, Platform, StyleSheet, useWindowDimensions, View,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Localization from 'expo-localization';

import AppContext from './AppContext';
import TimerPage from './src/pages/Timer';
import {
  DefaultSettingsState, ImageInfo, KeyboardShortcutGroup, Overlay, TimerMode,
} from './src/types';
import SettingsPage from './src/pages/SettingsPage';
import TextStyles from './src/styles/Text';
import useWindowSize from './src/helpers/hooks/useWindowSize';
import HeaderButton from './src/components/HeaderButton';
import useTheme from './src/helpers/hooks/useTheme';
import SettingsOverlay from './src/overlays/SettingsOverlay';
import LandscapeHeader from './src/components/LandscapeHeader';
import LandscapeFooter from './src/components/LandscapeFooter';
import { getData, prefillSettings, storeData } from './src/helpers/storage';
import usePageTitle from './src/helpers/hooks/usePageTitle';

/* eslint-disable-next-line */
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import {
  AUTO_APPEARANCE,
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  EXPORT_VERSION_KEY,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  SUPPRESS_INTRODUCTION,
  _24_HOUR_TIME,
} from './src/StorageKeys';
import SettingsContext from './SettingsContext';
import useTasks from './src/helpers/hooks/useTasks';
import TaskContext from './TaskContext';
import getBaseURL from './src/helpers/getBaseURL';
import ImageContext from './ImageContext';
import IntroductionOverlay from './src/overlays/IntroductionOverlay';
import IntroductionPage from './src/pages/IntroductionPage';
import { TIMER_SOUND } from './src/Assets';
import NewSiteMessage from './src/pages/NewSiteMessage';
import ImportSettingsPane from './src/overlays/settings/ImportSettings';
import { EXPORT_VERSION_NUM, REGIONS_WITH_12H_TIME } from './src/Constants';
import AppBanner from './src/components/AppBanner';
import getTimeKey from './src/helpers/getTimeKey';
import BackgroundSettingsPane from './src/overlays/settings/BackgroundSettings';
import AboutPane from './src/overlays/settings/About';
import RedirectPage from './src/pages/RedirectPage';
import useTimer from './src/helpers/hooks/useTimer';
import useKeyboardShortcutManager from './src/helpers/hooks/useKeyboardShortcutManager';

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Create prefix link
const prefix = Linking.createURL('/');

export default function App() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>();

  const [displayBanner, setDisplayBanner] = useState(
    Platform.OS === 'web'
    && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  );
  const [shortcutsInitialized, setShortcutsInitialized] = useState(false);
  // const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  // const [timerState, setTimerState] = useState<TimerState>('stopped');
  // const [timeout, setTimeoutState] = useState<any>(undefined);
  const [overlay, setOverlayState] = useState<Overlay>('none');
  // const [mode, setMode] = useState<TimerMode>('focus');

  // The current session number
  // Used to determine whether to switch to long break or short break
  const [currentSessionNum, setCurrentSessionNum] = useState(0);

  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardShortcutGroup>('none');

  const [sound, setSound] = useState<Audio.Sound | undefined>();

  // Initialize settings state here
  const [settings, setSettings] = useState<DefaultSettingsState>({
    [ENABLE_TIMER_ALERTS]: false,
    [FOCUS_TIME_MINUTES]: 25,
    [BREAK_TIME_MINUTES]: 5,
    [LONG_BREAK_ENABLED]: true,
    [LONG_BREAK_TIME_MINUTES]: 15,
    [LONG_BREAK_INTERVAL]: 4,
    [ENABLE_BACKGROUND]: false,
    [AUTO_APPEARANCE]: true,
    [DARK_MODE]: false,
    [_24_HOUR_TIME]: !(Localization.region && REGIONS_WITH_12H_TIME.includes(Localization.region)),
  });

  const {
    state,
    methods,
  } = useTimer(settings);
  const {
    timeRemaining,
    timerState,
    mode,
    start,
    timerLength,
    timerBackgrounded,
    timeout,
  } = state;
  const {
    setTimeRemaining,
    handleAutoStart,
    handleStateSwitch,
    startTimer,
    pauseTimer,
    stopTimer,
    setTimerBackgrounded,
    setMode,
  } = methods;

  const setPageTitle = usePageTitle('Clockwise', timeRemaining, timerState);
  const keyboardShortcutManager = useKeyboardShortcutManager();

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
      TIMER_SOUND,
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
   * Update a setting in the settings state.
   * @param key
   * @param value
   *
   * @todo Validate that key exists before setting.
   */
  function setSetting(key: string, value: boolean | number | string) {
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

  // Reset the timer when time reaches 0
  useEffect(() => {
    if (timeRemaining < 0) {
      const bumped = currentSessionNum + 1;

      // Update actual sessions of selected tasks
      if (mode === 'focus') {
        bumpActualPomodoros();
        // Bump number of total sessions
        setCurrentSessionNum(bumped);
      }

      // Call function depending on whether auto start is enabled
      getData(mode === 'focus' ? AUTO_START_BREAK : AUTO_START_FOCUS)
        .then((value) => {
          // Check if long breaks enabled
          const switchLongBreak = settings[LONG_BREAK_ENABLED]
            && bumped % settings[LONG_BREAK_INTERVAL] === 0;
          let newMode: TimerMode = 'focus';
          if (switchLongBreak && mode === 'focus') {
            newMode = 'longBreak';
          } else if (mode === 'focus') {
            newMode = 'break';
          }

          if (value === '1') {
            handleAutoStart(
              newMode,
            );
          } else {
            // Clear interval and set new state
            handleStateSwitch(newMode);
          }
        });

      // Play the timer sound
      getData(ENABLE_TIMER_SOUND)
        .then((value) => {
          if (value === '1') {
            playTimerSound();
          }
        });
    }
  }, [timeRemaining, sound]);

  // Set global keyboard shortcuts
  useEffect(() => {
    // Initialize keyboard shortcuts on web
    if (Platform.OS === 'web' && keyboardShortcutManager) {
      // Initialize overlay shortcuts
      keyboardShortcutManager.registerEvent({
        keys: ['Meta', ','],
        action: () => {
          setOverlay('settings');
        },
      });

      keyboardShortcutManager.registerEvent({
        keys: ['Control', ','],
        action: () => {
          setOverlay('settings');
        },
      });
    }

    setShortcutsInitialized(true);
  }, [keyboardShortcutManager]);

  // App + data setup, redirects
  useEffect(() => {
    // Timer and app initialiation
    loadTimerSound();
    // @unnameduser95 Add data migration here
    prefillSettings()
      .then(() => storeData(EXPORT_VERSION_KEY, `${EXPORT_VERSION_NUM}`))
      .then(() => {
        initializeSettingsData();
      });
  }, []);

  useEffect(() => {
    const timeKey = getTimeKey(mode);

    // Change timer display if timer is stopped
    // and timer setting changes
    if (timerState === 'stopped') {
      setTimeRemaining(
        // @ts-ignore
        settings[timeKey] * 60 * 1000,
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

  // Handle setting the introduction
  useEffect(() => {
    function setIntroduction() {
      getData(SUPPRESS_INTRODUCTION)
        .then((result) => {
          if (!result) {
            setOverlay('introduction');
          }
        });
    }

    if ((fontsLoaded && shortcutsInitialized) && windowSize === 'landscape') {
      // Set artificial timeout
      setTimeout(() => {
        setIntroduction();
      }, 500);
    } else if (windowSize === 'portrait') {
      setIntroduction();
    }
  }, [fontsLoaded, shortcutsInitialized]);

  // Links
  const config = {
    screens: {
      Timer: '',
      Settings: 'settings',
      'Data Management': 'settings/data-management',
      Appearance: 'settings/appearance',
      About: 'settings/about',
      Introduction: 'introduction',
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
    headerBackTitleStyle: TextStyles.textRegular,
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
      // @ts-ignore
      onClick={Platform.OS === 'web' ? () => setOverlay('none') : undefined}
    />
  );

  // Check for URL path that isn't in config
  if (Platform.OS === 'web'
    && window.location.pathname !== '/'
    && !Object.values(config.screens).includes(window.location.pathname.substring(1))
  ) {
    // Render a redirect page
    return (
      <RedirectPage />
    );
  }

  if (!(shortcutsInitialized && (Platform.OS === 'web' || fontsLoaded))) {
    return (
      <AppLoading />
    );
  }

  if (Platform.OS === 'web'
    && window.location.host.includes('session.vercel.app')
  ) {
    // Present redirect page
    return (
      <NewSiteMessage />
    );
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
        currentSessionNum,
        setCurrentSessionNum,
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
            setSettings,
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
            </TaskContext.Provider>
            <Modal
              isVisible={overlay === 'introduction'}
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
      currentSessionNum,
      setCurrentSessionNum,
    }}
    >
      <SettingsContext.Provider value={{
        ...settings,
        setSetting,
        setSettings,
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
          {displayBanner ? (
            <AppBanner
              onDismiss={() => setDisplayBanner(false)}
            />
          ) : undefined}
          <NavigationContainer
            linking={linking}
          >
            {overlay === 'introduction' ? (
              <Stack.Navigator>
                <Stack.Screen
                  name="Introduction"
                  component={IntroductionPage}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            ) : (
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
                    headerTitle: 'Settings',
                  }}
                />
                <Stack.Screen
                  name="Data Management"
                  component={ImportSettingsPane}
                  options={{
                    ...headerOptions,
                  }}
                />
                <Stack.Screen
                  name="Appearance"
                  component={BackgroundSettingsPane}
                  options={{
                    ...headerOptions,
                  }}
                />
                <Stack.Screen
                  name="About"
                  component={AboutPane}
                  options={{
                    ...headerOptions,
                  }}
                />
              </Stack.Navigator>
            )}
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
