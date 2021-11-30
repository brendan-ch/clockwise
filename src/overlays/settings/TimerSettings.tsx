import React from 'react';
import { ScrollView, SectionList } from 'react-native';
import SettingsOption from '../../components/SettingsOption';
import useSettingsData from '../../helpers/useSettingsData';
import useTheme from '../../helpers/useTheme';
import { AUTO_START_TIMERS, BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES } from '../../StorageKeys';
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
  {
    type: 'toggle',
    title: 'Auto start timers?',
    storageKey: AUTO_START_TIMERS,
  },
];

const sections: Section[] = [
  {
    title: 'Timer',
    data: options.slice(0, 3),
  },
];

/**
 * Timer settings content in the settings overlay.
 */
function TimerSettingsPane() {
  const colors = useTheme();

  const { settingsData, handleChange, handleSelect } = useSettingsData(options);

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
    />
  );

  return (
    <ScrollView>
      <SectionList
        keyExtractor={(item) => item.storageKey}
        sections={sections}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

export default TimerSettingsPane;
