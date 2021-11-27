import React, { useRef } from 'react';
import {
  Animated, Platform, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import ColorValues from '../styles/Color';
import TextStyles from '../styles/Text';

interface Props {
  text: string,
  onPress?: () => any,
  selected: boolean,
}

/**
 * Component that displays a page button.
 * @param props
 * @returns
 */
function PageButton({ text, onPress, selected }: Props) {
  const colorValues = useTheme();

  const mouseHoverAnimation = useRef(new Animated.Value(0)).current;

  function onMouseEnter() {
    Animated.timing(mouseHoverAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function onMouseLeave() {
    Animated.timing(mouseHoverAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  const children = (
    <Text style={selected
      ? [TextStyles.textRegular, styles.textFilled, {
        color: colorValues.background,
      }]
      : [TextStyles.textRegular, styles.text, {
        color: colorValues.primary,
      }]}
    >
      {text}
    </Text>
  );

  if (Platform.OS === 'web') {
    return (
      <Animated.View
        style={[styles.container, {
          borderColor: colorValues.primary,
          // @ts-ignore
          cursor: 'pointer',
          opacity: mouseHoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.8],
          }),
        }]}
        // @ts-ignore
        onClick={onPress}
        onMouseEnter={() => onMouseEnter()}
        onMouseLeave={() => onMouseLeave()}
      >
        {children}
      </Animated.View>
    );
  }
  return (
    <TouchableOpacity
      style={[styles.container, {
        borderColor: colorValues.primary,
      }]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

PageButton.defaultProps = {
  onPress: () => {},
};

const styles = StyleSheet.create({
  container: {
    // Fill space evenly
    flex: 1,
    // Centering the text
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: ColorValues.primary,
  },
  containerFilled: {
    backgroundColor: ColorValues.primary,
  },
  text: {
    fontSize: 20,
    color: ColorValues.primary,
  },
  textFilled: {
    fontSize: 20,
    color: ColorValues.background,
  },
});

export default PageButton;
