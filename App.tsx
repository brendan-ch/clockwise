import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import AppLoading from 'expo-app-loading';
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
import useWindowSize from './src/helpers/useWindowSize';
import HeaderButton from './src/components/HeaderButton';
import useTheme from './src/helpers/useTheme';
import SettingsOverlay from './src/overlays/SettingsOverlay';
import LandscapeHeader from './src/components/LandscapeHeader';
import LandscapeFooter from './src/components/LandscapeFooter';

const MIN_25 = 1500000;

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

  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardShortcutGroup>('none');

  // Helper methods
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
   */
  function clearTimerInterval() {
    clearTimeout(timeout);
    setTimeoutState(undefined);
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
        setTimerState,
        timeout,
        setTimeoutState,
        clearTimerInterval,
        overlay,
        setOverlay,
        keyboardGroup,
        setKeyboardGroup,
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
      setTimeRemaining,
      timerState,
      setTimerState,
      timeout,
      setTimeoutState,
      clearTimerInterval,
      overlay,
      setOverlay,
      keyboardGroup,
      setKeyboardGroup,
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
