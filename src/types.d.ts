type TimerState = 'running' | 'paused' | 'stopped';
type Overlay = 'none' | 'settings' | 'command';

type KeyboardShortcutGroup = 'timer' | 'settings' | 'input' | 'settingsPage' | 'none';

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
 * Note that the SettingOption button can be used outside of the
 * useSettingsData hook.
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
  /**
   * Validator function that runs code before the setting is saved.
   *
   * @returns If false returned, skips saving the value.
   * If true is returned, saves the new value.
   */
  /* eslint-disable-next-line */
  validator?: (input?: string | boolean) => Promise<boolean>,
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
  completed?: boolean,
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
