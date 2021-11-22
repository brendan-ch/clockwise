import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

/**
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  return (
    <View
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
    >
      <Text style={[TextStyles.textRegular, {
        color: colorValues.primary,
      }]}
      >
        You've found the settings page! Timer customization and account linking are coming soon.

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default SettingsPage;
