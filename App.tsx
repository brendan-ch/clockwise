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
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppContext from './AppContext';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import TimerPage from './src/pages/Timer';
import { TimerState } from './src/types';
import SettingsPage from './src/pages/SettingsPage';
import TextStyles from './src/styles/Text';
import useWindowSize from './src/helpers/useWindowSize';

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

  // Helper methods
  /**
   * Clear the timer and set timeout state to undefined.
   */
  function clearTimerInterval() {
    clearTimeout(timeout);
    setTimeoutState(undefined);
  }

  // Hooks
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
  if (!fontsLoaded || !shortcutsInitialized) {
    return <AppLoading />;
  }

  // Do conditional rendering based on window size
  if (windowSize === 'small' || windowSize === 'landscape') {
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
      }}
      >
        <TimerPage />
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
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              headerShown: true,
              headerTitleStyle: TextStyles.textBold,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
