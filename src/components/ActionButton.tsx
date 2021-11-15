import React from 'react';
import {
  StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle,
} from 'react-native';
import ColorValues from '../styles/Color';
import TextStyles from '../styles/Text';

interface Props {
  style?: StyleProp<ViewStyle>,
  onPress?: () => any,
  text?: string,
}

/**
 * Action button (start/pause/resume)
 * @param param0
 * @returns
 */
function ActionButton({ style, onPress, text }: Props) {
  return (
    <TouchableOpacity
      style={[style, styles.container]}
      onPress={onPress}
    >
      <Text style={[TextStyles.textRegular, styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorValues.primary,
  },
  text: {
    color: ColorValues.background,
  },
});

ActionButton.defaultProps = {
  style: {},
  onPress: () => {},
  text: '',
};

export default ActionButton;
