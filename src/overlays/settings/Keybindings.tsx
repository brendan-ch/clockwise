import React, { useContext, useEffect } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
// import AppContext from '../../../AppContext';
import SettingsOption from '../../components/SettingsOption';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import renderHeader from '../../helpers/renderers/renderHeader';
import { Section, SettingsOptionProps } from '../../types';

const options: SettingsOptionProps[] = [
  {
    title: 'Open settings',
    value: 'Cmd/Ctrl + ,',
    type: 'text',
    // identifier: 'openSettings',
  },
  {
    title: 'Focus mode',
    value: 'F',
    type: 'text',
    // identifier: 'focusView',
  },
  {
    title: 'Short break mode',
    value: 'B',
    type: 'text',
    // identifier: 'breakView',
  },
  {
    title: 'Long break mode',
    value: 'L',
    type: 'text',
  },
  {
    title: 'Start/pause timer',
    value: 'Space',
    type: 'text',
    // identifier: 'startTimer',
  },
  {
    title: 'Reset timer',
    value: 'R',
    type: 'text',
    // identifier: 'resetTimer',
  },
  {
    title: 'Add task',
    value: 'A, +, =',
    type: 'text',
    // identifier: 'addTask',
  },
  {
    title: 'Expand/close task',
    value: '0-9 (for first 10 tasks)',
    type: 'text',
    // identifier: 'openTask',
  },
  {
    title: 'Edit estimated sessions',
    value: 'E',
    type: 'text',
    // identifier: 'editEstimatedSessions',
  },
  {
    title: 'Select task',
    value: 'S',
    type: 'text',
    // identifier: 'selectTask',
  },
  {
    title: 'Delete task',
    value: 'Backspace',
    type: 'text',
    // identifier: 'deleteTask',
  },
  {
    title: 'Complete task',
    value: 'Cmd/Ctrl + Enter',
    type: 'text',
    // identifier: 'completeTask',
  },
];

const sections: Section[] = [
  {
    title: 'General',
    icon: 'settings-outline',
    data: options.slice(0, 1),
  },
  {
    title: 'Timer',
    icon: 'timer-outline',
    data: options.slice(1, 6),
  },
  {
    title: 'Task management',
    icon: 'checkbox',
    data: options.slice(6, 11),
  },
];

/**
 * Component that lets users view the available keybindings.
 * @todo Re-enable keybindings for navigation after `useKeyboardSelect` hook is implemented
 */
function Keybindings() {
  // Name of the storage key selected out of options
  // Note that storage key is only used as an identifier in this case
  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);
  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect(
    keyboardGroup,
    options,
    'title',
  );

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      keyboardSelected={keyboardSelected === item.title}
      indicator={keyboardSelected === item.title ? '↑↓' : undefined}
    />
  );

  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
    />
  );
}

export default Keybindings;
