import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
// import AppContext from '../../../AppContext';
import SettingsOption from '../../components/SettingsOption';
import { exportData } from '../../helpers/dataManagement';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import renderHeader from '../../helpers/renderers/renderHeader';
import { Section, SettingsOptionProps } from '../../types';

const options: SettingsOptionProps[] = [
  {
    title: 'Include task data',
    type: 'toggle',
    value: false,
  },
  {
    title: 'Export settings',
    type: 'icon',
    value: 'chevron-forward-outline',
  },
  {
    title: 'Import settings',
    type: 'icon',
    value: 'chevron-forward-outline',
  },
];

const sections: Section[] = [
  {
    title: 'Export',
    icon: 'exit-outline',
    data: options.slice(0, 2),
  },
  {
    title: 'Import',
    icon: 'enter-outline',
    data: options.slice(2, 3),
  },
];

/**
 * Component that lets users view the available keybindings.
 */
function ImportSettingsPane() {
  const [includeTaskData, setIncludeTaskData] = useState(false);

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

  function handlePress(item: SettingsOptionProps) {
    if (item.title === 'Include task data') {
      setIncludeTaskData(!includeTaskData);
    } else if (item.title === 'Export settings') {
      exportData(includeTaskData);
    }
  }

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
      value={item.title === 'Include task data' ? includeTaskData : item.value}
      onPress={() => handlePress(item)}
      onSelect={() => handlePress(item)}
      onChange={() => handlePress(item)}
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

export default ImportSettingsPane;
