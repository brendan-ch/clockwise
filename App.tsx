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
  ImageBackground, Platform, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContext from './AppContext';
import TimerPage from './src/pages/Timer';
import {
  KeyboardShortcutGroup, Overlay, TimerMode,
} from './src/types';
import SettingsPage from './src/pages/SettingsPage';
import TextStyles from './src/styles/Text';
import useWindowSize from './src/helpers/hooks/useWindowSize';
import HeaderButton from './src/components/HeaderButton';
import useTheme from './src/helpers/hooks/useTheme';
import SettingsOverlay from './src/overlays/SettingsOverlay';
import LandscapeHeader from './src/components/LandscapeHeader';
import LandscapeFooter from './src/components/LandscapeFooter';
import { getData, storeData } from './src/helpers/storage';
import usePageTitle from './src/helpers/hooks/usePageTitle';

/* eslint-disable-next-line */
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import {
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  ENABLE_TIMER_SOUND,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  SUPPRESS_APP_EXPIRATION_MESSAGE,
  SUPPRESS_DOMAIN_MESSAGE,
  SUPPRESS_INTRODUCTION,
} from './src/StorageKeys';
import SettingsContext from './SettingsContext';
import useTasks from './src/helpers/hooks/useTasks';
import TaskContext from './TaskContext';
import ImageContext from './ImageContext';
import IntroductionOverlay from './src/overlays/IntroductionOverlay';
import IntroductionPage from './src/pages/IntroductionPage';
import { TIMER_SOUND } from './src/Assets';
import NewSiteMessage from './src/pages/NewSiteMessage';
import ImportSettingsPane from './src/overlays/settings/ImportSettings';
import getTimeKey from './src/helpers/getTimeKey';
import BackgroundSettingsPane from './src/overlays/settings/BackgroundSettings';
import AboutPane from './src/overlays/settings/About';
import useTimer from './src/helpers/hooks/useTimer';
import useKeyboardShortcutManager from './src/helpers/hooks/useKeyboardShortcutManager';
import useImageInfo from './src/helpers/hooks/useImageInfo';
import useSettingsState from './src/helpers/hooks/useSettingsState';
import MessageBanner from './src/components/MessageBanner';
import ClickableText from './src/components/ClickableText';
import handleOpenLink from './src/helpers/handleOpenLink';

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Create prefix link
const prefix = Linking.createURL('/');

export default function App() {
  const [displayBanner, setDisplayBanner] = useState(false);
  const [displayAppExpirationBanner, setDisplayAppExpirationBanner] = useState(false);

  const [shortcutsInitialized, setShortcutsInitialized] = useState(false);
  const [overlay, setOverlayState] = useState<Overlay>('none');

  // The current session number
  // Used to determine whether to switch to long break or short break
  const [currentSessionNum, setCurrentSessionNum] = useState(0);

  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardShortcutGroup>('none');

  const [sound, setSound] = useState<Audio.Sound | undefined>();

  const { settings, setSettings, setSetting } = useSettingsState();

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
  const imageInfo = useImageInfo(settings);

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
    await sound?.playFromPositionAsync(0);
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
      if (settings[ENABLE_TIMER_SOUND]) {
        playTimerSound();
      }
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

    // Determine whether to set banner
    getData(SUPPRESS_DOMAIN_MESSAGE)
      .then((value) => {
        if (value !== '1' && Platform.OS === 'web' && !window.location.host.includes('clockwise.bchen.dev')) {
          // Set state to true
          setDisplayBanner(true);
        }
      });

    getData(SUPPRESS_APP_EXPIRATION_MESSAGE)
      .then((value) => {
        if (value !== '1' && Platform.OS !== 'web') {
          // Set state to true
          setDisplayAppExpirationBanner(true);
        }
      });
  }, []);

  useEffect(() => (sound ? () => {
    sound?.unloadAsync();
  } : () => {}), [sound]);

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

  const DomainBanner = displayBanner ? (
    (
      <MessageBanner
        onDismiss={() => {
          setDisplayBanner(false);
          storeData(SUPPRESS_DOMAIN_MESSAGE, '1');
        }}
        onClick={() => {
          handleOpenLink('https://bchen.dev/doc/clockwise-migrate');
        }}
      >
        <Text
          style={[TextStyles.textRegular, {
            color: colorValues.background,
          }]}
        >
          The default domain for Clockwise is now
          {' '}
          <ClickableText
            text="clockwise.bchen.dev"
            onPress={() => handleOpenLink('https://clockwise.bchen.dev')}
            style={[TextStyles.textBold, {
              color: colorValues.background,
            }]}
          />
          . The app will continue to be accessible from clockwise.sh until February 1st,
          2023. Click this banner to learn more about migrating your data.
        </Text>
      </MessageBanner>
    )
  ) : undefined;

  const AppMigrateBanner = displayAppExpirationBanner ? (
    <MessageBanner
      onDismiss={() => {
        setDisplayAppExpirationBanner(false);
        storeData(SUPPRESS_APP_EXPIRATION_MESSAGE, '1');
      }}
      onClick={() => {
        handleOpenLink('https://bchen.dev/doc/clockwise-app');
      }}
    >
      <Text
        style={[TextStyles.textRegular, {
          color: colorValues.background,
        }]}
      >
        Starting February 7th, 2023, Clockwise will no longer be available for download from
        {' '}
        {Platform.OS === 'android' ? 'Google Play' : 'the App Store'}
        . Click this message to learn more.
      </Text>
    </MessageBanner>
  ) : undefined;

  // Do conditional rendering based on window size
  if (windowSize === 'small' || windowSize === 'landscape') {
    // Return just the timer (with context provider)
    return (
      <SafeAreaProvider>
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
          colors: colorValues,
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
          >
            <View style={[{
              flex: 1,
              width: '100%',
              backgroundColor: colorValues.background,
              opacity: imageInfo?.uri
                ? 0.9
                : 1.0,
            }]}
            >
              <SettingsContext.Provider value={{
                ...settings,
              }}
              >
                {DomainBanner}
                {AppMigrateBanner}
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
      </SafeAreaProvider>
    );
  }

  // Otherwise return stack navigator
  return (
    <SafeAreaProvider>
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
        colors: colorValues,
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
            {DomainBanner}
            {AppMigrateBanner}
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
    </SafeAreaProvider>
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
