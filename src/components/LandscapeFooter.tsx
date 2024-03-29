import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, Text, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppContext from '../../AppContext';
import TextStyles from '../styles/Text';
import ClickableText from './ClickableText';
import ImageContext from '../../ImageContext';
import handleOpenLink from '../helpers/handleOpenLink';
import {
  RELEASE_CODE,
} from '../Constants';
import getBaseURL from '../helpers/getBaseURL';

const baseUrl = getBaseURL();

function LandscapeFooter() {
  const [hovering, setHovering] = useState(false);
  const privacyPolicyLink = `${baseUrl}/privacy`;
  const githubLink = `${baseUrl}/github`;

  const opacityAnimation = useRef(new Animated.Value(1)).current;
  const context = useContext(AppContext);
  const colorValues = context.colors;

  const { imageInfo } = useContext(ImageContext);

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
        {imageInfo ? (
          <Text
            style={[TextStyles.textRegular, {
              color: colorValues.gray3,
            }]}
          >
            <Ionicons name="camera-outline" />
            {' '}
            <ClickableText
              text={`${imageInfo.author} on Unsplash`}
              style={[TextStyles.textRegular]}
              onPress={() => handleOpenLink(imageInfo.link)}
            />
            {' | '}
          </Text>
        ) : undefined}
        <ClickableText
          text="GitHub"
          onPress={githubLink ? () => handleOpenLink(githubLink) : undefined}
          style={[TextStyles.textRegular, {
            color: colorValues.gray3,
          }]}
        />
        {' | '}
        <ClickableText
          text="Privacy Policy"
          onPress={privacyPolicyLink ? () => handleOpenLink(privacyPolicyLink) : undefined}
          style={[TextStyles.textRegular, {
            color: colorValues.gray3,
          }]}
        />
        {' | '}
        v
        {RELEASE_CODE}
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
