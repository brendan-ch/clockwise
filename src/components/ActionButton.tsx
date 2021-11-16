import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ColorValues from '../styles/Color';
import TextStyles from '../styles/Text';

interface Props {
  style?: StyleProp<ViewStyle>,
  onPress?: () => any,
  isResetButton?: boolean,
  text?: string,
}

/**
 * Action button (start/pause/resume)
 * @param param0
 * @returns
 */
function ActionButton({
  style, onPress, text, isResetButton,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  // const fadeInvertAnimation = useRef(new Animated.Value(1)).current;

  function onPressOut() {
    setPressed(false);

    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1,
      useNativeDriver: true,
    }).start();
  }

  function onPressIn() {
    setPressed(true);

    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      style={[style, styles.container]}
      onPress={onPress}
      onPressIn={() => onPressIn()}
      onPressOut={() => onPressOut()}
    >
      {/* Overlay component and set default opacity to 0 */}
      <Animated.View style={[styles.animatedContainer, {
        opacity: fadeAnimation,
      }]}
      >
        {isResetButton ? (
          <Ionicons
            name="refresh-outline"
            color={ColorValues.primary}
            size={30}
          />
        ) : (
          <Text style={[TextStyles.textBold, styles.text, {
            color: ColorValues.primary,
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
          color={ColorValues.background}
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
            opacity: pressed ? 0 : 1,
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
};

export default ActionButton;
