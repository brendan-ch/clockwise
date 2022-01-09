import React from 'react';
import {
  Linking, Platform, StyleSheet, Text, View,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import OverlayButtonBar from './OverlayButtonBar';

interface Props {
  onClose?: () => any,
}

/**
 * Component that displays a notification overlay that links users to the
 * notification settings page of their respective OS.
 */
function NotificationOverlay({ onClose }: Props) {
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
        Notifications are disabled

      </Text>
      <Text style={[TextStyles.textItalic, {
        color: colors.primary,
        marginBottom: 5,
      }]}
      >
        Turn on app notifications to enable timer alerts.
        {Platform.OS === 'ios' ? ' You may change this later by going to Settings → Notifications → Session.' : undefined}
      </Text>
      <OverlayButtonBar
        leftButton={{
          text: Platform.OS === 'ios' ? 'no thanks' : 'close',
          onPress: onClose ? () => onClose() : () => {},
        }}
        rightButton={Platform.OS === 'ios' ? {
          text: 'go to settings',
          onPress: () => {
            Linking.openURL('app-settings:');
            if (onClose) {
              onClose();
            }
          },
          primary: true,
        } : undefined}
      />
    </View>
  );
}

NotificationOverlay.defaultProps = {
  onClose: () => {},
};

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
