import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import ColorValues from '../styles/Color';
import TextStyles from '../styles/Text';
import useTheme from '../helpers/useTheme';

interface Props {
  style?: StyleProp<ViewStyle>,
  onPress?: () => any,
  isResetButton?: boolean,
  /**
   * Text displayed on the button.
   */
  text?: string,
  /**
   * Determines whether haptic feedback is enabled.
   */
  haptics?: boolean,
  /**
   * Determines whether the background should be visible at all times.
   */
  background?: boolean,
  /**
   * Prevents component flickering by choosing whether to enable
   * background updating on press out.
   */
  willUpdateBackground?: boolean,
}

/**
 * Action button (start/pause/resume)
 * @param param0
 * @returns
 */
function ActionButton({
  style, onPress, text, isResetButton, haptics, background, willUpdateBackground,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const colorValues = useTheme();

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  // const fadeInvertAnimation = useRef(new Animated.Value(1)).current;

  function onPressOut() {
    setPressed(false);

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (!willUpdateBackground) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();
    }
  }

  function onPressIn() {
    setPressed(true);

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (background) {
      // Start animation timing
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [background]);

  return (
    <Pressable
      style={[style, styles.container, {
        backgroundColor: colorValues.primary,
      }]}
      onPress={onPress}
      onPressIn={() => onPressIn()}
      onPressOut={() => onPressOut()}
    >
      {/* Overlay component and set default opacity to 0 */}
      <Animated.View style={[styles.animatedContainer, {
        backgroundColor: colorValues.background,
        borderColor: colorValues.primary,
        opacity: fadeAnimation,
      }]}
      >
        {isResetButton ? (
          <Ionicons
            name="refresh-outline"
            color={colorValues.primary}
            size={30}
          />
        ) : (
          <Text style={[TextStyles.textBold, styles.text, {
            color: colorValues.primary,
          }]}
          >
            {text}

          </Text>
        )}
      </Animated.View>
      {/* if not being pressed */}
      {isResetButton ? (
        <Ionicons
          name="refresh-outline"
          color={colorValues.background}
          size={30}
          style={{
            opacity: pressed ? 0 : 1,
          }}
        />
      ) : (
        <Text style={[
          TextStyles.textBold,
          styles.text,
          {
            opacity: pressed || background ? 0 : 1,
            color: colorValues.background,
          },
        ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorValues.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  animatedContainer: {
    backgroundColor: ColorValues.background,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderColor: ColorValues.primary,
    borderWidth: 2,
    borderRadius: 2,
  },
  text: {
    color: ColorValues.background,
    fontSize: 30,
  },
});

ActionButton.defaultProps = {
  style: {},
  onPress: () => {},
  text: '',
  isResetButton: false,
  haptics: false,
  background: false,
  willUpdateBackground: false,
};

export default ActionButton;
