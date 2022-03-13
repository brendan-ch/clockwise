import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  // StyleProp,
  StyleSheet,
  Text,
  TextInput,
  // TextStyle,
  TouchableOpacity,
  View,
  // ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import Checkbox from './Checkbox';
import NumberBox from './NumberBox';
import { SettingsOptionProps } from '../types';

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
  onInputSelect,
  onSelect,
  style,
  titleStyle, disabled, keyboardSelected, onChangeText, inputSelected, subtitle, indicator,
}: SettingsOptionProps) {
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

      /**
       * @todo Move this logic up to the timer settings page
       * or task list.
       */
      if (onSelect && type === 'number') {
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowRight'],
          action: () => onSelect(),
        }));
      } else if (onChange && type === 'toggle') {
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowRight'],
          action: () => onChange(!value),
        }));
      } else if (onPress && type === 'icon') {
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowRight'],
          action: () => onPress(),
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
  }, [
    keyboardShortcutManager, keyboardGroup, keyboardSelected, onPress, onSelect,
  ]);

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
      {onChangeText && !disabled ? (
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
              backgroundColor: colors.gray5,
              borderRadius: 1,
              paddingLeft: 5,
            }, titleStyle]}
            value={title}
            onChangeText={(text) => onChangeText(text)}
            // @ts-ignore
            ref={ref}
            onBlur={onInputBlur ? () => onInputBlur() : undefined}
            onFocus={onInputSelect ? () => onInputSelect() : undefined}
          />
        </View>
      ) : (
        <View style={[styles.titleContainer]}>
          <Text
            style={[TextStyles.textRegular, {
              color: colors.primary,
            }, titleStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[TextStyles.textItalic, {
                color: colors.primary,
                fontSize: 10,
                marginTop: 3,
              }]}
            >
              {subtitle}
            </Text>
          ) : undefined}
        </View>
      )}
      {/* Display right side subtitle as indicator */}
      {indicator ? (
        <Text
          style={[TextStyles.textRegular, {
            color: colors.gray3,
            marginLeft: 3,
          }]}
        >
          {indicator}
        </Text>
      ) : undefined}
      {type === 'toggle' ? (
        <Checkbox
          selected={value === true}
          keyboardSelected={keyboardSelected}
          disabled={disabled}
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
          textDecorationLine: keyboardSelected ? 'underline' : undefined,
          textDecorationColor: keyboardSelected ? colors.primary : undefined,
          marginLeft: 3,
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
            width: 32,
            height: 32,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft: 0,
          }}
        >
          <Ionicons
            // @ts-ignore
            name={value}
            size={20}
            color={colors.gray4}
            style={{
              textDecorationColor: keyboardSelected ? colors.gray4 : undefined,
              textDecorationLine: keyboardSelected ? 'underline' : undefined,
            }}
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
  /**
   * Styling for the layout of the title and subtitle.
   */
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
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
