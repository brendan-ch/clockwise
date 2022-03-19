import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import Constants from 'expo-constants';
import { DARK_MODE_SCREENSHOT, LIGHT_MODE_SCREENSHOT } from '../../Assets';
import ClickableText from '../../components/ClickableText';
import handleOpenLink from '../../helpers/handleOpenLink';
import useTheme from '../../helpers/hooks/useTheme';
import ColorValues from '../../styles/Color';
import TextStyles from '../../styles/Text';

/**
 * Settings pane that contains a link to the apps.
 */
export default function AppsPane() {
  const colors = useTheme();
  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink;

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
            Enter your phone number to get a link to download the app. SMS rates may apply.
          </Text>
          <Text style={textStyle}>
            {'We won\'t spam you or sell your data. See the '}
            <ClickableText
              text="Privacy Policy"
              onPress={() => handleOpenLink(privacyPolicyLink)}
              style={textStyle}
            />
            {' for more information.'}
          </Text>
          <Text style={textStyle}>
            Or, click the links below:
          </Text>
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
});
