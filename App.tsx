import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import AppLoading from 'expo-app-loading';
// import AppLoading from 'expo-app-loading';
// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppContext from './AppContext';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';
import TimerPage from './src/pages/Timer';
import { TimerState } from './src/types';

const MIN_25 = 1500000;
// const MIN_5 = 300000;
// const INTERVAL = 1000;

export default function App() {
  const [
    keyboardShortcutManager, setKeyboardShortcutManager,
  ] = useState<KeyboardShortcutManager | undefined>(undefined);
  const [shortcutsInitialized, setShortcutsInitialized] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MIN_25);
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [timeout, setTimeoutState] = useState<any>(undefined);

  /**
   * Clear the timer and set timeout state to undefined.
   */
  function clearTimerInterval() {
    clearTimeout(timeout);
    setTimeoutState(undefined);
  }

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

  if (!fontsLoaded || !shortcutsInitialized) {
    return <AppLoading />;
  }

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
