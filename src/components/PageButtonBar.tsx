import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import ColorValues from '../styles/Color';
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
  const widthAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected === 'focus') {
      // Run animation timing to left

      Animated.timing(widthAnimation, {
        toValue: 0,
        duration: 100,
        // easing: Easing.back(1),
        useNativeDriver: true,
      }).start();
    } else if (selected === 'break') {
      // Run animation timing to right

      Animated.timing(widthAnimation, {
        toValue: 1,
        duration: 100,
        // easing: Easing.back(1),
        useNativeDriver: true,
      }).start();
    }
  }, [selected]);

  return (
    <View style={[style, styles.container]}>
      <View style={styles.backgroundContainer}>
        <Animated.View style={{
          // width: `${widthAnimation}%`,
          // width: widthAnimation,
          flex: widthAnimation,
          height: '100%',
        }}
        />
        <View style={styles.backgroundRectangle} />
      </View>
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
  backgroundContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    // backgroundColor: '#000000',
  },
  backgroundRectangle: {
    width: '50%',
    height: '100%',
    backgroundColor: ColorValues.primary,
  },
  // backgroundRectangleSelected: {

  // },
});

export default PageButtonBar;
