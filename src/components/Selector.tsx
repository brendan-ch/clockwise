import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  ViewStyle,
  StyleProp, TextStyle,
  StyleSheet, Pressable, Text, View, TextInput,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  text?: string,
  subtitle?: string,
  style?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  iconRight?: string,
  iconLeft?: string,
  onPressLeft?: () => any,
  onPressRight?: () => any,
  onPress?: () => any,
  /* eslint-disable-next-line */
  onChangeText?: (text: string) => any,
}

/**
 * Selector component that is displayed in task list.
 */
function Selector({
  text,
  iconRight,
  iconLeft,
  onPressLeft,
  onPressRight,
  onPress, subtitle, textStyle, style, onChangeText,
}: Props) {
  const [hovering, setHovering] = useState<'none' | 'text' | 'leftIcon' | 'rightIcon'>('none');

  const colorValues = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      // @ts-ignore
      onMouseEnter={Platform.OS === 'web' ? () => setHovering('text') : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setHovering('none') : undefined}
    >
      {iconLeft ? (
        <Pressable
          onPress={onPressLeft}
          style={[styles.iconContainer, {
            marginRight: 5,
          }]}
          // @ts-ignore
          onMouseEnter={Platform.OS === 'web' ? () => setHovering('leftIcon') : undefined}
          onMouseLeave={Platform.OS === 'web' ? () => setHovering('text') : undefined}
        >
          {/* @ts-ignore */}
          <Ionicons name={iconLeft} size={20} color={colorValues.primary} />
        </Pressable>
      ) : undefined}
      {onChangeText ? (
        <TextInput
          style={[TextStyles.textRegular, textStyle, {
            color: colorValues.primary,
          }]}
          value={text}
          onChangeText={(newText) => onChangeText(newText)}
        />
      ) : (
        <View
          style={[styles.textContainer]}
        >
          <Text style={[TextStyles.textRegular, textStyle, {
            color: colorValues.primary,
          }]}
          >
            {text}

          </Text>
          {subtitle ? (
            <Text>{subtitle}</Text>
          ) : undefined}
        </View>
      )}
      {iconRight ? (
        <Pressable
          onPress={onPressRight}
          style={[styles.iconContainer, {
            marginLeft: 5,
          }]}
        >
          <Ionicons
            // @ts-ignore
            name={iconRight}
            size={20}
            color={hovering === 'text' ? colorValues.gray3 : colorValues.gray4}
          />
        </Pressable>
      ) : undefined}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Selector.defaultProps = {
  text: '',
  subtitle: undefined,
  iconRight: undefined,
  iconLeft: undefined,
  onPressLeft: () => {},
  onPressRight: () => {},
  onPress: () => {},
  textStyle: {},
  style: {},
  onChangeText: undefined,
};

export default Selector;
