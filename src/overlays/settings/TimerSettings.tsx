import React, { useContext, useEffect, useState } from 'react';
import { Platform, SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import renderHeader from '../../helpers/renderers/renderHeader';
import SettingsOption from '../../components/SettingsOption';
// import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useSettingsData from '../../helpers/hooks/useSettingsData';
import {
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  BREAK_TIME_MINUTES, ENABLE_TIMER_ALERTS, ENABLE_TIMER_SOUND, FOCUS_TIME_MINUTES,
} from '../../StorageKeys';
import { SettingsOptionProps, Section, SettingsOptionPropsStatic } from '../../types';
import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';

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
  {
    type: 'toggle',
    title: 'Automatically start breaks',
    storageKey: AUTO_START_BREAK,
  },
  {
    type: 'toggle',
    title: 'Automatically start sessions',
    storageKey: AUTO_START_FOCUS,
  },
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
        const text = Platform.OS === 'web'
          ? 'For changes to take effect, please enable notifications for this site.'
          : 'To use timer alerts, please enable notifications for this app.';

        option.subtitle = !value.granted ? text : undefined;
      }
    });

  const { settingsData, handleChange } = useSettingsData(options);

  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: settingsData.slice(0, 6),
    },
  ];
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);

  // Set keyboard selected by storage key
  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect(
    keyboardGroup,
    options,
    'title',
  );

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

  const renderItem = ({ item, index }: { item: SettingsOptionProps, index: number }) => (
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
      onChange={async (newData: any) => {
        if (options[index].validator) {
          // @ts-ignore
          const result = await options[index].validator(newData);
          if (!result) return;
        }

        const i = options.findIndex((value) => item.title === value.title);
        handleChange(
          i,
          newData,
        );
      }}
      indicator={keyboardSelected === item.title ? '↑↓' : undefined}
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
