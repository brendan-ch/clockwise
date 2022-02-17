import React, { useContext, useRef, useState } from 'react';
import {
  Linking, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import Constants from 'expo-constants';
import AppContext from '../../AppContext';
import ClickableText from '../components/ClickableText';
import IntroductionBlock from '../components/IntroductionBlock';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from '../components/OverlayButtonBar';

/* eslint-disable global-require */

function IntroductionPage() {
  const [index, setIndex] = useState(0);
  const colorValues = useTheme();

  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink;

  const ref = useRef<ScrollView>();

  const {
    setOverlay,
  } = useContext(AppContext);

  function handleNextButtonPress() {
    ref?.current?.scrollTo(index + 400);
    setIndex(index + 400);
  }

  return (
    <View style={[styles.container, {
      backgroundColor: colorValues.background,
    }]}
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
      <View
        style={{
          height: 400,
        }}
      >
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        >
          <IntroductionBlock
            title="Set up your tasks"
            style={styles.block}
            image={require('../../assets/introduction/tasks.png')}
            imageStyle={{
              height: 250,
              width: 380,
            }}
          >
            <Text style={[TextStyles.textRegular, {
              color: colorValues.primary,
            }]}
            >
              Select tasks to work on during each session, so you never lose track of them.
              {'\n\n'}

              <ClickableText
                text="Learn more about the Pomodoro technique."
                onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Pomodoro_Technique')}
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
              height: 250,
              width: 380,
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
              height: 250,
              width: 380,
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
        </ScrollView>
      </View>
      <OverlayButtonBar
        leftButton={{
          text: 'skip',
          onPress: () => setOverlay('none'),
        }}
        rightButton={{
          text: 'next',
          onPress: () => handleNextButtonPress(),
          primary: true,
        }}
        style={{
          paddingHorizontal: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  block: {
    width: 380,
    marginRight: 10,
  },
});

export default IntroductionPage;