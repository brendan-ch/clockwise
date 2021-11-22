import React, { useEffect, useContext } from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet, Text, ScrollView,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  containerStyle?: StyleProp<ViewStyle>,
}

/**
 * Content for the settings modal.
 */
function SettingsOverlay({ containerStyle }: Props) {
  const { background } = useTheme();
  const {
    keyboardShortcutManager,
    setOverlay,
  } = useContext(AppContext);

  const colorValues = useTheme();

  useEffect(() => {
    const unsubMethods: ((() => any) | undefined)[] = [];
    unsubMethods.push(keyboardShortcutManager?.registerEvent({
      keys: ['Escape'],
      action: () => setOverlay('none'),
    }));

    return () => {
      unsubMethods.forEach((method) => {
        if (method) {
          method();
        }
      });
    };
  }, [keyboardShortcutManager]);

  return (
    <View style={[styles.container, {
      backgroundColor: background,
    }, containerStyle]}
    >
      {/* Navigation bar on left, use custom React Navigation navigator */}
      <View style={[styles.navigationBar, {
        borderRightColor: colorValues.gray5,
      }]}
      >
        {/* <Text>Navigation bar</Text> */}
      </View>
      {/* See more here: https://reactnavigation.org/docs/custom-navigators/ */}
      {/* Settings content */}
      <ScrollView
        style={{
          flex: 3,
        }}
        contentContainerStyle={[styles.settingsContent, {
          backgroundColor: colorValues.background,
        }]}
      >
        <Text style={[TextStyles.textRegular, {
          color: colorValues.primary,
        }]}
        >
          You've found the settings page! Timer customization and account linking are coming soon.

        </Text>
      </ScrollView>
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
    flex: 1,
    maxHeight: 500,
  },
  navigationBar: {
    flex: 1,
    borderRightWidth: 0.5,
  },
  settingsContent: {
    flexDirection: 'column',
    padding: 10,
  },
});

export default SettingsOverlay;
