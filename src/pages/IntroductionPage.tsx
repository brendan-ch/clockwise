import React, {
  useContext, useRef, useState,
} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import AppContext from '../../AppContext';
import IntroductionBlock from '../components/IntroductionBlock';
import TextStyles from '../styles/Text';
import OverlayButtonBar from '../components/OverlayButtonBar';
import { IntroductionBlockProps } from '../types';
import { storeData } from '../helpers/storage';
import { SUPPRESS_INTRODUCTION } from '../StorageKeys';
import useIntroductionData from '../helpers/hooks/useIntroductionData';

/* eslint-disable global-require */

function IntroductionPage() {
  const [index, setIndex] = useState(0);

  const { width } = useWindowDimensions();

  const ref = useRef<FlatList>();

  const {
    setOverlay,
    colors,
  } = useContext(AppContext);
  const colorValues = colors;

  const blocks = useIntroductionData();

  const shouldRenderContinue = index + 1 === blocks.length || Platform.OS === 'web';

  function handleMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    // console.log(index);
    setIndex(Math.ceil(e.nativeEvent.contentOffset.x / width));
  }

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
          onMomentumScrollEnd={(e) => handleMomentumScrollEnd(e)}
        />
      </View>
      <OverlayButtonBar
        leftButton={shouldRenderContinue ? undefined : {
          text: 'skip',
          onPress: () => {
            storeData(SUPPRESS_INTRODUCTION, '1');
            setOverlay('none');
          },
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
