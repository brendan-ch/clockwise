import React from 'react';
import {
  SectionList, StyleSheet, View,
} from 'react-native';
import SettingsHeader from '../components/SettingsHeader';
import SettingsOption from '../components/SettingsOption';
import useSettingsData from '../helpers/useSettingsData';
import useTheme from '../helpers/useTheme';
import { BREAK_TIME_MINUTES, ENABLE_BACKGROUND_TIMER, FOCUS_TIME_MINUTES } from '../StorageKeys';
import { Section, SettingsOptionProps } from '../types';

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
    title: 'Background timer (experimental)',
    storageKey: ENABLE_BACKGROUND_TIMER,
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
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  const { settingsData, handleChange, handleSelect } = useSettingsData(options);

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
    />
  );

  return (
    <View
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
    >
      <SectionList
        style={styles.sectionList}
        keyExtractor={(item) => item.storageKey}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  sectionList: {
    width: '100%',
  },
});

export default SettingsPage;
