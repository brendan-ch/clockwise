import React, {
  useEffect, useContext,
} from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet, Text,
} from 'react-native';
import AppContext from '../../AppContext';
import IntroductionBlock from '../components/IntroductionBlock';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from '../components/OverlayButtonBar';
import { storeData } from '../helpers/storage';
import { SUPPRESS_INTRODUCTION } from '../StorageKeys';
import useIntroductionData from '../helpers/hooks/useIntroductionData';

/* eslint-disable global-require */

interface Props {
  containerStyle?: StyleProp<ViewStyle>,
}

/**
 * Content for the settings modal.
 */
function IntroductionOverlay({ containerStyle }: Props) {
  const {
    keyboardShortcutManager,
    setOverlay,
    keyboardGroup,
    setPageTitle,
  } = useContext(AppContext);

  const colorValues = useTheme();

  const blocks = useIntroductionData();

  useEffect(() => {
    // Set storage option
    storeData(SUPPRESS_INTRODUCTION, '1');
  }, []);

  useEffect(() => {
    setPageTitle('Welcome!');

    return () => setPageTitle('Focus');
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
      backgroundColor: colorValues.background,
    }, containerStyle]}
    >
      <View style={[[{
        backgroundColor: colorValues.background,
        // height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }]]}
      >
        <Text
          maxFontSizeMultiplier={1.35}
          style={[TextStyles.textRegular, {
            fontSize: 23,
            color: colorValues.gray3,
          }]}
        >
          Welcome to
          <Text
            maxFontSizeMultiplier={1.35}
            style={[TextStyles.textBold, {
              fontSize: 23,
              color: colorValues.primary,
            }]}
          >
            {' Clockwise'}
          </Text>
          , a Pomodoro timer designed to help you focus.

        </Text>
      </View>
      <View style={[styles.contentBar, {
        backgroundColor: colorValues.background,
      }]}
      >
        {blocks.map((value) => (
          <IntroductionBlock
            title={value.title}
            image={value.image}
            imageStyle={{
              height: 200,
              width: 220,
            }}
            style={styles.block}
            key={value.title}
          >
            {value.children}
          </IntroductionBlock>
        ))}
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
    justifyContent: 'center',
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
