import React from 'react';
import {
  StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle,
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
  return (
    <TouchableOpacity
      style={[style, styles.container]}
      onPress={onPress}
    >
      {isResetButton ? (
        <Ionicons name="refresh-outline" />
      ) : (
        <Text style={[TextStyles.textBold, styles.text]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorValues.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
