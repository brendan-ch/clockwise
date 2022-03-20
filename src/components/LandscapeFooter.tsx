import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, Text, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import ClickableText from './ClickableText';
import ImageContext from '../../ImageContext';
import handleOpenLink from '../helpers/handleOpenLink';
import { GITHUB_LINK, GITHUB_PROFILE_LINK, PRIVACY_POLICY_LINK } from '../Constants';

function LandscapeFooter() {
  const [hovering, setHovering] = useState(false);

  const privacyPolicyLink = PRIVACY_POLICY_LINK;
  const githubLink = GITHUB_LINK;
  const githubProfileLink = GITHUB_PROFILE_LINK;

  const opacityAnimation = useRef(new Animated.Value(1)).current;
  const colorValues = useTheme();
  const context = useContext(AppContext);

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
        {Platform.OS === 'web'
          ? (
            <Text>
              {'Created by '}
              <ClickableText
                text="Brendan C."
                onPress={githubProfileLink ? () => handleOpenLink(githubProfileLink) : undefined}
                style={[TextStyles.textRegular, {
                  color: colorValues.gray3,
                }]}
              />
              {' | '}
            </Text>
          )
          : undefined}
        <ClickableText
          text="Licenses"
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
