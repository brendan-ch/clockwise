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
  {
    title: 'Break view',
    data: 'B',
    type: 'text',
    identifier: 'breakView',
  },
  {
    title: 'Start/pause timer',
    data: 'Space',
    type: 'text',
    identifier: 'startTimer',
  },
  {
    title: 'Reset timer',
    data: 'R',
    type: 'text',
    identifier: 'resetTimer',
  },
  {
    title: 'Add task',
    data: 'A, +, =',
    type: 'text',
    identifier: 'addTask',
  },
  {
    title: 'Expand/close task',
    data: '0-9 (for first 10 tasks)',
    type: 'text',
    identifier: 'openTask',
  },
  {
    title: 'Edit estimated sessions',
    data: 'E',
    type: 'text',
    identifier: 'editEstimatedSessions',
  },
  {
    title: 'Select task',
    data: 'S',
    type: 'text',
    identifier: 'selectTask',
  },
  {
    title: 'Delete task',
    data: 'Backspace',
    type: 'text',
    identifier: 'deleteTask',
  },
];

const sections: Section[] = [
  {
    title: 'Timer',
    icon: 'timer-outline',
    data: options.slice(0, 4),
  },
  {
    title: 'Task management',
    icon: 'checkbox',
    data: options.slice(4, 9),
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
