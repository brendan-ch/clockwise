import React, { useContext } from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';
import {
  DARK_MODE_SCREENSHOT, LIGHT_MODE_SCREENSHOT,
} from '../../Assets';
import handleOpenLink from '../../helpers/handleOpenLink';
import ColorValues from '../../styles/Color';
import TextStyles from '../../styles/Text';
import AppStoreBadge from '../../components/badges/AppStoreBadge';
import GooglePlayBadge from '../../components/badges/GooglePlayBadge';
import { APP_STORE_LINK, GOOGLE_PLAY_LINK } from '../../Constants';
import AppContext from '../../../AppContext';

/**
 * Settings pane that contains a link to the apps.
 */
export default function AppsPane() {
  const { colors } = useContext(AppContext);

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
          <View style={styles.badgesContainer}>
            <Pressable
              onPress={() => handleOpenLink(APP_STORE_LINK)}
            >
              <AppStoreBadge
                style={styles.badge}
              />
            </Pressable>
            <Pressable
              onPress={() => handleOpenLink(GOOGLE_PLAY_LINK)}
            >
              <GooglePlayBadge
                style={styles.badge}
              />
            </Pressable>
          </View>
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
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
  },
  badge: {
    marginRight: 10,
  },
});
