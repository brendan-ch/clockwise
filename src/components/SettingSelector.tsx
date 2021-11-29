import React from 'react';
import {
  StyleSheet, Text, ViewStyle, Animated,
} from 'react-native';
import useMouseAnimations from '../helpers/useMouseAnimations';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  /**
   * Whether the setting is selected.
   */
  selected?: boolean,
  style?: ViewStyle,
  text?: string,
  onPress?: () => any,
}

/**
 * Settings selector for the settings overlay.
 * @param props
 * @returns
 */
function SettingsSelector({
  selected, style, text, onPress,
}: Props) {
  const colors = useTheme();

  const { mouseHoverAnimation, onMouseEnter, onMouseLeave } = useMouseAnimations();

  return (
    <Animated.View
      style={[style, styles.container, selected ? {
        backgroundColor: colors.gray5,
        opacity: mouseHoverAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      } : undefined]}
      // @ts-ignore
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onPress}
    >
      <Text style={[selected ? TextStyles.textBold : TextStyles.textRegular, {
        color: colors.primary,
      }]}
      >
        {text}

      </Text>
    </Animated.View>
  );
}

SettingsSelector.defaultProps = {
  selected: false,
  style: {},
  text: '',
  onPress: () => {},
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    justifyContent: 'center',
    cursor: 'pointer',
  },
});

export default SettingsSelector;