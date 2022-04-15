import { ReactChild } from 'react';
import {
  ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle,
} from 'react-native';
import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_BACKGROUND,
  ENABLE_TIMER_ALERTS,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
  _24_HOUR_TIME,
} from './StorageKeys';

type TimerState = 'running' | 'paused' | 'stopped';
type Overlay = 'none' | 'settings' | 'command' | 'introduction';
type TimerMode = 'focus' | 'break' | 'longBreak';

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
  type: 'number' | 'text' | 'toggle' | 'icon' | 'selection',
  /**
   * Value for the provided `type`.
   * For types `number` and `toggle`, this reflects the respective datatype.
   * For type `selection`, this is the selected option as a string.
   * for types `text` and `icon`, this is what to display on the right.
   */
  value?: boolean | number | string,
  /**
   * Run when the setting is changed.
   */
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  /**
   * If type is `selected`, this is the array of options to display to the user.
   * Otherwise has no effect.
   */
  selectionOptions?: string[],
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
   * Subtitle to display to the right of the text group.
   */
  indicator?: string,
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
  [LONG_BREAK_ENABLED]: boolean,
  [LONG_BREAK_INTERVAL]: number,
  [LONG_BREAK_TIME_MINUTES]: number,
  [ENABLE_BACKGROUND]: boolean,
  [AUTO_APPEARANCE]: boolean,
  [DARK_MODE]: boolean,
  [_24_HOUR_TIME]: boolean,
  /* eslint-disable-next-line */
  setSetting?: (key: string, value: number | boolean | string) => any,
  /* eslint-disable-next-line */
  setSettings?: (settings: any) => any,
}

interface ImageInfo {
  uri: string,
  author: string,
  link: string,
}

interface DefaultImageState {
  imageInfo?: ImageInfo,
}

interface IntroductionBlockProps {
  title: string,
  children: ReactChild,
  style?: StyleProp<ViewStyle>,
  imageStyle?: StyleProp<ImageStyle>,
  image?: ImageSourcePropType,
}

export {
  TimerState,
  TimerMode,
  RootStackParamList,
  Overlay,
  Section,
  SettingsOptionProps,
  SettingsOptionPropsStatic,
  KeyboardShortcutGroup,
  Task,
  DefaultSettingsState,
  DefaultImageState,
  ImageInfo,
  IntroductionBlockProps,
};
