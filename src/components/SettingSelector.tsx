import React from 'react';
import {
  StyleSheet, ViewStyle, Animated,
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
      style={[style, styles.container, {
        backgroundColor: selected ? colors.primary : colors.background,
        opacity: mouseHoverAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      }]}
      // @ts-ignore
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onPress}
    >
      <Animated.Text style={[selected ? TextStyles.textBold : TextStyles.textRegular, {
        color: selected ? colors.background : colors.primary,
      }]}
      >
        {text}

      </Animated.Text>
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
