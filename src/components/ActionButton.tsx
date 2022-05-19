import React, { useRef, useEffect, useState } from 'react';
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
import useTheme from '../helpers/hooks/useTheme';
import handleHaptic from '../helpers/handleHaptic';

interface Props {
  style?: StyleProp<ViewStyle>,
  onPress?: () => any,
  isIconButton?: boolean,
  /**
   * Text displayed on the button.
   */
  value?: string,
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
  style, onPress, value, isIconButton, haptics, background,
}: Props) {
  const [backgroundState, setBackgroundState] = useState(background || false);
  const colorValues = useTheme();

  const mouseHoverAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(background ? 1 : 0)).current;
  // const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

  useEffect(() => {
    if (background !== undefined) {
      setBackgroundState(background);
    }
  }, [background]);

  function onPressOut() {
    if (!background) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();

      setBackgroundState(false);
    }
  }

  function onPressButton() {
    if (haptics && Platform.OS !== 'web') {
      handleHaptic('impact', Haptics.ImpactFeedbackStyle.Medium);
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

    if (!background) {
      setBackgroundState(true);
    }
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
          {isIconButton ? (
            <Ionicons
              // @ts-ignore
              name={value}
              color={colorValues.primary}
              size={30}
            />
          ) : (
            <Text
              style={[TextStyles.textBold, styles.text, {
                color: colorValues.primary,
              }]}
              maxFontSizeMultiplier={1.35}
            >
              {value}

            </Text>
          )}
        </Animated.View>
        {/* if not being pressed */}
        {isIconButton ? (
          <Ionicons
            // @ts-ignore
            name={value}
            color={backgroundState ? colorValues.primary : colorValues.background}
            size={30}
          />
          // <AnimatedIonicons
          //   // @ts-ignore
          //   name={value}
          //   color={colorValues.background}
          //   style={{
          //     opacity: fadeAnimation.interpolate({
          //       inputRange: [0, 1],
          //       outputRange: [1, 0],
          //     }),
          //   }}
          //   size={30}
          // />
        ) : (
          <Animated.Text
            maxFontSizeMultiplier={1.35}
            style={[
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
            {value}
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
  value: '',
  isIconButton: false,
  haptics: false,
  background: false,
  // willUpdateBackground: false,
};

export default ActionButton;
