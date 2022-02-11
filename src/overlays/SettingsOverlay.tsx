import React, {
  useEffect, useContext, useState, Suspense,
} from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet, Platform,
} from 'react-native';
import AppContext from '../../AppContext';
import SettingsSelector from '../components/SettingSelector';
import useTheme from '../helpers/hooks/useTheme';

/* eslint-disable react/no-array-index-key */

const TimerSettings = React.lazy(() => import('./settings/TimerSettings'));
const BackgroundSettings = React.lazy(() => import('./settings/BackgroundSettings'));
const Keybindings = React.lazy(() => import('./settings/Keybindings'));

interface SettingsNavigatorObject {
  /**
   * Title of the page; will be displayed in the navigation bar.
   * This property should be unique.
   */
  title: string,
  /**
   * Content that is rendered when selected.
   */
  /* eslint-disable-next-line */
  renderer: JSX.Element,
}

/**
 * Settings pane navigator.
 */
const navigator: SettingsNavigatorObject[] = [
  {
    title: 'Timer',
    renderer: <TimerSettings />,
  },
  {
    title: 'Appearance',
    renderer: <BackgroundSettings />,
  },
];

if (Platform.OS === 'web') {
  navigator.push(
    {
      title: 'Keybindings',
      renderer: <Keybindings />,
    },
  );
}

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
    keyboardGroup,
    setKeyboardGroup,
    setPageTitle,
  } = useContext(AppContext);

  // Title of the selected settings navigator object.
  const [selected, setSelected] = useState('Timer');

  const colorValues = useTheme();

  useEffect(() => {
    setPageTitle('Settings');

    return () => setPageTitle('Timer');
  }, []);

  useEffect(() => {
    setKeyboardGroup('settings');
  }, [selected]);

  useEffect(() => {
    if (keyboardGroup === 'settings' || keyboardGroup === 'settingsPage') {
      const unsubMethods: ((() => any) | undefined)[] = [];
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['Escape'],
        action: () => {
          setOverlay('none');
        },
      }));

      if (keyboardGroup === 'settings') {
        const indexOfCurrent = navigator.findIndex((value) => value.title === selected);

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowDown'],
          action: () => setSelected(
            navigator.length - 1 <= indexOfCurrent
              ? selected
              : navigator[indexOfCurrent + 1].title,
          ),
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowUp'],
          action: () => setSelected(
            indexOfCurrent <= 0
              ? selected
              : navigator[indexOfCurrent - 1].title,
          ),
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowRight'],
          action: () => setKeyboardGroup('settingsPage'),
        }));
      } else if (keyboardGroup === 'settingsPage') {
        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowLeft'],
          action: () => setKeyboardGroup('settings'),
        }));
      }

      return () => {
        unsubMethods.forEach((method) => {
          if (method) {
            method();
          }
        });
      };
    }

    return () => {};
  }, [keyboardShortcutManager, keyboardGroup, selected]);

  return (
    <View style={[styles.container, {
      backgroundColor: background,
    }, containerStyle]}
    >
      <View style={[styles.navigationBar, {
        borderRightColor: colorValues.gray5,
      }]}
      >
        {navigator.map((value, index) => (
          <SettingsSelector
            key={index}
            text={value.title}
            selected={value.title === selected}
            style={styles.settingsSelector}
            onPress={() => setSelected(value.title)}
            indicator={value.title === selected ? '↑↓' : undefined}
          />
        ))}
      </View>
      <View style={styles.settingsContent}>
        <Suspense fallback={<View />}>
          {navigator.find((value) => value.title === selected)?.renderer}
        </Suspense>
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
    flex: 1,
    maxHeight: 500,
    width: 700,
  },
  navigationBar: {
    flex: 1,
    borderRightWidth: 0.5,
  },
  settingsContent: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    flex: 3,
  },
  settingsSelector: {
    height: 50,
  },
});

export default SettingsOverlay;
