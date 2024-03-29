import React, { useContext } from 'react';
import {
  Linking, Platform, StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../AppContext';
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
  const { colors } = useContext(AppContext);

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
    }]}
    >
      <Text
        style={[TextStyles.textBold, styles.headerText, {
          marginBottom: 5,
          color: colors.primary,
        }]}
        maxFontSizeMultiplier={1.5}
      >
        Notifications are disabled

      </Text>
      <Text
        style={[TextStyles.textItalic, {
          color: colors.primary,
          marginBottom: 5,
        }]}
        maxFontSizeMultiplier={1.5}
      >
        Turn on app notifications to enable timer alerts.
        {Platform.OS === 'ios' ? ' You may change this later by going to Settings → Notifications → Clockwise.' : undefined}
      </Text>
      <OverlayButtonBar
        leftButton={{
          text: Platform.OS === 'ios' ? 'no thanks' : 'close',
          onPress: onClose ? () => onClose() : () => {},
        }}
        rightButton={Platform.OS === 'ios' ? {
          text: 'open settings',
          onPress: () => {
            Linking.openSettings();
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
