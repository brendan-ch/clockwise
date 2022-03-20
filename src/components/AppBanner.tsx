import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  Pressable, StyleSheet, Text,
} from 'react-native';
import { APP_STORE_LINK, GOOGLE_PLAY_LINK } from '../Constants';
import handleOpenLink from '../helpers/handleOpenLink';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  onDismiss?: () => any,
}

function AppBanner({ onDismiss }: Props) {
  const colors = useTheme();

  let link: string | undefined;
  if (Platform.OS === 'web' && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    link = APP_STORE_LINK;
  } else if (Platform.OS === 'web' && /Android/i.test(navigator.userAgent)) {
    link = GOOGLE_PLAY_LINK;
  }

  return (
    <Pressable
      style={[styles.container, {
        backgroundColor: colors.primary,
      }]}
      // @ts-ignore
      onPress={link ? () => handleOpenLink(link) : undefined}
    >
      <Text style={[TextStyles.textRegular, {
        color: colors.background,
      }]}
      >
        <Text style={[TextStyles.textBold, {
          color: colors.background,
        }]}
        >
          {'Tap here to download the app '}
        </Text>
        for a better experience.
      </Text>
      <Pressable
        onPress={onDismiss ? () => onDismiss() : undefined}
      >
        <Ionicons name="close-outline" size={20} color={colors.gray3} />
      </Pressable>
    </Pressable>
  );
}

AppBanner.defaultProps = {
  onDismiss: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 50,
    width: '100%',
  },
});

export default AppBanner;
