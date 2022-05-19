import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface ButtonProps {
  text: string,
  onPress: () => any,
  primary?: boolean,
}

export default function OverlayButton({ text, onPress, primary }: ButtonProps) {
  const colors = useTheme();

  return (
    <TouchableOpacity
      style={[buttonStyles.container, {
        backgroundColor: primary ? colors.primary : colors.background,
        borderColor: colors.primary,
      }]}
      onPress={() => onPress()}
    >
      <Text
        style={[TextStyles.textRegular, {
          color: primary ? colors.background : colors.primary,
        }]}
        maxFontSizeMultiplier={1.35}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

OverlayButton.defaultProps = {
  primary: false,
};

const buttonStyles = StyleSheet.create({
  container: {
    height: 40,
    flexGrow: 0,
    flexBasis: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 2,
    borderWidth: 1,
  },
});
