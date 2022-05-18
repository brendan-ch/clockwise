import React, { useContext, useEffect } from 'react';
import {
  FlatList, Platform, StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../../AppContext';
import AppIcon from '../../components/badges/AppIcon';
import ClickableText from '../../components/ClickableText';
import SettingsOption from '../../components/SettingsOption';
import {
  RELEASE_CODE,
  GITHUB_PROFILE_LINK,
  APP_STORE_LINK,
  GOOGLE_PLAY_LINK,
} from '../../Constants';
import getBaseURL from '../../helpers/getBaseURL';
import handleOpenLink from '../../helpers/handleOpenLink';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import useTheme from '../../helpers/hooks/useTheme';
import useWindowSize from '../../helpers/hooks/useWindowSize';
import TextStyles from '../../styles/Text';
import { SettingsOptionProps } from '../../types';

const baseUrl = getBaseURL();

interface TextWithLink {
  text: string,
  link?: string,
}

const textLinks: TextWithLink[] = [
  {
    text: 'Created by Brendan C.',
    link: GITHUB_PROFILE_LINK,
  },
  {
    text: `Version ${RELEASE_CODE}`,
  },
  {
    text: 'A Pomodoro timer designed to help you focus.',
  },
];

const buttons: SettingsOptionProps[] = [
  {
    title: 'Privacy Policy',
    value: 'chevron-forward-outline',
    type: 'icon',
    onPress: () => handleOpenLink(`${baseUrl}/privacy`),
  },
  {
    title: 'Open Source Licenses',
    value: 'chevron-forward-outline',
    type: 'icon',
    onPress: () => handleOpenLink(`${baseUrl}/licenses`),
  },
];

if (Platform.OS !== 'web') {
  buttons.push({
    title: 'Leave a Review',
    value: 'chevron-forward-outline',
    type: 'icon',
    onPress: () => handleOpenLink(Platform.OS === 'ios' ? `${APP_STORE_LINK}?action=write-review` : GOOGLE_PLAY_LINK),
  });
}

/**
 * Settings page that displays information about the app.
 */
function AboutPane() {
  const colors = useTheme();
  const windowSize = useWindowSize();
  const { keyboardGroup, keyboardShortcutManager } = useContext(AppContext);

  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect('settingsPage', buttons, 'title');

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(buttons[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const listHeader = (
    <View
      style={styles.versionContainer}
    >
      <AppIcon
        width={200}
        height={200}
      />
      <Text
        style={[TextStyles.textBold, {
          fontSize: 49,
          color: colors.primary,
          marginBottom: 10,
        }]}
      >
        clockwise
      </Text>
      {textLinks.map((value, index) => (value.link !== undefined ? (
        <ClickableText
          text={value.text}
            // @ts-ignore
          onPress={() => handleOpenLink(value.link)}
          style={[TextStyles.textRegular, {
            color: colors.primary,
            marginBottom: 10,
          }]}
          /* eslint-disable-next-line */
          key={index}
        />
      ) : (
        <Text
          style={[TextStyles.textRegular, {
            color: colors.primary,
            marginBottom: 10,
          }]}
          /* eslint-disable-next-line */
          key={index}
        >
          {value.text}
        </Text>
      )))}
    </View>
  );

  const renderButton = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      multilineTitle
      keyboardSelected={keyboardSelected === item.title}
      indicator={keyboardSelected === item.title ? '→ to select' : undefined}
    />
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: windowSize === 'landscape' ? 0 : 10,
        },
      ]}
    >
      <FlatList
        renderItem={renderButton}
        data={buttons}
        keyExtractor={(item) => item.title!}
        ListHeaderComponent={listHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  versionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default AboutPane;
