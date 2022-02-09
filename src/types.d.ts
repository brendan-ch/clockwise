import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { BREAK_TIME_MINUTES, ENABLE_TIMER_ALERTS, FOCUS_TIME_MINUTES } from './StorageKeys';

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

interface SettingsOptionProps {
  /**
   * Indicates type of option displayed and value passed.
   */
  type: 'number' | 'text' | 'toggle' | 'icon',
  /**
   * Value for the provided `type`.
   */
  value?: boolean | number | string,
  /**
   * Run when the setting is changed.
   */
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  /**
   * Title to display for the settings component. If `onChangeText` is provided,
   * this acts as the value for the input component.
   */
  title?: string,
  /**
   * Subtitle to display below the title.
   */
  subtitle?: string,
  /**
   * Icon to display to the left of the title.
   */
  iconLeft?: string,
  /**
   * Run when the component is pressed.
   */
  onPress?: () => any,
  /**
   * If `value` is `icon`, runs when the icon on the right is pressed.
   */
  onPressRight?: () => any,
  /**
   * If `iconLeft` is populated, runs when the icon on the left is pressed.
   */
  onPressLeft?: () => any,
  /**
   * Run when the component is selected.
   */
  onSelect?: () => any,
  /**
   * Run when the component is deselected (if it's a number box)
   */
  onDeselect?: () => any,
  /**
   * Marks the component as selected. Only supported for type `number`.
   */
  selected?: boolean,
  style?: StyleProp<ViewStyle>,
  titleStyle?: StyleProp<TextStyle>,
  /**
   * Marks the component as view-only.
   */
  disabled?: boolean,
  /**
   * Indicates whether the component should display a keyboard
   * selected indicator.
   */
  keyboardSelected?: boolean,
  /**
   * Changes the title to an input field.
   */
  /* eslint-disable-next-line */
  onChangeText?: (text: string) => any,
  /**
   * Indicates whether the input should be focused.
   */
  inputSelected?: boolean,
  /**
   * Called when the input is blurred, if input is provided.
   */
  onInputBlur?: () => any,
  /**
   * Called when the input is selected, if input is provided.
   */
  onInputSelect?: () => any,
}

/**
 * Settings option prop with static properties only.
 */
interface SettingsOptionPropsStatic extends SettingsOptionProps {
  /**
   * `onChange` is disabled in the static prop. Use the
   * `useSettingsData` hook to link storage keys to `onChange` props and values.
   */
  onChange?: undefined,
  /**
   * Use the `useSettingsData` hook to link storage keys to `onChange` props and values.
   */
  value?: undefined,
  /**
   * Storage key to sync.
   */
  storageKey: string,
  /**
   * Title for the settings option. Must be unique when passed into `useSettingsData`.
   */
  title: string,
  /**
   * Function that runs before the data is saved.
   * Should return true if the data is valid, or false
   * if it isn't.
   */
  /* eslint-disable-next-line */
  validator?: (data: any) => Promise<boolean>,
}

interface Section {
  title: string,
  icon?: string,
  data: any[],
}

interface Task {
  title: string,
  estPomodoros: number,
  actualPomodoros?: number,
  id: number,
  syncData: {
    notion?: {
      id: string,
      completionProp: string,
    },
  },
  completed?: boolean,
}

interface DefaultSettingsState {
  [ENABLE_TIMER_ALERTS]: boolean,
  [FOCUS_TIME_MINUTES]: number,
  [BREAK_TIME_MINUTES]: number,
  /* eslint-disable-next-line */
  setSetting?: (key: string, value: number | boolean) => any,
}

interface DefaultImageState {
  imageInfo?: {
    uri: string,
    author: string,
    link: string,
  },
}

export {
  TimerState,
  RootStackParamList,
  Overlay,
  Section,
  SettingsOptionProps,
  SettingsOptionPropsStatic,
  KeyboardShortcutGroup,
  Task,
  DefaultSettingsState,
  DefaultImageState,
};
