import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
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
  return (
    <TouchableOpacity
      style={selected ? [styles.containerFilled, styles.container] : styles.container}
      onPress={onPress}
    >
      <Text style={selected
        ? [TextStyles.textRegular, styles.textFilled]
        : [TextStyles.textRegular, styles.text]}
      >
        {text}
      </Text>
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
