import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
import SettingsOption from '../../components/SettingsOption';
import renderHeader from '../../helpers/renderers/renderHeader';
import { Section, SettingsOptionPropsNoStorage } from '../../types';

const options: SettingsOptionPropsNoStorage[] = [
  {
    title: 'Focus view',
    data: 'F',
    type: 'text',
    identifier: 'focusView',
  },
];

const sections: Section[] = [
  {
    title: 'Timer',
    icon: 'timer-outline',
    data: options.slice(0, 1),
  },
];

/**
 * Component that lets users view the available keybindings.
 */
function Keybindings() {
  // Name of the storage key selected out of options
  // Note that storage key is only used as an identifier in this case
  const [keyboardSelected, setKeyboardSelected] = useState<string | undefined>(undefined);

  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].identifier);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item }: { item: SettingsOptionPropsNoStorage }) => (
    <SettingsOption
      value={item.data}
      type={item.type}
      title={item.title}
      keyboardSelected={keyboardSelected === item.identifier}
    />
  );

  return (
    <SectionList
      keyExtractor={(item) => item.identifier}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
    />
  );
}

export default Keybindings;
