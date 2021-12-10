import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, Text, Animated, Platform,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

function LandscapeFooter() {
  const sampleText = 'Text';
  const displayText = false;

  const [hovering, setHovering] = useState(false);

  const opacityAnimation = useRef(new Animated.Value(1)).current;
  const colorValues = useTheme();
  const context = useContext(AppContext);

  useEffect(() => {
    if (context.timerState === 'running' && !hovering) {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [context.timerState, hovering]);

  return (
    <Animated.View
      style={[styles.container, {
        opacity: opacityAnimation,
      }]}
      // @ts-ignore
      onMouseEnter={Platform.OS === 'web' ? () => setHovering(true) : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setHovering(false) : undefined}
    >
      <Text style={[TextStyles.textRegular, {
        color: colorValues.gray4,
      }]}
      >
        {displayText ? sampleText : undefined}

      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandscapeFooter;
