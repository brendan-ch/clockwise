import React from 'react';
import {
  Platform,
  StyleSheet, ViewStyle, Animated, TouchableOpacity, Text,
} from 'react-native';
import useMouseAnimations from '../helpers/hooks/useMouseAnimations';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  /**
   * Whether the setting is selected.
   */
  selected?: boolean,
  style?: ViewStyle,
  text?: string,
  indicator?: string,
  onPress?: () => any,
}

/**
 * Settings selector for the settings overlay.
 * @param props
 * @returns
 */
function SettingsSelector({
  selected, style, text, onPress, indicator,
}: Props) {
  const colors = useTheme();

  const { mouseHoverAnimation, onMouseEnter, onMouseLeave } = useMouseAnimations();

  const textChild = (
    <Text style={[selected ? TextStyles.textBold : TextStyles.textRegular, {
      color: selected ? colors.background : colors.primary,
    }]}
    >
      {text}

    </Text>
  );

  const indicatorChild = (
    <Text
      style={[TextStyles.textRegular, {
        color: colors.gray3,
      }]}
    >
      {indicator}
    </Text>
  );

  if (Platform.OS === 'web') {
    return (
      <Animated.View
        style={[style, styles.container, {
          backgroundColor: selected ? colors.primary : colors.background,
          opacity: mouseHoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.8],
          }),
          // @ts-ignore
          cursor: 'pointer',
        }]}
        // @ts-ignore
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onPress}
      >
        {textChild}
        {indicatorChild}
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      style={[style, styles.container, {
        backgroundColor: selected ? colors.primary : colors.background,
      }]}
      onPress={onPress}
    >
      {textChild}
      {indicatorChild}
    </TouchableOpacity>
  );
}

SettingsSelector.defaultProps = {
  selected: false,
  style: {},
  text: '',
  indicator: '',
  onPress: () => {},
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SettingsSelector;
