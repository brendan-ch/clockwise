import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  ViewStyle,
  StyleProp, TextStyle,
  StyleSheet, Pressable, Text, View,
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
}

/**
 * Selector component that is displayed in task list.
 */
function Selector({
  text, iconRight, iconLeft, onPressLeft, onPressRight, onPress, subtitle, textStyle, style,
}: Props) {
  const [hovering, setHovering] = useState<'none' | 'leftIcon' | 'rightIcon'>('none');

  const colorValues = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
    >
      {iconLeft ? (
        <Pressable
          onPress={onPressLeft}
          style={[styles.iconContainer, {
            marginRight: 5,
          }]}
        >
          {/* @ts-ignore */}
          <Ionicons name={iconLeft} size={20} />
        </Pressable>
      ) : undefined}
      <View style={[styles.textContainer]}>
        <Text style={[TextStyles.textRegular, textStyle]}>{text}</Text>
        {subtitle ? (
          <Text>{subtitle}</Text>
        ) : undefined}
      </View>
      {iconRight && Platform.OS === 'web' ? (
        <View
          // @ts-ignore
          onClick={onPressRight}
          onMouseEnter={() => setHovering('rightIcon')}
          onMouseLeave={() => setHovering('none')}
          style={[styles.iconContainer, {
            marginLeft: 5,
          }]}
        >
          <Ionicons
            // @ts-ignore
            name={iconRight}
            size={20}
            color={hovering === 'rightIcon' ? colorValues.gray3 : colorValues.gray4}
          />
        </View>
      ) : undefined}
      {iconRight && Platform.OS !== 'web' ? (
        <Pressable
          onPress={onPressRight}
          style={[styles.iconContainer, {
            marginLeft: 5,
          }]}
        >
          {/* @ts-ignore */}
          <Ionicons name={iconRight} size={20} color={colorValues.gray4} />
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
};

export default Selector;
