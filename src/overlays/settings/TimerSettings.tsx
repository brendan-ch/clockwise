import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import renderHeader from '../../helpers/renderers/renderHeader';
import SettingsOption from '../../components/SettingsOption';
// import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useSettingsData from '../../helpers/hooks/useSettingsData';
import {
  BREAK_TIME_MINUTES, ENABLE_TIMER_ALERTS, ENABLE_TIMER_SOUND, FOCUS_TIME_MINUTES,
} from '../../StorageKeys';
import { SettingsOptionProps, Section, SettingsOptionPropsStatic } from '../../types';
import { checkNotifications, requestNotifications } from '../../helpers/notification';

// Store all static option data in here
// Make it easier to find and filter settings
const options: SettingsOptionPropsStatic[] = [
  {
    type: 'number',
    title: 'Focus time (minutes)',
    storageKey: FOCUS_TIME_MINUTES,
  },
  {
    type: 'number',
    title: 'Break time (minutes)',
    storageKey: BREAK_TIME_MINUTES,
  },
  {
    type: 'toggle',
    title: 'Timer sound',
    storageKey: ENABLE_TIMER_SOUND,
  },
  {
    type: 'toggle',
    title: 'Timer alerts',
    storageKey: ENABLE_TIMER_ALERTS,
    validator: async (data) => {
      if (data === false) return true;

      const { granted, canAskAgain } = await checkNotifications();

      if (granted) return true;

      if (canAskAgain) {
        // Request permission directly from user
        const requestResults = await requestNotifications();
        if (requestResults.granted) {
          // Exit and fill checkbox
          return true;
        }

        return false;
      }

      return false;
    },
  },
  // {
  //   type: 'toggle',
  //   title: 'Auto start timers?',
  //   storageKey: AUTO_START_TIMERS,
  // },
];

/**
 * Timer settings content in the settings overlay.
 */
function TimerSettingsPane() {
  // Assign some keys here
  // Apparently asynchronous reassignments are allowed
  checkNotifications()
    .then((value) => {
      const option = options.find(
        (filterOption) => filterOption.storageKey === ENABLE_TIMER_ALERTS,
      );
      if (option) {
        option.subtitle = !value.granted ? 'Please enable notifications on your browser.' : undefined;
      }
    });

  const settingsData = useSettingsData(options);

  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: settingsData.slice(0, 4),
    },
  ];
  // Set keyboard selected by storage key
  const [keyboardSelected, setKeyboardSelected] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);

  /**
   * Clear keyboardSelected, and call setSelected.
   */
  function handleSelectAndResetKeyboard(key?: string) {
    if (keyboardSelected !== key) {
      setKeyboardSelected(undefined);
    }

    setSelected(key);
  }

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  useEffect(() => {
    const unsubMethods: ((() => any) | undefined)[] = [];
    if (keyboardGroup === 'settingsPage' && keyboardSelected) {
      const indexOfCurrent = options.findIndex((value) => value.title === keyboardSelected);
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowDown'],
        action: () => setKeyboardSelected(
          options.length - 1 <= indexOfCurrent
            ? keyboardSelected
            : options[indexOfCurrent + 1].title,
        ),
      }));

      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowUp'],
        action: () => setKeyboardSelected(
          indexOfCurrent <= 0
            ? keyboardSelected
            : options[indexOfCurrent - 1].title,
        ),
      }));
    } else if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowDown'],
        action: () => setKeyboardSelected(options[0].title),
      }));
    }

    return () => {
      unsubMethods.forEach((method) => {
        if (method) {
          method();
        }
      });
    };
  }, [keyboardShortcutManager, keyboardGroup, keyboardSelected]);

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      selected={selected === item.title}
      onPress={() => {
        if (item.type === 'number') {
          handleSelectAndResetKeyboard(item.title);
        } else {
          handleSelectAndResetKeyboard();
        }
      }}
      onSelect={() => handleSelectAndResetKeyboard(item.title)}
      onDeselect={() => handleSelectAndResetKeyboard()}
      keyboardSelected={keyboardSelected === item.title}
    />
  );

  return (
    <SectionList
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
    />
  );
}

export default TimerSettingsPane;
