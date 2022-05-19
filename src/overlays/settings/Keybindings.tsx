// @ts-nocheck

import React, { useContext, useEffect, useRef } from 'react';
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
    title: 'Fast-forward to next session',
    value: 'S',
    type: 'text',
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
    title: 'Delete task',
    value: 'Backspace',
    type: 'text',
    // identifier: 'deleteTask',
  },
  {
    title: 'Select task',
    value: 'Cmd/Ctrl + Enter',
    type: 'text',
    subtitle: 'Only works when timer is stopped and in focus mode.',
  },
  {
    title: 'Complete task',
    value: 'Cmd/Ctrl + Enter',
    type: 'text',
    subtitle: 'Only works when timer is running and in focus mode.',
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
    data: options.slice(1, 7),
  },
  {
    title: 'Task management',
    icon: 'checkbox',
    data: options.slice(7, options.length),
  },
];

/**
 * Component that lets users view the available keybindings.
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

  const listRef = useRef<SectionList>();

  /**
   * Handle automatic scrolling for keyboard selections.
   * @param to
   */
  function handleAutoScroll(to: string, pos = 0) {
    // Search through sections to find the correct indices
    let sectionIndex = -1;
    let itemIndex = -1;

    sections.forEach((section, sIndex) => {
      section.data.forEach((item, iIndex) => {
        if (item.title === to) {
          sectionIndex = sIndex;
          itemIndex = iIndex;
        }
      });
    });

    if (sectionIndex < 0 || itemIndex < 0) {
      return;
    }

    listRef?.current?.scrollToLocation({
      sectionIndex,
      itemIndex,
      viewPosition: pos,
    });
  }

  useEffect(() => {
    handleAutoScroll(keyboardSelected, 0.5);
  }, [keyboardSelected]);

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      multilineTitle
      /* eslint-disable react/jsx-props-no-spreading */
      {...item}
      keyboardSelected={keyboardSelected === item.title}
      indicator={keyboardSelected === item.title ? '↑↓' : undefined}
    />
  );

  return (
    <SectionList
      ref={listRef}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
    />
  );
}

export default Keybindings;
