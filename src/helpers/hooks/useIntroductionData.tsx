import React from 'react';
import { Text, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import ClickableText from '../../components/ClickableText';
import { IntroductionBlockProps } from '../../types';
import useTheme from './useTheme';
import TextStyles from '../../styles/Text';
import { NO_ADS_IMAGE, SETTINGS_IMAGE, TASKS_IMAGE } from '../../Assets';

/* eslint-disable global-require */

/**
 * Hook that returns introduction data.
 */
function useIntroductionData(): IntroductionBlockProps[] {
  const colorValues = useTheme();
  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink;

  const blocks: IntroductionBlockProps[] = [
    {
      title: 'Set up your tasks',
      image: TASKS_IMAGE,
      children: (
        <Text style={[TextStyles.textRegular, {
          color: colorValues.primary,
        }]}
        >
          Select tasks to work on during each session, so you never lose track of them.
          {'\n\n'}

          <ClickableText
            text="Learn more about the Pomodoro technique."
            onPress={() => WebBrowser.openBrowserAsync('https://en.wikipedia.org/wiki/Pomodoro_Technique', {
              enableBarCollapsing: true,
              dismissButtonStyle: 'close',
            })}
            style={[TextStyles.textRegular, {
              color: colorValues.gray3,
            }]}
          />
        </Text>
      ),
    },
    {
      title: 'Customize your timer',
      image: SETTINGS_IMAGE,
      children: (
        <Text
          style={[TextStyles.textRegular, {
            color: colorValues.primary,
          }]}
        >
          Change timer settings, color theme, and more in the settings.

        </Text>
      ),
    },
    {
      title: 'No ads or tracking',
      image: NO_ADS_IMAGE,
      children: (
        <Text style={[TextStyles.textRegular, {
          color: colorValues.primary,
        }]}
        >
          {'Your data stays on your device. See the '}
          <ClickableText
            text="Privacy Policy"
            onPress={() => Linking.openURL(privacyPolicyLink)}
            style={[TextStyles.textRegular, {
              color: colorValues.gray3,
            }]}
          />
          {' for more information.'}

        </Text>
      ),
    },
  ];

  return blocks;
}

export default useIntroductionData;
