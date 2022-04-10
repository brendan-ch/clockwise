import React, { useContext, useEffect } from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../../AppContext';
import AppIcon from '../../components/badges/AppIcon';
import ClickableText from '../../components/ClickableText';
import SettingsOption from '../../components/SettingsOption';
import {
  RELEASE_CODE,
  PRIVACY_POLICY_LINK,
  GITHUB_LINK,
  GITHUB_PROFILE_LINK,
} from '../../Constants';
import handleOpenLink from '../../helpers/handleOpenLink';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import useTheme from '../../helpers/hooks/useTheme';
import useWindowSize from '../../helpers/hooks/useWindowSize';
import TextStyles from '../../styles/Text';
import { SettingsOptionProps } from '../../types';

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
    onPress: () => handleOpenLink(PRIVACY_POLICY_LINK),
  },
  {
    title: 'Open Source Licenses',
    value: 'chevron-forward-outline',
    type: 'icon',
    onPress: () => handleOpenLink(GITHUB_LINK),
  },
  {
    title: 'Leave a Review',
    value: 'chevron-forward-outline',
    type: 'icon',
  },
];

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
        <Text style={[TextStyles.textRegular, {
          color: colors.primary,
          marginBottom: 10,
        }]}
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
      keyboardSelected={keyboardSelected === item.title}
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
