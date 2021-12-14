type TimerState = 'running' | 'paused' | 'stopped';
type Overlay = 'none' | 'settings' | 'command';

type KeyboardShortcutGroup = 'timer' | 'settings' | 'input' | 'none';

/**
 * Provides typings for React Navigation route parameters.
 */
type RootStackParamList = {
  Timer: undefined,
  Settings: undefined,
}

/**
 * Represents data for a settings button.
 */
interface SettingsData {
  storageKey: string,
  value: number | boolean,
  selected: boolean,
}

/**
 * Represents static data for a settings button.
 */
interface SettingsOptionProps {
  title: string,
  /* eslint-disable-next-line */
  // onChange: (data: any) => any,
  type: 'number' | 'toggle' | 'icon',
  /**
   * Used for getting and saving data, as well as for identifying different options.
   */
  storageKey: string,
}

interface Section {
  title: string,
  icon?: string,
  data: SettingsOptionProps[],
}

interface Task {
  title: string,
  estPomodoros: number,
  id: number,
  syncData: {
    notion?: {
      id: string,
      completionProp: string,
    },
  },
}

export {
  TimerState,
  RootStackParamList,
  Overlay,
  Section,
  SettingsData,
  SettingsOptionProps,
  KeyboardShortcutGroup,
  Task,
};
