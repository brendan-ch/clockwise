import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
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

  return (
    <TouchableOpacity
      style={selected ? [
        styles.container, {
          backgroundColor: colorValues.primary,
          borderColor: colorValues.primary,
        },
      ] : [styles.container, {
        borderColor: colorValues.primary,
      }]}
      onPress={onPress}
    >
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
