import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import PageButton from './PageButton';

interface Props {
  /**
   * Customize the container view (e.g. changing the width and height).
   */
  style?: StyleProp<ViewStyle>
  /**
   * Action to take on focus button press.
   */
  onPressFocus?: () => any,
  /**
   * Action to take on break button press.
   */
  onPressBreak?: () => any,
  /**
   * Indicates which button to highlight.
   */
  selected: 'focus' | 'break',
}

/**
 * Component which contains the Focus and Break buttons.
 */
function PageButtonBar({
  style, selected, onPressFocus, onPressBreak,
}: Props) {
  return (
    <View style={[style, styles.container]}>
      <PageButton
        text="focus"
        onPress={onPressFocus}
        selected={selected === 'focus'}
      />
      <PageButton
        text="break"
        onPress={onPressBreak}
        selected={selected === 'break'}
      />
    </View>
  );
}

PageButtonBar.defaultProps = {
  onPressFocus: () => {},
  onPressBreak: () => {},
  style: {},
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default PageButtonBar;
