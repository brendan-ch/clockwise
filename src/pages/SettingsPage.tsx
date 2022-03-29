import React, { useState } from 'react';
import {
  Platform,
  SectionList, StyleSheet, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from '../components/SettingsHeader';
import SettingsOption from '../components/SettingsOption';
import { checkNotifications, requestNotifications } from '../helpers/notification';
import useSettingsData from '../helpers/hooks/useSettingsData';
import useTheme from '../helpers/hooks/useTheme';
import {
  AUTO_APPEARANCE,
  AUTO_START_BREAK,
  AUTO_START_FOCUS,
  BREAK_TIME_MINUTES,
  DARK_MODE,
  ENABLE_TIMER_ALERTS,
  ENABLE_TIMER_SOUND,
  FOCUS_TIME_MINUTES,
  _24_HOUR_TIME,
} from '../StorageKeys';
import { Section, SettingsOptionProps, SettingsOptionPropsStatic } from '../types';
import NotificationOverlay from '../components/NotificationOverlay';
import ClickableText from '../components/ClickableText';
import TextStyles from '../styles/Text';
import { clearAll } from '../helpers/storage';
import handleOpenLink from '../helpers/handleOpenLink';
import { GITHUB_LINK, PRIVACY_POLICY_LINK } from '../Constants';

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
    title: '24-hour time',
    storageKey: _24_HOUR_TIME,
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

// Remove timer alerts
if (Platform.OS === 'web') {
  options.splice(3, 1);
}

/**
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  const privacyPolicyLink = PRIVACY_POLICY_LINK;
  const githubLink = GITHUB_LINK;

  const navigation = useNavigation();

  const pages: SettingsOptionProps[] = [
    {
      type: 'icon',
      title: 'Data Management',
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
  if (Platform.OS !== 'web') {
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
  }

  // Sync options with storage
  const { settingsData, handleChange } = useSettingsData(options);

  const subtractCount = Platform.OS === 'web' ? 1 : 0;
  const autoSetTheme = settingsData[7 - subtractCount]?.value as boolean;
  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: Platform.OS === 'web' ? settingsData.slice(0, 5) : settingsData.slice(0, 6),
    },
    {
      title: 'Region',
      icon: 'location-outline',
      data: Platform.OS === 'web' ? settingsData.slice(5, 6) : settingsData.slice(6, 7),
    },
    {
      title: 'Theme',
      icon: 'moon-outline',
      data: autoSetTheme
        ? settingsData.slice(7 - subtractCount, 8 - subtractCount)
        : settingsData.slice(7 - subtractCount, 9 - subtractCount),
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

  const AboveContent = (
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
  );

  const BelowContent = (
    <View
      style={{
        marginTop: 10,
        alignItems: 'center',
      }}
    >
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
        onPress={privacyPolicyLink ? () => handleOpenLink(privacyPolicyLink) : undefined}
      />
      <ClickableText
        text="Licenses"
        style={[TextStyles.textRegular, {
          color: colorValues.gray3,
          marginBottom: 30,
        }]}
        onPress={githubLink ? () => handleOpenLink(githubLink) : undefined}
      />
    </View>
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
        ListHeaderComponent={AboveContent}
        ListFooterComponent={BelowContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        isVisible={overlay === 'notification'}
        onBackdropPress={() => setOverlay('none')}
        backdropOpacity={0.3}
        backdropColor={colorValues.primary}
        animationIn="fadeIn"
        animationInTiming={100}
        animationOut="fadeOut"
        animationOutTiming={100}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
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
