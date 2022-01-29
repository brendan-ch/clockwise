import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, Text, Animated, Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import ClickableText from './ClickableText';

function LandscapeFooter() {
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
        color: colorValues.gray3,
      }]}
      >
        {'Created by '}
        <ClickableText
          text="@unnameduser95"
          onPress={() => Linking.openURL('https://github.com/unnameduser95')}
          style={[TextStyles.textRegular, {
            color: colorValues.gray3,
          }]}
        />
        {' | '}
        GitHub | Privacy Policy
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
