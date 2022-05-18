import React, { useEffect, useRef } from 'react';
import {
  Text, View, Animated, StyleSheet, Pressable, Easing, StyleProp, ViewStyle,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface ButtonProps {
  highlighted?: boolean,
  text: string,
  onPress?: () => any,
  style?: StyleProp<ViewStyle>,
  keyboardSelected?: boolean,
}

function SelectionButton({
  highlighted, text, onPress, style, keyboardSelected,
}: ButtonProps) {
  const highlightAnimation = useRef(new Animated.Value(0)).current;
  const colors = useTheme();

  useEffect(() => {
    // Change animation status
    if (highlighted) {
      Animated.timing(highlightAnimation, {
        useNativeDriver: false,
        toValue: 1,
        easing: Easing.out(Easing.quad),
        duration: 180,
      }).start();
    } else {
      Animated.timing(highlightAnimation, {
        useNativeDriver: false,
        toValue: 0,
        easing: Easing.out(Easing.quad),
        duration: 180,
      }).start();
    }
  }, [highlighted]);

  return (
    <Pressable
      style={[buttonStyles.container, style]}
      onPress={onPress}
    >
      <View
        style={[
          buttonStyles.backgroundContainer,
        ]}
      >
        <Animated.View
          style={{
            backgroundColor: colors.primary,
            flex: highlightAnimation,
          }}
        />
      </View>
      <Text
        maxFontSizeMultiplier={1.0}
        style={[
          TextStyles.textRegular,
          buttonStyles.text,
          {
            color: highlighted ? colors.background : colors.gray3,
            zIndex: 1,
            textDecorationLine: keyboardSelected ? 'underline' : 'none',
          },
        ]}
      >
        {text}

      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    height: 35,
  },
  backgroundContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: -1,
    fontSize: 18,
  },
});

SelectionButton.defaultProps = {
  highlighted: false,
  onPress: () => {},
  style: {},
  keyboardSelected: false,
};

interface Props {
  selected: string,
  /**
   * Whether or not to underline the text in the button.
   */
  keyboardSelected?: boolean,
  options: string[],
  /* eslint-disable-next-line */
  onSelect?: (option: string) => any,
  style?: StyleProp<ViewStyle>,
  buttonStyle?: StyleProp<ViewStyle>,
}

/**
 * Bar that displays multiple options for selection.
 * @returns
 */
function SelectionBar({
  selected, options, onSelect, style, buttonStyle, keyboardSelected,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <SelectionButton
          /* eslint-disable-next-line */
          key={index}
          highlighted={selected === option}
          text={option}
          onPress={onSelect ? () => onSelect(option) : undefined}
          style={buttonStyle}
          keyboardSelected={keyboardSelected && selected === option}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

SelectionBar.defaultProps = {
  onSelect: () => {},
  style: {},
  buttonStyle: {},
  keyboardSelected: undefined,
};

export default SelectionBar;
