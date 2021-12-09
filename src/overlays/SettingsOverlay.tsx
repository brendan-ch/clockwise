import React, {
  useEffect, useContext, useState, Suspense,
} from 'react';
import {
  StyleProp, ViewStyle, View, StyleSheet,
} from 'react-native';
import AppContext from '../../AppContext';
import SettingsSelector from '../components/SettingSelector';
import useTheme from '../helpers/useTheme';

// import TimerSettingsPane from './settings/TimerSettings';

/* eslint-disable react/no-array-index-key */

const TimerSettings = React.lazy(() => import('./settings/TimerSettings'));

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
  // {
  //   title: 'Connected apps',
  //   renderer: ConnectedAppsPane,
  // },
];

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
  } = useContext(AppContext);

  // Title of the selected settings navigator object.
  const [selected, setSelected] = useState('Timer');

  const colorValues = useTheme();

  useEffect(() => {
    if (keyboardGroup === 'settings') {
      const unsubMethods: ((() => any) | undefined)[] = [];
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['Escape'],
        action: () => {
          setOverlay('none');
        },
      }));

      return () => {
        unsubMethods.forEach((method) => {
          if (method) {
            method();
          }
        });
      };
    }

    return () => {};
  }, [keyboardShortcutManager, keyboardGroup]);

  // const TimerSettings = React.lazy(() => import('./settings/TimerSettings'));

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
