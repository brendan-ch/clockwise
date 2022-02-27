import React from 'react';
import {
  StyleProp,
  StyleSheet, View, ViewStyle,
} from 'react-native';
import OverlayButton from './OverlayButton';

interface Props {
  leftButton?: {
    text: string,
    onPress: () => any,
    primary?: boolean,
  },
  rightButton?: {
    text: string,
    onPress: () => any,
    primary?: boolean,
  },
  style?: StyleProp<ViewStyle>,
}

/**
 * Display a set of buttons.
 */
function OverlayButtonBar({ leftButton, rightButton, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {leftButton ? (
        <OverlayButton
          text={leftButton.text}
          onPress={leftButton.onPress}
          primary={leftButton.primary}
        />
      ) : undefined}
      {rightButton ? (
        <OverlayButton
          text={rightButton.text}
          onPress={rightButton.onPress}
          primary={rightButton.primary}
        />
      ) : undefined}
    </View>
  );
}

OverlayButtonBar.defaultProps = {
  leftButton: undefined,
  rightButton: undefined,
  style: {},
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OverlayButtonBar;
