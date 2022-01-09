import { StyleProp, TextStyle, ViewStyle } from 'react-native';

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
// interface SettingsData {
//   storageKey: string,
//   value: number | boolean,
//   selected: boolean,
// }

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
}

/**
 * Settings option prop with static properties only.
 */
interface SettingsOptionPropsStatic extends SettingsOptionProps {
  /**
   * `onChange` is disabled in the static prop. Use the
   * `useSettingsData` hook to link storage keys to `onChange` props and values.
   */
  onChange: undefined,
  /**
   * Use the `useSettingsData` hook to link storage keys to `onChange` props and values.
   */
  value: undefined,
  /**
   * Storage key to sync.
   */
  storageKey: string,
}

// /**
//  * Represents static data for a settings button.
//  * Note that the SettingOption button can be used outside of the
//  * useSettingsData hook.
//  */
// interface SettingsOptionProps {
//   title: string,
//   /* eslint-disable-next-line */
//   // onChange: (data: any) => any,
//   type: 'number' | 'toggle' | 'icon' | 'text',
//   /**
//    * Used for getting and saving data, as well as for identifying different options.
//    */
//   storageKey: string,
//   /**
//    * Validator function that runs code before the setting is saved.
//    *
//    * @returns If false returned, skips saving the value.
//    * If true is returned, saves the new value.
//    */
//   /* eslint-disable-next-line */
//   validator?: (input?: string | boolean) => Promise<boolean>,
// }

// /**
//  * Use if the settings option list does not involve storage data.
//  */
// interface SettingsOptionPropsNoStorage {
//   title: string,
//   type: 'number' | 'toggle' | 'icon' | 'text',
//   identifier: string,
//   data: number | boolean | string,
// }

interface Section {
  title: string,
  icon?: string,
  data: any[],
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
  // SettingsData,
  SettingsOptionProps,
  SettingsOptionPropsStatic,
  KeyboardShortcutGroup,
  Task,
  // SettingsOptionPropsNoStorage,
};
