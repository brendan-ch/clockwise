import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect } from 'react';
import {
  Platform, Pressable, StyleProp, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import Checkbox from './Checkbox';
import NumberBox from './NumberBox';

interface Props {
  /**
   * Indicates type of option displayed and value passed.
   */
  type: 'number' | 'toggle' | 'icon',
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
   * Run when the component is pressed.
   */
  onPress?: () => any,
  /**
   * If `value` is `icon`, runs when the icon on the right is pressed.
   */
  onPressRight?: () => any,
  /**
   * Run when the component is selected.
   */
  onSelect?: () => any,
  /**
   * Marks the component as selected. Only supported for type `number`.
   */
  selected?: boolean,
  style?: StyleProp<ViewStyle>,
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
}

function SettingsOption({
  type,
  onPress,
  onPressRight,
  title,
  value,
  selected,
  onChange,
  onSelect, style, disabled, keyboardSelected, onChangeText,
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

  const children = (
    <View
      style={[styles.container, {
        // @ts-ignore
        cursor: Platform.OS === 'web' ? 'pointer' : undefined,
      }, style]}
      onClick={Platform.OS === 'web' ? handlePress : undefined}
    >
      {onChangeText ? (
        <TextInput
          style={[TextStyles.textRegular, {
            color: colors.primary,
            width: '100%',
            borderWidth: 0,
          }]}
          value={title}
          onChangeText={(text) => onChangeText(text)}
        />
      ) : (
        <Text style={[TextStyles.textRegular, {
          color: colors.primary,
        }]}
        >
          {title}

        </Text>
      )}
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
          onSelect={onSelect}
          keyboardSelected={keyboardSelected}
        />
      ) : undefined}
      {type === 'number' && disabled ? (
        <Text style={[TextStyles.textRegular, {
          color: colors.primary,
        }]}
        >
          {value}

        </Text>
      ) : undefined}
      {type === 'icon' && typeof value === 'string' ? (
        <Pressable onPress={onPressRight}>
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
  onSelect: () => {},
  title: '',
  value: false,
  selected: false,
  style: {},
  disabled: false,
  keyboardSelected: false,
  onChangeText: undefined,
};

export default SettingsOption;
