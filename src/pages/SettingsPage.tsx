import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
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
  ENABLE_TIMER_ALERTS,
} from '../StorageKeys';
import { Section, SettingsOptionProps } from '../types';
import NotificationOverlay from '../components/NotificationOverlay';
import ClickableText from '../components/ClickableText';
import TextStyles from '../styles/Text';
import { clearAll } from '../helpers/storage';
import AppContext from '../../AppContext';
import { LONG_BREAK_OPTION_INDEX, TIMER_ALERTS_OPTION_INDEX, options } from '../overlays/settings/TimerSettings';
import { SETTINGS_OPTION_HEIGHT } from '../Constants';

/**
 * Component containing content for the settings page for mobile.
 */
function SettingsPage() {
  const colorValues = useTheme();

  const navigation = useNavigation();

  const { setCurrentSessionNum } = useContext(AppContext);

  const pages: SettingsOptionProps[] = [
    {
      type: 'icon',
      title: 'Appearance',
      onPress: () => {
        // @ts-ignore
        navigation.navigate('Appearance');
      },
      value: 'chevron-forward-outline',
    },
    {
      type: 'icon',
      title: 'Data Management',
      onPress: () => {
        // @ts-ignore
        navigation.navigate('Data Management');
      },
      value: 'chevron-forward-outline',
    },
    {
      type: 'icon',
      title: 'About',
      onPress: () => {
        // @ts-ignore
        navigation.navigate('About');
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
    options[TIMER_ALERTS_OPTION_INDEX].validator = async (data) => {
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
      setNotificationOverlay(true);

      return false;
    };
  }

  options[LONG_BREAK_OPTION_INDEX].validator = async () => {
    // Reset session count
    setCurrentSessionNum(0);

    return true;
  };

  // Sync options with storage
  const { settingsData, handleChange } = useSettingsData(options);

  const sections: Section[] = [
    {
      title: 'Timer',
      icon: 'timer-outline',
      data: settingsData.slice(0, settingsData[5]?.value ? 7 : 6),
      offset: 0,
    },
    {
      title: 'Sounds and alerts',
      icon: 'notifications-outline',
      data: settingsData.slice(7, settingsData.length - (Platform.OS === 'web' ? 1 : 0)),
      offset: 7,
    },
  ];
  // Overlay to display
  const [notificationOverlay, setNotificationOverlay] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const listRef = useRef<SectionList>();

  /**
   * Handle automatic scrolling in the settings page.
   * @param to
   * @param pos
   * @returns
   * @todo Support multiple section indices
   */
  function handleAutoScroll(to: string, pos = 0) {
    const index = settingsData.findIndex((value) => value.title === to);
    if (index < 4) return;

    listRef?.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: index,
      viewPosition: pos,
    });
  }

  // Handle auto scrolling
  useEffect(() => {
    if (selected) {
      handleAutoScroll(selected, 0.3);
    }
  }, [selected]);

  const renderHeader = ({ section }: { section: Section }) => (
    <SettingsHeader
      title={section.title}
      icon={section.icon}
    />
  );

  const renderItem = (
    { item, index, section }: { item: SettingsOptionProps, index: number, section: Section },
  ) => (
    <SettingsOption
      multilineTitle
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
        if (section.data[index].validator) {
          // @ts-ignore
          const result = await section.data[index].validator();

          if (!result) return;
        }

        const i = section.offset + index;

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
        marginBottom: 10,
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
    </View>
  );

  return (
    <View
      style={[styles.container, {
        backgroundColor: colorValues.background,
      }]}
    >
      {/* @ts-ignore */}
      <SectionList
        ref={listRef}
        style={styles.sectionList}
        keyExtractor={(item) => item.title!}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        ListHeaderComponent={AboveContent}
        ListFooterComponent={BelowContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        scrollToOverflowEnabled
        overScrollMode="auto"
        getItemLayout={(_, index) => ({
          // Item height
          length: SETTINGS_OPTION_HEIGHT,
          index,
          offset: index * SETTINGS_OPTION_HEIGHT,
        })}
      />
      <Modal
        isVisible={notificationOverlay}
        onBackdropPress={() => setNotificationOverlay(false)}
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
          onClose={() => setNotificationOverlay(true)}
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
