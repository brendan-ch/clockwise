import React, { useState } from 'react';
import {
  Platform,
  SectionList, StyleSheet, View,
} from 'react-native';
import Modal from 'react-native-modal';
import SettingsHeader from '../components/SettingsHeader';
import SettingsOption from '../components/SettingsOption';
import { checkNotifications, requestNotifications } from '../helpers/notification';
import { getData } from '../helpers/storage';
import useSettingsData from '../helpers/hooks/useSettingsData';
import useTheme from '../helpers/hooks/useTheme';
import {
  BREAK_TIME_MINUTES,
  ENABLE_BACKGROUND_TIMER,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
} from '../StorageKeys';
import { Section, SettingsOptionProps, SettingsOptionPropsStatic } from '../types';
import NotificationOverlay from '../components/NotificationOverlay';

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
  // {
  //   type: 'toggle',
  //   title: 'Auto start timers?',
  //   storageKey: AUTO_START_TIMERS,
  // },
  {
    type: 'toggle',
    title: 'Background timer',
    storageKey: ENABLE_BACKGROUND_TIMER,
  },
  {
    type: 'toggle',
    title: 'Timer alerts (requires background timer)',
    storageKey: ENABLE_TIMER_ALERTS,
  },
];

/**
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  // Sync options with settings data
  // const { settingsData, handleChange, handleSelect } = useSettingsData(options);
  const settingsData = useSettingsData(options);

  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: Platform.OS === 'web' ? settingsData.slice(0, 3) : settingsData.slice(0, 5),
    },
  ];
  // Overlay to display
  const [overlay, setOverlay] = useState<'none' | 'notification'>('none');
  const [selected, setSelected] = useState<string | undefined>(undefined);

  // Assign validator keys here
  options.filter(
    (value) => value.storageKey === ENABLE_TIMER_ALERTS,
  )[0].validator = async (data) => {
    if (data === false) return true;

    // First check if background timer enabled
    const backgroundTimerValue = await getData(ENABLE_BACKGROUND_TIMER);
    if (backgroundTimerValue !== '1') return false;

    // Check if permissions enabled
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

    // Display modal here explaining how to enable notifications
    setOverlay('notification');

    return false;
  };

  const renderHeader = ({ section }: { section: Section }) => (
    <SettingsHeader
      title={section.title}
      icon={section.icon}
    />
  );

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      onPress={() => {
        if (item.type === 'number') {
          setSelected(item.title);
        } else {
          setSelected(undefined);
        }
      }}
      onSelect={() => setSelected(item.title)}
      onDeselect={() => setSelected(undefined)}
      selected={selected === item.title}

      // value={settingsData.find((value) => value.storageKey === item.storageKey)?.value}
      // selected={settingsData.find((value) => value.storageKey === item.storageKey)?.selected}
      // type={item.type}
      // title={item.title}
      // onChange={async (data) => {
      //   // Validate data first
      //   if (item.validator) {
      //     const result = await item.validator(data);
      //     if (!result) return;
      //   }

      //   // Handle change
      //   handleChange(item.storageKey, data);
      // }}
      // onPress={() => {
      //   if (item.type === 'number') {
      //     handleSelect(item.storageKey);
      //   } else {
      //     handleSelect();
      //   }
      // }}
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
        keyExtractor={(item) => item.title!}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
      />
      <Modal
        isVisible={overlay === 'notification'}
        onBackdropPress={() => setOverlay('none')}
        backdropOpacity={0.3}
        backdropColor={colorValues.primary}
        animationIn="fadeIn"
        animationInTiming={20}
        animationOut="fadeOut"
        animationOutTiming={20}
        backdropTransitionInTiming={20}
        backdropTransitionOutTiming={20}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NotificationOverlay
          onClose={() => setOverlay('none')}
        />
      </Modal>
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
