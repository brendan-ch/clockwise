import React, { useState, useEffect } from 'react';
import { ScrollView, SectionList } from 'react-native';
import SettingsOption from '../../components/SettingsOption';
import { getData } from '../../helpers/storage';
import useTheme from '../../helpers/useTheme';
import { AUTO_START_TIMERS, BREAK_TIME_MINUTES, FOCUS_TIME_MINUTES } from '../../StorageKeys';

/**
 * Represents data for a settings button.
 */
interface SettingsData {
  storageKey: string,
  value: number | boolean,
}

interface SettingsOptionProps {
  title: string,
  /* eslint-disable-next-line */
  // onChange: (data: any) => any,
  type: 'number' | 'toggle',
  /**
   * Used for getting and saving data, as well as for identifying different options.
   */
  storageKey: string,
}

interface Section {
  title: string,
  data: SettingsOptionProps[],
}

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
  const [settingsData, setSettingsData] = useState<SettingsData[]>([]);

  /**
   * Handle storing data and changing state.
   * @param key
   * @param data
   */
  function handleChange(key: string, data: any) {
    // Attempt to serialize data
    // JSON.stringify(data);
  }

  /**
   * Set the settings data in state.
   */
  async function initializeSettingsData() {
    // Initialize settings data once
    // Subsequent changes to settings should also be made to settingsData state

    const settingsDataTemp: SettingsData[] = [];

    // Loop through static options and get data for each
    await Promise.all(options.map(async (option) => {
      const data = await getData(option.storageKey);
      let convertedData: number | boolean;

      switch (option.type) {
        case 'number':
          // Convert number to string
          convertedData = !Number.isNaN(Number(data)) ? Number(data) : 0;

          break;
        case 'toggle':
          // Convert numbers 0/1 to boolean
          convertedData = data === '1';

          break;
        default:
          // Populate with value of 0
          convertedData = 0;
      }

      settingsDataTemp.push({
        storageKey: option.storageKey,
        value: convertedData,
      });
    }));

    setSettingsData(settingsDataTemp);
  }

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      value={settingsData.find((value) => value.storageKey === item.storageKey)?.value}
      type={item.type}
      title={item.title}
      onChange={(data) => handleChange(item.storageKey, data)}
    />
  );

  useEffect(() => {
    initializeSettingsData();
  }, []);

  return (
    <ScrollView>
      <SectionList
        sections={sections}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

export default TimerSettingsPane;
