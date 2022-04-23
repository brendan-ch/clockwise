import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking, StyleSheet, Text, View,
} from 'react-native';
import ClickableText from '../components/ClickableText';
import OverlayButton from '../components/OverlayButton';
import { exportData } from '../helpers/dataManagement';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

export default function NewSiteMessage() {
  const colors = useTheme();

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.textContainer}
      >
        <Text
          style={[TextStyles.textRegular, styles.header]}
        >
          <Text
            style={TextStyles.textBold}
          >
            {'Session '}
          </Text>
          <Text>
            {'has been renamed to '}
          </Text>
          <Text
            style={TextStyles.textBold}
          >
            Clockwise.
          </Text>
        </Text>
        <Text style={[TextStyles.textRegular, styles.text]}>
          {'You can find the new site '}
          <ClickableText
            text="here."
            onPress={() => Linking.openURL('https://clockwise.sh')}
            style={[TextStyles.textRegular, {
              color: colors.gray3,
            }]}
          />
        </Text>
        <Text style={[TextStyles.textRegular, styles.text]}>
          To move your data to the new site, click the button below
          and follow the steps.
        </Text>
        <OverlayButton
          text="Export data"
          onPress={() => exportData(true)}
          primary
        />
        <Text style={[TextStyles.textRegular, styles.text]}>
          <Text style={TextStyles.textBold}>
            {'1. '}
          </Text>
          {'Go to the '}
          <ClickableText
            text="new site."
            onPress={() => Linking.openURL('https://clockwise.sh')}
            style={[TextStyles.textRegular, {
              color: colors.gray3,
            }]}
          />
        </Text>
        <Text style={[TextStyles.textRegular, styles.text]}>
          <Text style={TextStyles.textBold}>
            {'2. '}
          </Text>
          {'Open the Settings menu '}
          <Ionicons name="settings-outline" />
          {' on the top right.'}
        </Text>
        <Text style={[TextStyles.textRegular, styles.text]}>
          <Text style={TextStyles.textBold}>
            {'3. '}
          </Text>
          Open the Data Management tab on the left.
        </Text>
        <Text style={[TextStyles.textRegular, styles.text]}>
          <Text style={TextStyles.textBold}>
            {'4. '}
          </Text>
          Click "Import settings" and select the exported file.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    height: 500,
    width: 375,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
  },
});
