import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from './OverlayButtonBar';

/**
 * Component that displays a notification overlay that links users to the
 * notification settings page of their respective OS.
 */
function NotificationOverlay() {
  const colors = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
    }]}
    >
      <Text style={[TextStyles.textBold, styles.headerText, {
        marginBottom: 5,
        color: colors.primary,
      }]}
      >
        Enable notifications

      </Text>
      <Text style={[TextStyles.textItalic, {
        color: colors.primary,
        marginBottom: 5,
      }]}
      >
        Turn on notifications to enable timer alerts.
        You may change this later by going to Settings → Notifications → Session.
      </Text>
      <OverlayButtonBar
        leftButton={{
          text: 'no thanks',
          onPress: () => {},
        }}
        rightButton={{
          text: 'enable',
          onPress: () => {},
          primary: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 300,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 17,
  },
});

export default NotificationOverlay;
