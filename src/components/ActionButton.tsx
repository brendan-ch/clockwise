import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Platform,
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
  // willUpdateBackground?: boolean,
}

/**
 * Action button (start/pause/resume)
 * @param param0
 * @returns
 */
function ActionButton({
  style, onPress, text, isResetButton, haptics, background,
}: Props) {
  const colorValues = useTheme();

  const mouseHoverAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(background ? 1 : 0)).current;
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

  function onPressOut() {
    if (!background) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();
    }
  }

  function onPressButton() {
    if (haptics && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (onPress) {
      onPress();
    }
  }

  function onPressIn() {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1,
      useNativeDriver: true,
    }).start();
  }

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

  useEffect(() => {
    let timing: Animated.CompositeAnimation;

    if (background) {
      // Start animation timing
      timing = Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1,
        useNativeDriver: true,
      });
    } else {
      // Remove background
      timing = Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      });
    }

    timing.start();

    return () => timing.stop();
  }, [background]);

  return (
    <Animated.View
      style={[style, {
        opacity: mouseHoverAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      }]}
      // @ts-ignore
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <Pressable
        style={[styles.container, {
          backgroundColor: colorValues.primary,
        }]}
        onPressIn={() => onPressIn()}
        onPressOut={() => onPressOut()}
        onPress={() => onPressButton()}
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
          <AnimatedIonicons
            name="refresh-outline"
            color={colorValues.background}
            style={{
              opacity: fadeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              fontSize: 30,
            }}
          />
        ) : (
          <Animated.Text style={[
            TextStyles.textBold,
            styles.text,
            {
              opacity: fadeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              color: colorValues.background,
            },
          ]}
          >
            {text}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
  // willUpdateBackground: false,
};

export default ActionButton;
