import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import KeyboardShortcutManager from '../keyboardShortcutManager';

/**
 * Initialize and handle the keyboard shortcut manager.
 */
function useKeyboardShortcutManager() {
  const [
    keyboardShortcutManager, setKeyboardShortcutManager,
  ] = useState<KeyboardShortcutManager | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    // Create a new keyboard shortcut manager
    const manager = new KeyboardShortcutManager();
    setKeyboardShortcutManager(manager);
  }, []);

  return keyboardShortcutManager;
}

export default useKeyboardShortcutManager;
