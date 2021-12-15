import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect } from 'react';
import {
  Platform, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import Checkbox from './Checkbox';
import NumberBox from './NumberBox';

interface Props {
  type: 'number' | 'toggle' | 'icon',
  value?: boolean | number | string,
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  title?: string,
  onPress?: () => any,
  onSelect?: () => any,
  selected?: boolean,
  style?: StyleProp<ViewStyle>,
  disabled?: boolean,
  keyboardSelected?: boolean,
}

function SettingsOption({
  type, onPress, title, value, selected, onChange, onSelect, style, disabled, keyboardSelected,
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
          keys: ['Enter'],
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
      <Text style={[TextStyles.textRegular, {
        color: colors.primary,
      }]}
      >
        {title}

      </Text>
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
        <Ionicons
          // @ts-ignore
          name={value}
          size={20}
          color={colors.gray4}
        />
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
  onSelect: () => {},
  title: '',
  value: false,
  selected: false,
  style: {},
  disabled: false,
  keyboardSelected: false,
};

export default SettingsOption;
