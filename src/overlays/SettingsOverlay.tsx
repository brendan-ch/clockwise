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
const Apps = React.lazy(() => import('./settings/Apps'));
const Import = React.lazy(() => import('./settings/ImportSettings'));

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
 * Panes that appears at the bottom of the navigator.
 * Should be used for non-interactive pages.
 */
const bottomNavigator: SettingsNavigatorObject[] = [];

if (Platform.OS === 'web') {
  bottomNavigator.push(
    {
      title: 'Keybindings',
      renderer: <Keybindings />,
    },
  );

  bottomNavigator.push(
    {
      title: 'App',
      renderer: <Apps />,
    },
  );
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

navigator.push(
  {
    title: 'Data Management',
    renderer: <Import />,
  },
);

if (process.env.NODE_ENV === 'development') {
  const Debugging = React.lazy(() => import('./settings/DebugSettings'));

  navigator.push(
    {
      title: 'Debugging',
      renderer: <Debugging />,
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
    mode,
  } = useContext(AppContext);

  // Title of the selected settings navigator object.
  const [selected, setSelected] = useState('Timer');

  const colorValues = useTheme();

  useEffect(() => {
    setPageTitle('Settings');

    return () => setPageTitle(mode === 'focus' ? 'Focus' : 'Break');
  }, []);

  const combinedNavigator = [...navigator, ...bottomNavigator];

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
        const indexOfCurrent = combinedNavigator.findIndex((value) => value.title === selected);

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowDown'],
          action: () => setSelected(
            combinedNavigator.length - 1 <= indexOfCurrent
              ? selected
              : combinedNavigator[indexOfCurrent + 1].title,
          ),
        }));

        unsubMethods.push(keyboardShortcutManager?.registerEvent({
          keys: ['ArrowUp'],
          action: () => setSelected(
            indexOfCurrent <= 0
              ? selected
              : combinedNavigator[indexOfCurrent - 1].title,
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
        <View
          style={styles.navigator}
        >
          {navigator.map((value, index) => (
            <SettingsSelector
              key={index}
              text={value.title}
              selected={value.title === selected}
              style={styles.settingsSelector}
              onPress={() => setSelected(value.title)}
              indicator={value.title === selected && keyboardGroup === 'settings' ? '↑↓' : undefined}
            />
          ))}
        </View>
        <View
          style={styles.navigator}
        >
          {bottomNavigator.map((value, index) => (
            <SettingsSelector
              key={index}
              text={value.title}
              selected={value.title === selected}
              style={[styles.settingsSelector, {
                height: 25,
              }]}
              onPress={() => setSelected(value.title)}
              indicator={value.title === selected && keyboardGroup === 'settings' ? '↑↓' : undefined}
              isBottom
            />
          ))}
          <View
            style={{
              height: 10,
            }}
          />
        </View>
      </View>
      <View style={styles.settingsContent}>
        <Suspense fallback={<View />}>
          {combinedNavigator.find((value) => value.title === selected)?.renderer}
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  navigator: {
    flexDirection: 'column',
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
