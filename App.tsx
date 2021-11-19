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

export default function App() {
  const [
    keyboardShortcutManager, setKeyboardShortcutManager,
  ] = useState<KeyboardShortcutManager | undefined>(undefined);
  const [shortcutsInitialized, setShortcutsInitialized] = useState(false);

  // Memoized context
  // const memoized = useMemo(() => ({
  //   keyboardShortcutManager,
  // }), []);

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
    }}
    >
      <TimerPage />
    </AppContext.Provider>
  );
}
