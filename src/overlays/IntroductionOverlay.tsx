import React, {
  useEffect, useContext,
} from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet, Text, Linking,
} from 'react-native';
import Constants from 'expo-constants';
import AppContext from '../../AppContext';
import ClickableText from '../components/ClickableText';
import IntroductionBlock from '../components/IntroductionBlock';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from '../components/OverlayButtonBar';
import { storeData } from '../helpers/storage';
import { SUPPRESS_INTRODUCTION } from '../StorageKeys';

/* eslint-disable global-require */

interface Props {
  containerStyle?: StyleProp<ViewStyle>,
}

/**
 * Content for the settings modal.
 */
function IntroductionOverlay({ containerStyle }: Props) {
  const { background } = useTheme();
  const {
    keyboardShortcutManager,
    setOverlay,
    keyboardGroup,
    setPageTitle,
  } = useContext(AppContext);

  const colorValues = useTheme();

  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink;

  useEffect(() => {
    // Set storage option
    storeData(SUPPRESS_INTRODUCTION, '1');
  }, []);

  useEffect(() => {
    setPageTitle('Welcome!');

    return () => setPageTitle('Timer');
  }, []);

  useEffect(() => {
    if (keyboardShortcutManager) {
      const unsubscribe = keyboardShortcutManager.registerEvent({
        keys: ['Escape'],
        action: () => setOverlay('none'),
      });

      return () => unsubscribe();
    }

    return () => {};
  }, [keyboardGroup, keyboardShortcutManager]);

  return (
    <View style={[styles.container, {
      backgroundColor: background,
    }, containerStyle]}
    >
      <View style={[[{
        backgroundColor: colorValues.background,
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }]]}
      >
        <Text
          style={[TextStyles.textRegular, {
            fontSize: 23,
            color: colorValues.gray3,
          }]}
        >
          Welcome to
          <Text
            style={[TextStyles.textBold, {
              fontSize: 23,
              color: colorValues.primary,
            }]}
          >
            {' Session'}
          </Text>
          , a no-nonsense Pomodoro timer designed to help you focus.

        </Text>
      </View>
      <View style={[styles.contentBar, {
        backgroundColor: colorValues.background,
      }]}
      >
        <IntroductionBlock
          title="Set up your tasks"
          style={styles.block}
          image={require('../../assets/introduction/tasks.png')}
          imageStyle={{
            height: 200,
          }}
        >
          <Text style={[TextStyles.textRegular, {
            color: colorValues.primary,
          }]}
          >
            Select tasks to work on during each session, so you never lose track of them.
            {'\n\n'}

            <ClickableText
              text="Click here to learn more about the Pomodoro technique."
              onPress={() => Linking.openURL('https://google.com')}
              style={[TextStyles.textRegular, {
                color: colorValues.gray3,
              }]}
            />
          </Text>
        </IntroductionBlock>
        <IntroductionBlock
          title="Customize your timer"
          style={styles.block}
          image={require('../../assets/introduction/settings.png')}
          imageStyle={{
            height: 200,
          }}
        >
          <Text
            style={[TextStyles.textRegular, {
              color: colorValues.primary,
            }]}
          >
            Change timer settings, color theme, and more in the settings.

          </Text>
        </IntroductionBlock>
        <IntroductionBlock
          title="No ads or tracking"
          style={styles.block}
          image={require('../../assets/introduction/no-ads.png')}
          imageStyle={{
            height: 200,
          }}
        >
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
        </IntroductionBlock>
      </View>
      <OverlayButtonBar
        rightButton={{
          text: 'dismiss',
          onPress: () => setOverlay('none'),
          primary: true,
        }}
        style={{
          paddingHorizontal: 10,
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 100,
        }}
      />
    </View>
  );
}

IntroductionOverlay.defaultProps = {
  containerStyle: {},
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    maxHeight: 500,
    width: 700,
  },
  contentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 300,
    paddingHorizontal: 10,
  },
  block: {
    width: 220,
  },
});

export default IntroductionOverlay;
