type TimerState = 'running' | 'paused' | 'stopped';
type Overlay = 'none' | 'settings' | 'command';

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
}

/**
 * Represents static data for a settings button.
 */
interface SettingsOptionProps {
  title: string,
  /* eslint-disable-next-line */
  // onChange: (data: any) => any,
  type: 'number' | 'toggle',
  /**
   * Used for getting and saving data, as well as for identifying different options.
   */
  storageKey: string,
}

interface Section {
  title: string,
  data: SettingsOptionProps[],
}

export {
  TimerState,
  RootStackParamList,
  Overlay,
  Section,
  SettingsData,
  SettingsOptionProps,
};
