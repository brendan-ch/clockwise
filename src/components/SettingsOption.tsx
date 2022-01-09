import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import Checkbox from './Checkbox';
import NumberBox from './NumberBox';

interface Props {
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

function SettingsOption({
  type,
  onPress,
  onPressRight,
  title,
  value,
  selected,
  onChange,
  onDeselect,
  iconLeft,
  onPressLeft,
  onInputBlur,
  onSelect, style, titleStyle, disabled, keyboardSelected, onChangeText, inputSelected,
}: Props) {
  const colors = useTheme();
  const {
    keyboardGroup,
    keyboardShortcutManager,
  } = useContext(AppContext);

  function handlePress() {
    if (type === 'toggle' && onChange && !disabled) {
      onChange(!value);
    } else if (onPress && !disabled) {
      onPress();
    }
  }

  useEffect(() => {
    if (keyboardSelected && keyboardGroup === 'settingsPage') {
      // Register keyboard shortcut to select item
      const unsubMethods: ((() => any) | undefined)[] = [];

      if (onSelect) {
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowRight'],
          action: () => onSelect(),
        }));
      }

      return () => {
        unsubMethods.forEach((method) => {
          if (method) {
            method();
          }
        });
      };
    }
    return () => {};
  }, [keyboardShortcutManager, keyboardGroup, keyboardSelected]);

  const ref = useRef<TextInput>();

  useEffect(() => {
    if (inputSelected) {
      ref.current?.focus();
    }
  }, [inputSelected]);

  const children = (
    <View
      style={[styles.container, {
        // @ts-ignore
        cursor: Platform.OS === 'web' ? 'pointer' : undefined,
      }, style]}
      onClick={Platform.OS === 'web' ? handlePress : undefined}
    >
      {/* <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      > */}
      {iconLeft ? (
        <Pressable
          onPress={onPressLeft}
          style={{
            width: 30,
            height: 35,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Ionicons
            // @ts-ignore
            name={iconLeft}
            size={20}
            color={colors.gray1}
            style={{
              marginRight: 10,
            }}
          />
        </Pressable>
      ) : undefined}
      {onChangeText ? (
        <View style={{
          flex: 1,
          height: 35,
        }}
        >
          <TextInput
            style={[TextStyles.textRegular, {
              color: colors.primary,
              borderWidth: 0,
              height: 35,
            }, titleStyle]}
            value={title}
            onChangeText={(text) => onChangeText(text)}
            // @ts-ignore
            ref={ref}
            onBlur={onInputBlur ? () => onInputBlur() : undefined}
          />
        </View>
      ) : (
        <Text
          style={[TextStyles.textRegular, {
            color: colors.primary,
            flex: 1,
          }, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}

        </Text>
      )}
      {/* </View> */}
      {type === 'toggle' ? (
        <Checkbox
          selected={value === true}
        />
      ) : undefined}
      {type === 'number' && !disabled ? (
        <NumberBox
          text={value || 0}
          selected={selected}
          onChange={onChange}
          onDeselect={onDeselect}
          keyboardSelected={keyboardSelected}
        />
      ) : undefined}
      {(type === 'number' && disabled) || type === 'text' ? (
        <Text style={[TextStyles.textRegular, {
          color: colors.primary,
        }]}
        >
          {value}

        </Text>
      ) : undefined}
      {type === 'icon' && typeof value === 'string' ? (
        <Pressable
          onPress={onPressRight}
          style={{
            flexDirection: 'row',
            width: 35,
            height: 35,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Ionicons
            // @ts-ignore
            name={value}
            size={20}
            color={colors.gray4}
          />
        </Pressable>
      ) : undefined}
    </View>
  );

  if (Platform.OS === 'web') {
    return children;
  }

  return (
    <TouchableOpacity
      onPress={() => handlePress()}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
});

SettingsOption.defaultProps = {
  onChange: () => {},
  onPress: () => {},
  onPressRight: () => {},
  onPressLeft: () => {},
  onSelect: () => {},
  title: '',
  value: false,
  selected: false,
  style: {},
  titleStyle: {},
  disabled: false,
  keyboardSelected: false,
  onChangeText: undefined,
  iconLeft: undefined,
  inputSelected: false,
  onInputBlur: () => {},
  onDeselect: () => {},
};

export default SettingsOption;
