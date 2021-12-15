import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import SettingsHeader from '../../components/SettingsHeader';
import SettingsOption from '../../components/SettingsOption';
import useSettingsData from '../../helpers/useSettingsData';
import { BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES } from '../../StorageKeys';
import { SettingsOptionProps, Section } from '../../types';

// Store all static option data in here
// Make it easier to find and filter settings
const options: SettingsOptionProps[] = [
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
  // {
  //   type: 'toggle',
  //   title: 'Auto start timers?',
  //   storageKey: AUTO_START_TIMERS,
  // },
];

const sections: Section[] = [
  {
    title: 'Timer',
    icon: 'timer-outline',
    data: options.slice(0, 3),
  },
];

/**
 * Timer settings content in the settings overlay.
 */
function TimerSettingsPane() {
  const { settingsData, handleChange, handleSelect } = useSettingsData(options);

  // Set keyboard selected by storage key
  const [keyboardSelected, setKeyboardSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].storageKey);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && keyboardSelected) {
      const unsubMethods: ((() => any) | undefined)[] = [];

      const indexOfCurrent = options.findIndex((value) => value.storageKey === keyboardSelected);
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowDown'],
        action: () => setKeyboardSelected(
          options.length - 1 <= indexOfCurrent
            ? keyboardSelected
            : options[indexOfCurrent + 1].storageKey,
        ),
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
  }, [keyboardShortcutManager, keyboardGroup, keyboardSelected]);

  const renderHeader = ({ section }: { section: Section }) => (
    <SettingsHeader
      title={section.title}
      icon={section.icon}
    />
  );

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      value={settingsData.find((value) => value.storageKey === item.storageKey)?.value}
      selected={settingsData.find((value) => value.storageKey === item.storageKey)?.selected}
      type={item.type}
      title={item.title}
      onChange={(data) => handleChange(item.storageKey, data)}
      onPress={() => {
        if (item.type === 'number') {
          handleSelect(item.storageKey);
        } else {
          handleSelect();
        }
      }}
      onSelect={() => handleSelect(item.storageKey)}
      keyboardSelected={keyboardSelected === item.storageKey}
    />
  );

  return (
    <SectionList
      keyExtractor={(item) => item.storageKey}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
    />
  );
}

export default TimerSettingsPane;
