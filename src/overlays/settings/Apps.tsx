import React from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';
import Constants from 'expo-constants';
import {
  DARK_MODE_SCREENSHOT, LIGHT_MODE_SCREENSHOT,
} from '../../Assets';
import handleOpenLink from '../../helpers/handleOpenLink';
import useTheme from '../../helpers/hooks/useTheme';
import ColorValues from '../../styles/Color';
import TextStyles from '../../styles/Text';
import AppStoreBadge from '../../components/badges/AppStoreBadge';
import GooglePlayBadge from '../../components/badges/GooglePlayBadge';

/**
 * Settings pane that contains a link to the apps.
 */
export default function AppsPane() {
  const colors = useTheme();

  const appStoreLink = Constants.manifest?.extra?.appStoreLink;
  const googlePlayLink = Constants.manifest?.extra?.googlePlayLink;

  const textStyle = [TextStyles.textRegular, {
    color: colors.primary,
    fontSize: 15,
    marginVertical: 5,
  }];

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
    }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text
            style={[TextStyles.textBold, {
              color: colors.primary,
              fontSize: 50,
              marginBottom: 10,
            }]}
          >
            Download the app
          </Text>
          <Text style={textStyle}>
            A Pomodoro timer designed to help you focus, now available on the go.
          </Text>
          <Text style={textStyle}>
            Click the links below to download the app:
          </Text>
          <Pressable
            onPress={() => handleOpenLink(appStoreLink)}
          >
            <AppStoreBadge
              style={styles.badge}
            />
          </Pressable>
          <Pressable
            onPress={() => handleOpenLink(googlePlayLink)}
          >
            <GooglePlayBadge
              style={styles.badge}
            />
          </Pressable>
        </View>
        <Image
          source={
            colors.background === ColorValues.background
              ? LIGHT_MODE_SCREENSHOT
              : DARK_MODE_SCREENSHOT
          }
          style={styles.imageContainer}
        />
      </View>
      <View style={[styles.legalContainer]}>
        <Text style={[TextStyles.textRegular, {
          color: colors.gray3,
        }]}
        >
          Apple® and the Apple logo® are trademarks of Apple Inc.
        </Text>
        <Text
          style={[TextStyles.textRegular, {
            color: colors.gray3,
          }]}
        >
          Google Play and the Google Play logo are trademarks of Google LLC.

        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 31,
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    width: 300,
  },
  imageContainer: {
    width: 184,
    height: 377,
  },
  legalContainer: {

  },
  badge: {
    marginVertical: 5,
  },
});
