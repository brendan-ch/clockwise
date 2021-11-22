import React from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet, Text,
} from 'react-native';
import useTheme from '../helpers/useTheme';

interface Props {
  containerStyle?: StyleProp<ViewStyle>,
}

/**
 * Content for the settings modal.
 */
function SettingsOverlay({ containerStyle }: Props) {
  const { background } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: background,
    }, containerStyle]}
    >
      {/* Navigation bar on left, use custom React Navigation navigator */}
      <View style={styles.navigationBar}>
        <Text>Navigation bar</Text>
      </View>
      {/* See more here: https://reactnavigation.org/docs/custom-navigators/ */}
      {/* Add divider in middle */}
      {/* Settings content */}
      <View style={styles.settingsContent}>
        <Text>Settings content</Text>
      </View>
    </View>
  );
}

SettingsOverlay.defaultProps = {
  containerStyle: {},
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 400,
    width: 600,
  },
  navigationBar: {
    flex: 1,
  },
  settingsContent: {
    flex: 3,
    flexDirection: 'column',
  },
});

export default SettingsOverlay;
