import React from 'react';
import KeyboardShortcutManager from './src/helpers/keyboardShortcutManager';

interface DefaultAppState {
  keyboardShortcutManager?: KeyboardShortcutManager,
}

const defaultAppState: DefaultAppState = {
  keyboardShortcutManager: undefined,
};

const AppContext = React.createContext(defaultAppState);
export default AppContext;
