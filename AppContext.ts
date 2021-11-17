import React from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
};

const DefaultAppContext = React.createContext(defaultAppState);
export default DefaultAppContext;
