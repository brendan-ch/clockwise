import React, { useState } from 'react';
import {
  Linking,
  Platform,
  SectionList, StyleSheet, View,
} from 'react-native';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from '../components/SettingsHeader';
import SettingsOption from '../components/SettingsOption';
import { checkNotifications, requestNotifications } from '../helpers/notification';
import useSettingsData from '../helpers/hooks/useSettingsData';
import useTheme from '../helpers/hooks/useTheme';
import {
  AUTO_APPEARANCE,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
} from '../StorageKeys';
import { Section, SettingsOptionProps, SettingsOptionPropsStatic } from '../types';
import NotificationOverlay from '../components/NotificationOverlay';
import ClickableText from '../components/ClickableText';
import TextStyles from '../styles/Text';
import { clearAll } from '../helpers/storage';

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
  },
  {
    type: 'toggle',
    title: 'Automatically set theme',
    storageKey: AUTO_APPEARANCE,
  },
  {
    type: 'toggle',
    title: 'Enable dark mode',
    storageKey: DARK_MODE,
  },
];

/**
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink;
  const githubLink = Constants.manifest?.extra?.githubLink;

  const navigation = useNavigation();

  const pages: SettingsOptionProps[] = [
    {
      type: 'icon',
      title: 'Data management',
      onPress: () => {
        // @ts-ignore
        navigation.navigate('Data Management');
      },
      value: 'chevron-forward-outline',
    },
  ];

  checkNotifications()
    .then((value) => {
      const option = options.find(
        (filterOption) => filterOption.storageKey === ENABLE_TIMER_ALERTS,
      );
      if (option) {
        option.subtitle = !value.granted ? 'To use timer alerts, enable notifications for this app.' : undefined;
      }
    });

  // Assign validator keys here
  options.filter(
    (value) => value.storageKey === ENABLE_TIMER_ALERTS,
  )[0].validator = async (data) => {
    if (data === false) return true;
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

  // Sync options with storage
  const { settingsData, handleChange } = useSettingsData(options);

  const autoSetTheme = settingsData[4]?.value as boolean;
  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: Platform.OS === 'web' ? settingsData.slice(0, 3) : settingsData.slice(0, 4),
    },
    {
      title: 'Theme',
      icon: 'moon-outline',
      data: autoSetTheme ? settingsData.slice(4, 5) : settingsData.slice(4, 6),
    },
  ];
  // Overlay to display
  const [overlay, setOverlay] = useState<'none' | 'notification'>('none');
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const renderHeader = ({ section }: { section: Section }) => (
    <SettingsHeader
      title={section.title}
      icon={section.icon}
    />
  );

  const renderItem = ({ item, index }: { item: SettingsOptionProps, index: number }) => (
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
      onChange={async (newData: any) => {
        if (options[index].validator) {
          // @ts-ignore
          const result = await options[index].validator();

          if (!result) return;
        }

        const i = options.findIndex((value) => value.title === item.title);

        handleChange(
          i,
          newData,
        );
      }}
    />
  );

  return (
    <View
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {pages.map((item) => (
          <SettingsOption
            {...item}
            key={item.title!}
            titleStyle={TextStyles.textBold}
          />
        ))}
      </View>
      <SectionList
        style={styles.sectionList}
        keyExtractor={(item) => item.title!}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
      />
      {process.env.NODE_ENV === 'development' ? (
        <ClickableText
          text="Reset all data"
          style={[TextStyles.textRegular, {
            color: colorValues.gray3,
            marginBottom: 10,
          }]}
          onPress={() => clearAll()}
        />
      ) : undefined}
      <ClickableText
        text="Privacy Policy"
        style={[TextStyles.textRegular, {
          color: colorValues.gray3,
          marginBottom: 10,
        }]}
        onPress={privacyPolicyLink ? () => Linking.openURL(privacyPolicyLink) : undefined}
      />
      <ClickableText
        text="Licenses"
        style={[TextStyles.textRegular, {
          color: colorValues.gray3,
          marginBottom: 30,
        }]}
        onPress={githubLink ? () => Linking.openURL(githubLink) : undefined}
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
