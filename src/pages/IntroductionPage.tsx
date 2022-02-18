import React, {
  useContext, useRef, useState,
} from 'react';
import {
  FlatList,
  Platform, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import AppContext from '../../AppContext';
import IntroductionBlock from '../components/IntroductionBlock';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from '../components/OverlayButtonBar';
import { IntroductionBlockProps } from '../types';
import { storeData } from '../helpers/storage';
import { SUPPRESS_INTRODUCTION } from '../StorageKeys';
import useIntroductionData from '../helpers/hooks/useIntroductionData';

/* eslint-disable global-require */

function IntroductionPage() {
  const [index, setIndex] = useState(0);
  const colorValues = useTheme();

  const { width } = useWindowDimensions();

  const ref = useRef<FlatList>();

  const {
    setOverlay,
  } = useContext(AppContext);

  const blocks = useIntroductionData();

  const shouldRenderContinue = index + 1 === blocks.length || Platform.OS === 'web';

  function handleNextButtonPress() {
    if (index + 1 >= blocks.length || Platform.OS === 'web') {
      // Set storage data
      storeData(SUPPRESS_INTRODUCTION, '1');

      // Remove overlay
      setOverlay('none');
      return;
    }

    ref?.current?.scrollToIndex({
      animated: true,
      index: index + 1,
    });
    // ref?.current?.scrollTo(index + 400);
    setIndex(index + 1);
  }

  const renderBlock = ({ item }: { item: IntroductionBlockProps }) => (
    <IntroductionBlock
      title={item.title}
      image={item.image}
      style={[styles.block, {
        width: width - 10,
      }]}
      imageStyle={{
        height: 250,
        width: width - 20,
      }}
    >
      {item.children}
    </IntroductionBlock>
  );

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
          width,
        }}
      >
        <FlatList
          data={blocks}
          renderItem={renderBlock}
          horizontal
          keyExtractor={(item) => item.title}
          contentContainerStyle={{
            // paddingHorizontal: 10,
          }}
          pagingEnabled
          // @ts-ignore
          ref={ref}
        />
        {/* <ScrollView
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
        </ScrollView> */}
      </View>
      <OverlayButtonBar
        leftButton={shouldRenderContinue ? undefined : {
          text: 'skip',
          onPress: () => setOverlay('none'),
        }}
        rightButton={{
          text: shouldRenderContinue ? 'continue' : 'next',
          onPress: () => handleNextButtonPress(),
          primary: true,
        }}
        style={{
          paddingHorizontal: 10,
          justifyContent:
            shouldRenderContinue
              ? 'flex-end'
              : 'space-between',
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
    width: 350,
    marginLeft: 10,
  },
});

export default IntroductionPage;
