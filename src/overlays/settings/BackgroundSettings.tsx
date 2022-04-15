import React, { useContext, useEffect, useState } from 'react';
import { Platform, SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import renderHeader from '../../helpers/renderers/renderHeader';
import SettingsOption from '../../components/SettingsOption';
// import { checkNotifications, requestNotifications } from '../../helpers/notification';
import useSettingsData from '../../helpers/hooks/useSettingsData';
import {
  AUTO_APPEARANCE,
  DARK_MODE,
  ENABLE_BACKGROUND,
  // THEME,
  _24_HOUR_TIME,
} from '../../StorageKeys';
import { SettingsOptionProps, Section, SettingsOptionPropsStatic } from '../../types';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import useWindowSize from '../../helpers/hooks/useWindowSize';
import useTheme from '../../helpers/hooks/useTheme';

// Store all static option data in here
// Make it easier to find and filter settings
const options: SettingsOptionPropsStatic[] = [
  {
    type: 'toggle',
    title: 'Enable Unsplash background',
    storageKey: ENABLE_BACKGROUND,
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

/**
 * Timer settings content in the settings overlay.
 */
function BackgroundSettingsPane() {
  const { settingsData, handleChange } = useSettingsData(options);
  const windowSize = useWindowSize();
  const colors = useTheme();

  const autoSetTheme = settingsData[2]?.value as boolean;
  const sections: Section[] = [
    {
      title: 'Region',
      icon: 'location-outline',
      data: settingsData.slice(1, 2),
    },
    {
      title: 'Theme',
      icon: 'moon-outline',
      data: autoSetTheme ? settingsData.slice(2, 3) : settingsData.slice(2, 2),
    },
  ];
  if (windowSize === 'landscape') {
    sections.unshift({
      title: 'Background',
      icon: 'image-outline',
      data: settingsData.slice(0, 1),
    });
  }

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
    if (key && keyboardSelected !== key && Platform.OS === 'web') {
      setKeyboardSelected(key);
    }

    // Set keyboard group to input
    setKeyboardGroup(key ? 'input' : 'settingsPage');
    setSelected(key);
  }

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item, index }: { item: SettingsOptionProps, index: number }) => {
    let indicator = keyboardSelected === item.title ? '→ to select' : undefined;
    if (selected === item.title) {
      indicator = 'Enter to save';
    }
    return (
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

          const i = options.findIndex((option) => option.title === item.title);

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
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: windowSize === 'landscape' ? 0 : 10,
      }}
    />
  );
}

export default BackgroundSettingsPane;
