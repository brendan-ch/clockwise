import React, { useContext, useEffect } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import renderHeader from '../../helpers/renderers/renderHeader';
import SettingsOption from '../../components/SettingsOption';
import { SettingsOptionProps, Section } from '../../types';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import { clearAll } from '../../helpers/storage';

// Store all static option data in here
// Make it easier to find and filter settings
const options: SettingsOptionProps[] = [
  {
    title: 'Reset all data',
    onPress: () => {
      clearAll();
    },
    type: 'icon',
    value: 'close-circle-outline',
  },
];

/**
 * Debug settings, should only be displayed while in development mode.
 */
function DebugSettingsPane() {
  const sections: Section[] = [
    {
      title: 'Debugging',
      icon: 'bug-outline',
      data: options.slice(0, 1),
    },
  ];
  // const [selected, setSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);

  // Set keyboard selected by storage key
  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect(
    keyboardGroup,
    options,
    'title',
  );

  /**
   * Clear keyboardSelected, and call setSelected.
   */
  // function handleSelectAndResetKeyboard(key?: string) {
  //   if (keyboardSelected !== key) {
  //     setKeyboardSelected(undefined);
  //   }

  //   setSelected(key);
  // }

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item }: { item: SettingsOptionProps, index: number }) => (
    <SettingsOption
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      // selected={selected === item.title}
      onPress={() => {
        if (item.onPress) {
          item.onPress();
        }
      }}
      keyboardSelected={keyboardSelected === item.title}
      indicator={keyboardSelected === item.title ? '↑↓' : undefined}
    />
  );

  return (
    <SectionList
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
    />
  );
}

export default DebugSettingsPane;
