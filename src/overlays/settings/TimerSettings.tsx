// @ts-nocheck

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Platform, SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import renderHeader from '../../helpers/renderers/renderHeader';
import SettingsOption from '../../components/SettingsOption';
// import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useSettingsData from '../../helpers/hooks/useSettingsData';
import {
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  BREAK_TIME_MINUTES,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
  LONG_BREAK_ENABLED,
  LONG_BREAK_INTERVAL,
  LONG_BREAK_TIME_MINUTES,
} from '../../StorageKeys';
import { SettingsOptionProps, Section, SettingsOptionPropsStatic } from '../../types';
import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';

// Store all static option data in here
// Make it easier to find and filter settings
export const LONG_BREAK_OPTION_INDEX = 2;
export const TIMER_ALERTS_OPTION_INDEX = 8;
export const options: SettingsOptionPropsStatic[] = [
  {
    type: 'number',
    title: 'Focus time (minutes)',
    storageKey: FOCUS_TIME_MINUTES,
  },
  {
    type: 'number',
    title: 'Short break time (minutes)',
    storageKey: BREAK_TIME_MINUTES,
  },
  {
    type: 'number',
    title: 'Long break time (minutes)',
    storageKey: LONG_BREAK_TIME_MINUTES,
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
  {
    type: 'toggle',
    title: 'Automatically switch to long breaks',
    storageKey: LONG_BREAK_ENABLED,
  },
  {
    type: 'number',
    title: 'Interval between long breaks',
    subtitle: 'Number of sessions before switching to a long break.',
    storageKey: LONG_BREAK_INTERVAL,
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
];

/**
 * Timer settings content in the settings overlay.
 */
function TimerSettingsPane() {
  const { setCurrentSessionNum } = useContext(AppContext);

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

  options[6].validator = () => {
    // Reset session count
    setCurrentSessionNum(0);

    return true;
  };

  const { settingsData, handleChange } = useSettingsData(options);

  const longBreaksEnabled = settingsData[5]?.value as boolean;
  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'hourglass-outline',
      data: settingsData.slice(0, longBreaksEnabled ? 7 : 6),
    },
    {
      title: 'Sounds and alerts',
      icon: 'notifications-outline',
      data: settingsData.slice(7, options.length),
    },
  ];
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
    setKeyboardGroup,
  } = useContext(AppContext);

  // Set keyboard selected by storage key
  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect(
    'settingsPage',
    options,
    'title',
  );

  /**
   * Clear keyboardSelected, and call setSelected.
   */
  function handleSelectAndResetKeyboard(key?: string) {
    // if (keyboardSelected !== key) {
    //   setKeyboardSelected(undefined);
    // }

    setKeyboardGroup(key ? 'input' : 'settingsPage');
    setSelected(key);
  }

  const listRef = useRef<SectionList>();

  /**
   * Handle automatic scrolling for keyboard selections.
   * @param to
   * @param pos
   * @todo remove linear search requirement
   */
  function handleAutoScroll(to: string, pos = 0) {
    // Search through sections to find the correct indices
    let sectionIndex = -1;
    let itemIndex = -1;

    sections.forEach((section, sIndex) => {
      section.data.forEach((item, iIndex) => {
        if (item.title === to) {
          sectionIndex = sIndex;
          itemIndex = iIndex;
        }
      });
    });

    if (sectionIndex < 0 || itemIndex < 0) {
      return;
    }

    listRef?.current?.scrollToLocation({
      sectionIndex,
      itemIndex,
      viewPosition: pos,
    });
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const i = options.findIndex((value) => value.title === selected);
      // Check which selected item
      if (i > 4) {
        // Scroll to the item
        handleAutoScroll(selected, 0.2);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (keyboardSelected && Platform.OS === 'web') {
      handleAutoScroll(keyboardSelected, 0.5);
    }
  }, [keyboardSelected]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    } else if (keyboardGroup === 'input' && selected) {
      // Assume that something has been selected
      setKeyboardSelected(selected);
    }
  }, [keyboardShortcutManager, keyboardGroup, selected]);

  const renderItem = (
    { item, index, section }: { item: SettingsOptionProps, index: number, section: Section },
  ) => {
    let indicator;
    if (Platform.OS !== 'web') {
      indicator = undefined;
    } else if (selected === item.title) {
      indicator = 'Enter to save';
    } else if (keyboardSelected === item.title) {
      indicator = '→ to select';
    }

    return (
      <SettingsOption
        multilineTitle
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
          if (section.data[index].validator) {
            // @ts-ignore
            const result = await section.data[index].validator(newData);
            if (!result) return;
          }

          const i = options.findIndex((value) => item.title === value.title);
          handleChange(
            i,
            newData,
          );
        }}
        indicator={indicator}
      />
    );
  };

  return (
    <SectionList
      ref={listRef}
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
      showsVerticalScrollIndicator={false}
      scrollToOverflowEnabled
    />
  );
}

export default TimerSettingsPane;
