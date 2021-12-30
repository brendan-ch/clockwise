import React from 'react';
import { Text, View } from 'react-native';
import OverlayButtonBar from './OverlayButtonBar';

/**
 * Component that displays a notification overlay that links users to the
 * notification settings page of their respective OS.
 */
function NotificationOverlay() {
  return (
    <View>
      <Text>Enable notifications</Text>
      <Text>
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
        }}
      />
    </View>
  );
}

export default NotificationOverlay;
